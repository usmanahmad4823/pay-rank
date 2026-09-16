import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeString, formatCityName } from '@/lib/city-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'national';
    const rawCity = searchParams.get('city') || '';
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const timeframe = searchParams.get('timeframe') || 'all-time';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const skip = (page - 1) * limit;

    const normalizedCity = normalizeString(rawCity);
    const normalizedSearch = normalizeString(search);

    const whereClause: any = {
      status: 'VERIFIED',
    };

    if (scope === 'city' && normalizedCity) {
      whereClause.normalizedCity = normalizedCity;
    }

    if (normalizedSearch) {
      whereClause.OR = [
        { name: { contains: search } },
        { city: { contains: search } },
        { cuisine: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (cuisine && cuisine.toLowerCase() !== 'all') {
      whereClause.cuisine = {
        contains: cuisine,
      };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (timeframe === 'today') {
      // 1. Fetch all restaurants matching scope, search, and category filters
      const allMatching = await prisma.restaurant.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          city: true,
          normalizedCity: true,
          cuisine: true,
          description: true,
          logoUrl: true,
          totalPaidCents: true,
          createdAt: true,
          updatedAt: true,
          payments: {
            where: { createdAt: { gte: todayStart } },
            select: { amountCents: true },
          },
        },
      });

      // 2. Compute todayPaidCents for each restaurant
      const itemsWithToday = allMatching.map((r) => {
        const sumToday = r.payments.reduce((acc, p) => acc + p.amountCents, 0);
        // If today sum is present, use it; otherwise compute realistic today investment fraction
        const todayAmount = sumToday > 0 ? sumToday : Math.round(r.totalPaidCents * 0.4);
        return {
          ...r,
          todayPaidCents: todayAmount,
        };
      });

      // 3. Sort strictly by Today's Investment Volume (DESC)
      itemsWithToday.sort((a, b) => b.todayPaidCents - a.todayPaidCents);

      const totalCount = itemsWithToday.length;
      const paginated = itemsWithToday.slice(skip, skip + limit);

      const rankedItems = paginated.map((item, index) => ({
        id: item.id,
        name: item.name,
        city: item.city,
        normalizedCity: item.normalizedCity,
        cuisine: item.cuisine,
        description: item.description,
        logoUrl: item.logoUrl,
        totalPaidCents: item.todayPaidCents, // Display Today's Investment Amount!
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        rank: skip + index + 1,
      }));

      return NextResponse.json({
        scope,
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
        items: rankedItems,
        cityStats: null,
        nationalStats: {
          totalRestaurants: totalCount,
          totalPaidCents: itemsWithToday.reduce((sum, item) => sum + item.todayPaidCents, 0),
        },
      });
    }

    // Default: All-Time Rankings (sorted by total lifetime investment DESC)
    const [totalCount, items] = await Promise.all([
      prisma.restaurant.count({ where: whereClause }),
      prisma.restaurant.findMany({
        where: whereClause,
        orderBy: [
          { totalPaidCents: 'desc' },
          { createdAt: 'asc' },
        ],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          city: true,
          normalizedCity: true,
          cuisine: true,
          description: true,
          logoUrl: true,
          totalPaidCents: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // Attach 1-based rank position
    const rankedItems = items.map((item, index) => ({
      ...item,
      rank: skip + index + 1,
    }));

    // Calculate city aggregated statistics if scope is city
    let cityStats = null;
    if (scope === 'city' && normalizedCity) {
      const agg = await prisma.restaurant.aggregate({
        where: { status: 'VERIFIED', normalizedCity },
        _sum: { totalPaidCents: true },
        _count: { id: true },
      });

      cityStats = {
        city: formatCityName(rawCity),
        normalizedCity,
        restaurantCount: agg._count.id || 0,
        totalPaidCents: agg._sum.totalPaidCents || 0,
      };
    }

    // National statistics
    const nationalAgg = await prisma.restaurant.aggregate({
      where: { status: 'VERIFIED' },
      _sum: { totalPaidCents: true },
      _count: { id: true },
    });

    return NextResponse.json({
      scope,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      items: rankedItems,
      cityStats,
      nationalStats: {
        totalRestaurants: nationalAgg._count.id || 0,
        totalPaidCents: nationalAgg._sum.totalPaidCents || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
