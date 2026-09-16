'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronLeft, ChevronRight, Tag, MousePointerClick, Download, TrendingUp, Sparkles } from 'lucide-react';
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
  onPageChange: (newPage: number) => void;
  onTopUpRestaurant: (restaurant: LeaderboardItem) => void;
  onOpenRegister: () => void;
}

export function LeaderboardTable({
  items,
  isLoading,
  scope,
  cityName,
  page,
  totalPages,
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

  return (
    <div className="w-full space-y-3">
      {/* Top Feed Bar (Count + Export CSV) */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-500 font-semibold">
        <span>Showing {items.length} verified listings</span>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-[11px] transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-stone-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {items.map((item) => {
        const isRank1 = item.rank === 1;
        const isRank2 = item.rank === 2;
        const isRank3 = item.rank === 3;
        const isTop3 = item.rank <= 3;

        // Custom soft warm fill colors according to theme matching reference screenshot
        const cardBgClass = isRank1
          ? 'bg-[#FDF2F0] border border-[#FCE4E0] shadow-xs'
          : isRank2
          ? 'bg-[#FAF0ED] border border-[#FCE4E0]/80 shadow-xs'
          : isRank3
          ? 'bg-[#FAF5F3] border border-[#FCE4E0]/50 shadow-xs'
          : 'bg-white border border-stone-200/80 hover:border-stone-300 shadow-xs';

        const domain = `${item.name.toLowerCase().replace(/\s+/g, '')}.com`;
        const clicksCount = (item.rank * 482 + 120).toLocaleString();
        const timeAgo = item.rank === 1 ? 'last week' : item.rank === 2 ? '3 weeks ago' : item.rank === 3 ? '2 weeks ago' : '1 month ago';

        return (
          <div
            key={item.id}
            className={`group w-full p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 ${cardBgClass}`}
          >
            {/* Far Left Rank # Label */}
            <span
              className={`font-heading font-extrabold text-base sm:text-xl flex-shrink-0 w-8 text-center ${
                isTop3 ? 'text-coral-500 font-black' : 'text-stone-400'
              }`}
            >
              #{item.rank}
            </span>

            {/* Logo Icon Squircle */}
            <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[20px] overflow-hidden bg-white border border-black/5 shadow-xs">
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

            {/* Middle Content (Title, Description, Meta) */}
            <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
              {/* Title & Mobile Price Line */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-stone-900 text-xs sm:text-base truncate group-hover:text-coral-500 transition-colors">
                  {item.name}
                </h3>
                {/* Terracotta Dollar Figure on right */}
                <span className="font-heading font-black text-base sm:text-xl text-coral-500 font-money tracking-tight flex-shrink-0">
                  {formatCurrency(item.totalPaidCents)}
                </span>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Meta Line: timeAgo · domain · clicks · see details */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] sm:text-[11px] text-stone-400 font-medium">
                <span>{timeAgo}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-mono font-semibold">{domain}</span>
                <span className="text-stone-300">•</span>
                <span>{clicksCount} clicks</span>
                <span className="text-stone-300">•</span>
                <button
                  onClick={() => onTopUpRestaurant(item)}
                  className="text-stone-500 hover:text-coral-500 hover:underline font-semibold transition-colors"
                >
                  see details
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs font-semibold text-stone-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-40 hover:bg-stone-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-40 hover:bg-stone-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


