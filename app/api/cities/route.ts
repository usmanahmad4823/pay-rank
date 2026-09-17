import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cityToSlug, provinceToSlug, resolveLocationDetails } from '@/lib/city-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch all verified restaurants ordered by totalPaidCents DESC
    const restaurants = await prisma.restaurant.findMany({
      where: { status: 'VERIFIED' },
      select: {
        id: true,
        name: true,
        city: true,
        normalizedCity: true,
        province: true,
        normalizedProvince: true,
        description: true,
        logoUrl: true,
        totalPaidCents: true,
        createdAt: true,
      },
      orderBy: [
        { totalPaidCents: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    // Group by normalizedCity
    const cityMap = new Map<string, {
      city: string;
      citySlug: string;
      province: string;
      provinceSlug: string;
      restaurantCount: number;
      totalCityVolumeCents: number;
      topRestaurants: Array<{
        id: string;
        name: string;
        description?: string | null;
        logoUrl: string;
        totalPaidCents: number;
      }>;
    }>();

    for (const r of restaurants) {
      const loc = resolveLocationDetails(r.city, r.province);
      const key = loc.normalizedCity;

      if (!cityMap.has(key)) {
        cityMap.set(key, {
          city: loc.displayCity,
          citySlug: loc.citySlug,
          province: loc.province,
          provinceSlug: loc.provinceSlug,
          restaurantCount: 1,
          totalCityVolumeCents: r.totalPaidCents,
          topRestaurants: [
            {
              id: r.id,
              name: r.name,
              description: r.description,
              logoUrl: r.logoUrl,
              totalPaidCents: r.totalPaidCents,
            },
          ],
        });
      } else {
        const existing = cityMap.get(key)!;
        existing.restaurantCount += 1;
        existing.totalCityVolumeCents += r.totalPaidCents;
        if (existing.topRestaurants.length < 3) {
          existing.topRestaurants.push({
            id: r.id,
            name: r.name,
            description: r.description,
            logoUrl: r.logoUrl,
            totalPaidCents: r.totalPaidCents,
          });
        }
      }
    }

    const cityList = Array.from(cityMap.values()).sort((a, b) => b.totalCityVolumeCents - a.totalCityVolumeCents);

    return NextResponse.json({
      success: true,
      cities: cityList,
      totalCities: cityList.length,
    });
  } catch (error) {
    console.error('Error fetching city directory API:', error);
    return NextResponse.json({ error: 'Failed to fetch city directory' }, { status: 500 });
  }
}
