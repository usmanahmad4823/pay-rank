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
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans bg-[#FAF9F6] text-stone-900 min-h-screen flex flex-col antialiased selection:bg-coral-100 selection:text-coral-900">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


