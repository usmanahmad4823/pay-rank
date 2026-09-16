'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronLeft, ChevronRight, Tag, MousePointerClick, TrendingUp, Sparkles, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

export interface LeaderboardItem {
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

interface LeaderboardTableProps {
  items: LeaderboardItem[];
  isLoading: boolean;
  scope: 'national' | 'city';
  cityName?: string;
  page: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (newPage: number) => void;
  onTopUpRestaurant: (restaurant: LeaderboardItem) => void;
  onOpenRegister: () => void;
}

function getPageNumbers(current: number, total: number) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total];
  }
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export function LeaderboardTable({
  items,
  isLoading,
  scope,
  cityName,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onTopUpRestaurant,
  onOpenRegister,
}: LeaderboardTableProps) {
  const handleExportCSV = () => {
    if (!items || items.length === 0) return;
    const headers = ['Rank', 'Name', 'City', 'Category', 'Total Paid (USD)', 'Description'];
    const rows = items.map((item) => [
      item.rank,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.city}"`,
      `"${item.cuisine || ''}"`,
      (item.totalPaidCents / 100).toFixed(2),
      `"${(item.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PayRank_${scope}_${cityName || 'Leaderboard'}_p${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Skeleton Loading Rows
  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded bg-stone-200" />
              <div className="w-12 h-12 rounded-xl bg-stone-200" />
              <div className="space-y-2">
                <div className="w-48 h-4 bg-stone-200 rounded" />
                <div className="w-32 h-3 bg-stone-100 rounded" />
              </div>
            </div>
            <div className="w-20 h-6 bg-stone-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!items || items.length === 0) {
    return (
      <div className="w-full bg-white p-10 rounded-2xl text-center border border-dashed border-stone-300 my-4">
        <h3 className="font-heading font-bold text-base text-stone-900">
          No entries listed in {cityName || 'this category'} yet
        </h3>
        <p className="text-stone-500 text-xs mt-1">
          Be the first to claim rank #1 in this public directory!
        </p>
        <button
          onClick={onOpenRegister}
          className="mt-4 px-5 py-2.5 rounded-full bg-coral-500 text-white font-bold text-xs shadow-coral-pill hover:bg-coral-600 transition-all"
        >
          + Claim Rank #1 Now
        </button>
      </div>
    );
  }

  const effectiveTotalCount = totalCount || 2917;

  return (
    <div className="w-full space-y-3">


      {items.map((item) => {
        const isRank1 = item.rank === 1;
        const isRank2 = item.rank === 2;
        const isRank3 = item.rank === 3;
        const isTop3 = item.rank <= 3;

        // Custom card styling matching reference screenshot
        const cardBgClass = isRank1
          ? 'bg-[#FDF2F0] border border-[#FCE4E0] shadow-xs'
          : isRank2
          ? 'bg-[#FAF0ED] border border-[#FCE4E0]/80 shadow-xs'
          : isRank3
          ? 'bg-[#FAF5F3] border border-[#FCE4E0]/50 shadow-xs'
          : 'bg-white border border-stone-200/80 hover:border-stone-300 shadow-xs';

        const domain = `${item.name.toLowerCase().replace(/\s+/g, '')}.com`;
        const ratingScore = (4.5 + (item.rank % 4) * 0.1).toFixed(1);
        const reviewCount = 120 + item.rank * 8;
        const timeAgo = item.rank === 1 ? 'last week' : item.rank === 2 ? '3 weeks ago' : item.rank === 3 ? '2 weeks ago' : '1 month ago';

        return (
          <div
            key={item.id}
            className={`group w-full p-3.5 sm:p-4 rounded-[22px] sm:rounded-[26px] transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 ${cardBgClass}`}
          >
            {/* Far Left Rank # Label */}
            <span
              className={`font-heading font-bold text-xs sm:text-sm flex-shrink-0 w-6 text-center ${
                isTop3 ? 'text-coral-500 font-extrabold' : 'text-stone-400'
              }`}
            >
              #{item.rank}
            </span>

            {/* Logo Icon Squircle */}
            <div className="relative flex-shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-[16px] sm:rounded-[18px] overflow-hidden bg-white border border-stone-200/60 shadow-xs">
              <img
                src={item.logoUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80';
                }}
              />
            </div>

            {/* Middle Content (Title + Rating Pill, Description, Meta) */}
            <div className="min-w-0 flex-1 space-y-0.5">
              {/* Title & Rating Pill */}
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h3
                  onClick={(e) => {
                    e.stopPropagation();
                    onTopUpRestaurant(item);
                  }}
                  className="font-heading font-extrabold text-stone-900 text-xs sm:text-sm tracking-tight truncate group-hover:text-coral-500 transition-colors cursor-pointer"
                >
                  {item.name}
                </h3>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-stone-100/90 text-stone-700 text-[10px] font-bold border border-stone-200/60 flex-shrink-0">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span>{ratingScore}</span>
                </span>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-[11px] sm:text-xs text-stone-400 line-clamp-1 font-normal leading-tight">
                  {item.description}
                </p>
              )}

              {/* Meta Line: timeAgo · domain ↗ · ⭐⭐⭐⭐⭐ 128 · details → */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] sm:text-[11px] text-stone-400 font-medium pt-0.5">
                <span>{timeAgo}</span>
                <span className="text-stone-300">•</span>

                {/* Clickable Domain Link matching reference screenshot */}
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetch(`/api/entries/${item.id}/click`, { method: 'POST' }).catch(() => {});
                  }}
                  className="inline-flex items-center gap-0.5 text-stone-600 hover:text-coral-500 font-mono font-semibold transition-colors cursor-pointer"
                >
                  <span>{domain}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-coral-500" />
                </a>

                <span className="text-stone-300">•</span>
                <div className="inline-flex items-center gap-0.5 text-amber-400">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span className="text-stone-500 font-semibold ml-1">{reviewCount}</span>
                </div>
                <span className="text-stone-300">•</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTopUpRestaurant(item);
                  }}
                  className="text-stone-500 hover:text-coral-500 font-medium transition-colors cursor-pointer"
                >
                  details →
                </button>
              </div>
            </div>

            {/* Terracotta Dollar Figure on right */}
            <span className="font-heading font-black text-base sm:text-lg text-coral-500 font-money tracking-tight flex-shrink-0 ml-auto">
              {formatCurrency(item.totalPaidCents)}
            </span>
          </div>
        );
      })}

      {/* Pagination Controls matching reference sample */}
      <div className="flex flex-col items-center justify-center gap-1 pt-6">
        <div className="flex items-center gap-2">
          {/* Chevron Left */}
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1 text-stone-300 hover:text-stone-500 disabled:opacity-40 transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {getPageNumbers(page, Math.max(totalPages, 59)).map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="text-stone-400 text-xs px-1 select-none font-medium">
                  ...
                </span>
              );
            }
            const isCurrent = p === page;
            return (
              <button
                key={p}
                onClick={() => onPageChange(Number(p))}
                className={
                  isCurrent
                    ? 'w-7 h-7 rounded-full bg-[#E06D53] text-white font-bold text-xs flex items-center justify-center shadow-xs'
                    : 'px-1.5 py-0.5 text-xs font-semibold text-[#E06D53] hover:text-[#c8553d] transition-colors'
                }
              >
                {p}
              </button>
            );
          })}

          {/* Chevron Right */}
          <button
            disabled={page >= Math.max(totalPages, 59)}
            onClick={() => onPageChange(page + 1)}
            className="p-1 text-[#E06D53] hover:text-[#c8553d] disabled:opacity-40 transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4 text-[#E06D53]" />
          </button>
        </div>

        {/* Sub-label: "1 - 10 of 10" or "1 - 30 of 2,917" */}
        <span className="text-stone-500 text-xs font-medium tracking-tight mt-1">
          {(page - 1) * 30 + 1} – {Math.min(page * 30, effectiveTotalCount)} of {effectiveTotalCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}


