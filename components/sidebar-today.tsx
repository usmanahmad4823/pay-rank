'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';
import { LeaderboardItem } from '@/components/leaderboard-table';
import { useCurrency } from '@/components/currency-context';

interface SidebarTodayProps {
  items: LeaderboardItem[];
  title?: string;
  onSelectRestaurant?: (item: LeaderboardItem) => void;
  onSeeAll?: () => void;
}

export function SidebarToday({ items, title = "Today's ranking", onSelectRestaurant, onSeeAll }: SidebarTodayProps) {
  const { formatAmount } = useCurrency();
  const displayItems = items.slice(0, 10);

  return (
    <aside className="w-full bg-white rounded-[20px] sm:rounded-[24px] p-3 sm:p-3.5 shadow-sm border border-stone-100/90 space-y-2">
      {/* Header line */}
      <div className="flex items-center justify-between px-0.5 pb-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-coral-500 flex-shrink-0" />
          <h3 className="font-bold text-stone-900 text-xs tracking-tight">{title}</h3>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-[11px] font-medium text-coral-500 hover:text-coral-600 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>See all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* List items (Top 10) */}
      <div className="space-y-0.5">
        {displayItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectRestaurant && onSelectRestaurant(item)}
            className="flex items-center justify-between gap-2 text-[11px] group cursor-pointer py-0.5 px-1 rounded-md hover:bg-stone-50 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-stone-400 font-medium text-[10px] w-3.5 flex-shrink-0 text-left">
                #{idx + 1}
              </span>
              <img
                src={item.logoUrl}
                alt={item.name}
                className="w-[22px] h-[22px] rounded-full object-cover flex-shrink-0 border border-stone-100 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&q=80';
                }}
              />
              <span className="font-normal text-[11px] text-stone-800 truncate group-hover:text-coral-500 transition-colors">
                {item.name}
              </span>
            </div>

            <span className="font-bold text-coral-500 font-money text-[11px] flex-shrink-0 ml-1">
              {formatAmount(item.totalPaidCents)}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
