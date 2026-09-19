import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pay-rank.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/dev/', '/checkout/success'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
