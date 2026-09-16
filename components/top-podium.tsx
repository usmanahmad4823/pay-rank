'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Sparkles, MapPin, Tag, TrendingUp, Trophy } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';
import { useCurrency } from '@/components/currency-context';

interface PodiumItem {
  id: string;
  name: string;
  city: string;
  normalizedCity: string;
  cuisine?: string | null;
  description?: string | null;
  logoUrl: string;
  totalPaidCents: number;
  rank: number;
}

interface TopPodiumProps {
  topItems: PodiumItem[];
  cityName?: string;
  onTopUpRestaurant?: (restaurant: PodiumItem) => void;
}

export function TopPodium({ topItems, cityName, onTopUpRestaurant }: TopPodiumProps) {
  const { formatAmount } = useCurrency();

  if (!topItems || topItems.length === 0) return null;

  const rank1 = topItems.find((item) => item.rank === 1) || topItems[0];
  const rank2 = topItems.find((item) => item.rank === 2) || topItems[1];
  const rank3 = topItems.find((item) => item.rank === 3) || topItems[2];

  return (
    <section className="relative w-full py-6 sm:py-10 mb-8 bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-outbid-card overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-coral-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5 text-coral-500" />
          {cityName ? `${cityName} Champions` : 'Top Podium Leaders'}
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          The Highest Paying <span className="text-coral-500 font-black">Restaurants</span>
        </h2>
        <p className="text-stone-500 text-xs mt-1 max-w-md mx-auto">
          Rankings are calculated strictly by money paid. Highest total holds rank #1.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end max-w-4xl mx-auto">
        {/* RANK #2 - SILVER */}
        {rank2 ? (
          <div className="order-2 md:order-1 flex flex-col items-center group">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xs bg-white group-hover:scale-105 transition-transform">
                <img
                  src={rank2.logoUrl}
                  alt={rank2.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-stone-200 text-stone-900 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                #2
              </div>
            </div>

            <div className="w-full bg-stone-50 p-4 rounded-xl text-center border border-stone-200 flex flex-col items-center space-y-1">
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate max-w-[180px]" title={rank2.name}>
                {rank2.name}
              </h3>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <Link
                  href={`/city/${encodeURIComponent(rank2.normalizedCity)}`}
                  className="hover:text-coral-500 font-semibold"
                >
                  {rank2.city}
                </Link>
                {rank2.cuisine && <span>• {rank2.cuisine}</span>}
              </div>

              <div className="px-3 py-1 rounded-full bg-white text-stone-900 font-money font-black text-xs border border-stone-200 mt-1">
                {formatAmount(rank2.totalPaidCents)}
              </div>

              {onTopUpRestaurant && (
                <button
                  onClick={() => onTopUpRestaurant(rank2)}
                  className="mt-2 text-[11px] text-coral-600 font-bold hover:underline flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" /> Overtake #1
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* RANK #1 - GOLD */}
        {rank1 ? (
          <div className="order-1 md:order-2 flex flex-col items-center group">
            <div className="relative mb-2">
              <Crown className="w-8 h-8 text-coral-500 fill-coral-500 mx-auto mb-1 animate-bounce" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-coral-500 shadow-md bg-white group-hover:scale-105 transition-transform duration-300">
                <img
                  src={rank1.logoUrl}
                  alt={rank1.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-coral-500 text-white font-black text-[10px] uppercase tracking-wider shadow-coral-pill whitespace-nowrap">
                #1 CHAMPION
              </div>
            </div>

            <div className="w-full bg-coral-50/80 p-4 rounded-xl text-center border border-coral-200 flex flex-col items-center space-y-1">
              <h3 className="font-heading font-black text-stone-900 text-sm sm:text-base truncate max-w-[200px]" title={rank1.name}>
                {rank1.name}
              </h3>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-semibold">
                <Link
                  href={`/city/${encodeURIComponent(rank1.normalizedCity)}`}
                  className="hover:text-coral-500"
                >
                  {rank1.city}
                </Link>
                {rank1.cuisine && <span>• {rank1.cuisine}</span>}
              </div>

              <div className="px-3.5 py-1 rounded-full bg-coral-500 text-white font-money font-black text-sm shadow-coral-pill mt-1">
                {formatAmount(rank1.totalPaidCents)}
              </div>

              {onTopUpRestaurant && (
                <button
                  onClick={() => onTopUpRestaurant(rank1)}
                  className="mt-2 text-[11px] text-coral-600 font-extrabold hover:underline flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" /> Defend Rank #1
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* RANK #3 - BRONZE */}
        {rank3 ? (
          <div className="order-3 flex flex-col items-center group">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-600/60 shadow-xs bg-white group-hover:scale-105 transition-transform">
                <img
                  src={rank3.logoUrl}
                  alt={rank3.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                #3
              </div>
            </div>

            <div className="w-full bg-stone-50 p-4 rounded-xl text-center border border-stone-200 flex flex-col items-center space-y-1">
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate max-w-[180px]" title={rank3.name}>
                {rank3.name}
              </h3>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <Link
                  href={`/city/${encodeURIComponent(rank3.normalizedCity)}`}
                  className="hover:text-coral-500 font-semibold"
                >
                  {rank3.city}
                </Link>
                {rank3.cuisine && <span>• {rank3.cuisine}</span>}
              </div>

              <div className="px-3 py-1 rounded-full bg-white text-stone-900 font-money font-black text-xs border border-stone-200 mt-1">
                {formatAmount(rank3.totalPaidCents)}
              </div>

              {onTopUpRestaurant && (
                <button
                  onClick={() => onTopUpRestaurant(rank3)}
                  className="mt-2 text-[11px] text-coral-600 font-bold hover:underline flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" /> Climb Rank
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

