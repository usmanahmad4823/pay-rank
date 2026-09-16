import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatCityName } from '@/lib/city-utils';

export async function GET() {
  try {
    const citiesGroup = await prisma.restaurant.groupBy({
      by: ['normalizedCity'],
      where: {
        status: 'VERIFIED',
      },
      _count: {
        id: true,
      },
      _sum: {
        totalPaidCents: true,
      },
      orderBy: {
        _sum: {
          totalPaidCents: 'desc',
        },
      },
    });

    // Also fetch sample original city string for nice formatting
    const cities = await Promise.all(
      citiesGroup.map(async (group) => {
        const sample = await prisma.restaurant.findFirst({
          where: { normalizedCity: group.normalizedCity, status: 'VERIFIED' },
          select: { city: true },
        });

        return {
          normalizedCity: group.normalizedCity,
          displayName: sample?.city ? formatCityName(sample.city) : formatCityName(group.normalizedCity),
          count: group._count.id,
          totalPaidCents: group._sum.totalPaidCents || 0,
        };
      })
    );

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
