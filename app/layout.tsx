import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

import { ToastProvider } from '@/components/toast-notification';
import { CurrencyProvider } from '@/components/currency-context';

export const metadata: Metadata = {
  title: 'PayRank — Claim #1 Restaurant Rank in Pakistan',
  description: 'The premier pay-to-rank restaurant directory in Pakistan. No fake reviews, no biased algorithms. Claim rank #1 by total verified payment.',
  keywords: ['payrank', 'restaurant ranking', 'pakistan restaurants', 'leaderboard', 'pay to rank'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PayRank',
    url: 'https://pay-rank.vercel.app',
    description: 'The premier pay-to-rank restaurant directory in Pakistan. Claim rank #1 by total verified payment.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pay-rank.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#FAF9F6] text-stone-900 min-h-screen flex flex-col antialiased selection:bg-coral-100 selection:text-coral-900">
        <CurrencyProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}


