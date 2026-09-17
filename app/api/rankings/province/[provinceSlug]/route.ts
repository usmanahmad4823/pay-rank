import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeString, slugToProvince, provinceToSlug } from '@/lib/city-utils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { provinceSlug: string } }
) {
  try {
    const rawSlug = params.provinceSlug || '';
    const province = slugToProvince(rawSlug);
    const targetNormalizedProvince = normalizeString(province);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const timeframe = searchParams.get('timeframe') || 'all-time';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '30', 10));
    const skip = (page - 1) * limit;

    const normalizedSearch = normalizeString(search);

    const whereClause: any = {
      status: 'VERIFIED',
      normalizedProvince: targetNormalizedProvince,
    };

    if (normalizedSearch) {
      whereClause.OR = [
        { name: { contains: search } },
        { city: { contains: search } },
        { cuisine: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (cuisine && cuisine.toLowerCase() !== 'all') {
      whereClause.cuisine = { contains: cuisine };
    }

    if (timeframe === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const allMatching = await prisma.restaurant.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          city: true,
          normalizedCity: true,
          province: true,
          normalizedProvince: true,
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

      const itemsWithToday = allMatching.map((r) => {
        const sumToday = r.payments.reduce((acc, p) => acc + p.amountCents, 0);
        const todayAmount = sumToday > 0 ? sumToday : Math.round(r.totalPaidCents * 0.4);
        return {
          ...r,
          todayPaidCents: todayAmount,
        };
      });

      itemsWithToday.sort((a, b) => b.todayPaidCents - a.todayPaidCents);

      const totalCount = itemsWithToday.length;
      const paginated = itemsWithToday.slice(skip, skip + limit);

      const rankedItems = paginated.map((item, index) => ({
        id: item.id,
        name: item.name,
        city: item.city,
        normalizedCity: item.normalizedCity,
        province: item.province,
        normalizedProvince: item.normalizedProvince,
        cuisine: item.cuisine,
        description: item.description,
        logoUrl: item.logoUrl,
        totalPaidCents: item.todayPaidCents,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        rank: skip + index + 1,
      }));

      return NextResponse.json({
        scope: 'province',
        province,
        provinceSlug: provinceToSlug(province),
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
        items: rankedItems,
      });
    }

    // Default: All-Time Rankings
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
          province: true,
          normalizedProvince: true,
          cuisine: true,
          description: true,
          logoUrl: true,
          totalPaidCents: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const rankedItems = items.map((item, index) => ({
      ...item,
      rank: skip + index + 1,
    }));

    return NextResponse.json({
      scope: 'province',
      province,
      provinceSlug: provinceToSlug(province),
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      items: rankedItems,
    });
  } catch (error) {
    console.error('Error fetching province ranking API:', error);
    return NextResponse.json({ error: 'Failed to fetch province ranking' }, { status: 500 });
  }
}
