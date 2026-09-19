'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/components/currency-context';

interface PublicProjectStatsProps {
  totalCount?: number;
}

export function PublicProjectStats({ totalCount }: PublicProjectStatsProps) {
  const { formatAmount } = useCurrency();
  const [stats, setStats] = useState<{
    totalRevenueCents: number;
    totalVerifiedRestaurants: number;
    baseVisitors: number;
    daysSinceLaunch: number;
  }>({
    totalRevenueCents: 0,
    totalVerifiedRestaurants: totalCount || 0,
    baseVisitors: 1,
    daysSinceLaunch: 27,
  });

  useEffect(() => {
    let isMounted = true;

    async function recordAndFetchStats() {
      try {
        // 1. Record pageview visit in real-time database (non-blocking)
        fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: typeof window !== 'undefined' ? window.location.pathname : '/' }),
        }).catch(() => {});

        // 2. Fetch updated real-time stats from database
        const res = await fetch('/api/stats');
        const data = await res.json();

        if (data && data.success && isMounted) {
          setStats({
            totalRevenueCents: data.totalRevenueCents || 0,
            totalVerifiedRestaurants: data.totalVerifiedRestaurants || totalCount || 0,
            baseVisitors: Math.max(1, data.baseVisitors || 1),
            daysSinceLaunch: data.daysSinceLaunch || 27,
          });
        }
      } catch (err) {
        console.error('Failed to fetch realtime stats:', err);
      }
    }

    recordAndFetchStats();

    // Poll every 4 seconds for real-time live updates
    const interval = setInterval(recordAndFetchStats, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [totalCount]);

  const restaurantCount = stats.totalVerifiedRestaurants || totalCount || 0;
  const visitorCount = Math.max(1, stats.baseVisitors || 1);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 my-10 space-y-6 text-center">
      <p className="text-xs sm:text-sm text-stone-600 font-medium">
        Live stats about <span className="text-coral-500 font-bold">PayRank network</span> since launch {stats.daysSinceLaunch} days ago
      </p>

      {/* 3 Stat Cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Realtime Visitors */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-0.5">
          <div className="flex items-center gap-2 font-mono font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span>{visitorCount.toLocaleString()}</span>
          </div>
          <span className="text-stone-500 text-xs font-medium">visitors</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-0.5">
          <div className="flex items-center gap-1 font-mono font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
            <span>{formatAmount(stats.totalRevenueCents)}</span>
          </div>
          <span className="text-stone-500 text-xs font-medium font-sans">total revenue</span>
        </div>

        {/* Restaurants listed */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-0.5">
          <div className="font-mono font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
            {restaurantCount.toLocaleString()}
          </div>
          <span className="text-stone-500 text-xs font-medium">restaurants listed</span>
        </div>
      </div>

      {/* Footer Attribution Line */}
      <div className="space-y-2 pt-2 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-600">
          <span className="text-coral-500 font-extrabold">PayRank</span> — #1 Pay-to-Rank Restaurant Directory in Pakistan
        </p>

        <div className="flex items-center justify-center gap-2 text-coral-500 font-semibold text-[11px] flex-wrap">
          <a href="/rules" className="hover:text-coral-600 transition-colors cursor-pointer">
            Rules
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#faq" className="hover:text-coral-600 transition-colors cursor-pointer">
            FAQ
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#terms" className="hover:text-coral-600 transition-colors cursor-pointer">
            Terms
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#privacy" className="hover:text-coral-600 transition-colors cursor-pointer">
            Privacy
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#imprint" className="hover:text-coral-600 transition-colors cursor-pointer">
            Imprint
          </a>
          <span className="text-stone-300">•</span>
          <a href="#top" className="hover:text-coral-600 transition-colors cursor-pointer">
            Live stats
          </a>
        </div>
      </div>
    </section>
  );
}
