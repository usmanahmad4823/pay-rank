import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Record page visit and count total visits directly in database
    let totalVisitors = 1;
    let todayVisitors = 1;

    try {
      // Record new pageview
      await prisma.pageView.create({
        data: { path: '/' },
      });

      // Count all pageviews in database
      const totalPv = await prisma.pageView.count();
      totalVisitors = Math.max(1, totalPv);

      // Also sync SiteStats table in background
      prisma.siteStats.upsert({
        where: { id: 'global' },
        update: { totalVisitors: { increment: 1 } },
        create: { id: 'global', totalVisitors: totalVisitors },
      }).catch(() => {});

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      todayVisitors = await prisma.pageView.count({
        where: { createdAt: { gte: startOfToday } },
      });
      if (todayVisitors === 0) todayVisitors = totalVisitors;
    } catch (err) {
      console.error('Visitor increment error:', err);
    }

    // 2. Total revenue cents from database
    const revenueAgg = await prisma.restaurant.aggregate({
      _sum: { totalPaidCents: true },
    });
    const totalRevenueCents = revenueAgg._sum.totalPaidCents || 0;

    // 3. Total restaurants / listings count from database
    const totalVerifiedRestaurants = await prisma.restaurant.count();

    // 4. Active cities count
    const citiesGroup = await prisma.restaurant.groupBy({
      by: ['normalizedCity'],
    });
    const activeCitiesCount = citiesGroup.length;

    // 5. Today's bids / volume
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayAgg = await prisma.payment.aggregate({
      where: {
        createdAt: { gte: startOfToday },
        status: { in: ['COMPLETED', 'SUCCEEDED'] },
      },
      _sum: { amountCents: true },
      _count: { id: true },
    });

    const todayBidsCount = todayAgg._count.id || 0;
    const todayVolumeCents = todayAgg._sum.amountCents || 0;

    // 6. Total Payment count across all time
    const totalPaymentsCount = await prisma.payment.count({
      where: { status: { in: ['COMPLETED', 'SUCCEEDED'] } },
    });

    // 7. Recent financial activities (for ticker)
    const recentPayments = await prisma.payment.findMany({
      where: { status: { in: ['COMPLETED', 'SUCCEEDED'] } },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          select: {
            name: true,
            city: true,
            totalPaidCents: true,
          },
        },
      },
    });

    let recentEvents = recentPayments.map((p) => {
      const now = Date.now();
      const diffMinutes = Math.max(1, Math.floor((now - new Date(p.createdAt).getTime()) / 60000));
      const timeAgo = diffMinutes < 60 ? `${diffMinutes}m ago` : `${Math.floor(diffMinutes / 60)}h ago`;
      const isInitial = p.restaurant.totalPaidCents === p.amountCents;

      return {
        id: p.id,
        restaurantName: p.restaurant.name,
        city: p.restaurant.city,
        action: isInitial ? ('claimed #1' as const) : ('topped up' as const),
        amountCents: p.amountCents,
        timeAgo,
      };
    });

    if (recentEvents.length === 0) {
      const recentRestaurants = await prisma.restaurant.findMany({
        take: 8,
        orderBy: { updatedAt: 'desc' },
      });

      recentEvents = recentRestaurants.map((r, idx) => ({
        id: r.id,
        restaurantName: r.name,
        city: r.city,
        action: 'claimed #1' as const,
        amountCents: r.totalPaidCents,
        timeAgo: `${(idx + 1) * 12}m ago`,
      }));
    }

    const onlineCount = Math.max(1, Math.floor(todayVisitors * 0.1) + 1);

    // Calculate days since launch date
    const launchDate = new Date('2026-08-23T00:00:00Z');
    const daysSinceLaunch = Math.max(1, Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24)));

    return NextResponse.json(
      {
        success: true,
        totalRevenueCents,
        totalVerifiedRestaurants,
        activeCitiesCount,
        todayBidsCount,
        todayVolumeCents,
        totalPaymentsCount,
        baseVisitors: Math.max(1, totalVisitors),
        todayVisitors: Math.max(1, todayVisitors),
        onlineCount,
        daysSinceLaunch,
        recentEvents,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Failed to fetch realtime stats API:', error);
    return NextResponse.json({ error: 'Failed to fetch realtime stats' }, { status: 500 });
  }
}
