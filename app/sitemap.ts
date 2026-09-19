import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pay-rank.vercel.app';

  const categories = ['Pakistani', 'Fine Dining', 'Japanese', 'Italian', 'BBQ', 'Cafes', 'Bakery', 'Fast Casual'];

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { status: 'VERIFIED' },
      select: { id: true, updatedAt: true },
      take: 100,
    });

    const restaurantEntries = restaurants.map((r) => ({
      url: `${baseUrl}/restaurant/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1.0,
      },
      ...categoryEntries,
      ...restaurantEntries,
    ];
  } catch (err) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1.0,
      },
    ];
  }
}
