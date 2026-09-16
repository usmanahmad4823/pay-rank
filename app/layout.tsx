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
  title: 'outbid.lol — Claim a rank on the public leaderboard',
  description: 'The world premier monetary public leaderboard directory. No reviews, no algorithms. Claim a rank by total verified bid amount.',
  keywords: ['outbid', 'pay to rank', 'leaderboard', 'public directory'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'outbid.lol',
    url: 'https://outbid.lol',
    description: 'The world premier monetary public leaderboard directory. Claim a rank by total verified bid amount.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://outbid.lol/search?q={search_term_string}',
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


