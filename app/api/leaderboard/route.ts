import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeString, formatCityName } from '@/lib/city-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'national';
    const rawCity = searchParams.get('city') || '';
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const timeframe = searchParams.get('timeframe') || 'all-time';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const normalizedCity = normalizeString(rawCity);
    const normalizedSearch = normalizeString(search);

    const whereClause: any = {
      status: 'VERIFIED',
    };

    if (timeframe === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      whereClause.updatedAt = { gte: todayStart };
    }

    if (scope === 'city' && normalizedCity) {
      whereClause.normalizedCity = normalizedCity;
    }

    if (normalizedSearch) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (cuisine && cuisine.toLowerCase() !== 'all') {
      whereClause.cuisine = { equals: cuisine, mode: 'insensitive' };
    }

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
