'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Tag, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { LeaderboardItem } from './leaderboard-table';
import { formatCurrency } from '@/lib/city-utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant?: (restaurant: LeaderboardItem) => void;
}

export function SearchModal({ isOpen, onClose, onSelectRestaurant }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?search=${encodeURIComponent(query.trim())}&limit=10`);
        const data = await res.json();
        if (data.items) {
          setResults(data.items);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-3.5 border-b border-stone-200 bg-stone-50">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cities, or categories..."
            className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-coral-500 animate-spin flex-shrink-0" />
          ) : (
            query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Clear
              </button>
            )
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2 text-xs">
          {!query.trim() && (
            <div className="py-8 text-center text-stone-400 text-xs space-y-1">
              <Search className="w-6 h-6 mx-auto stroke-1 text-stone-300" />
              <p>Type to search restaurants, cities (e.g. Lahore, NYC), or categories.</p>
            </div>
          )}

          {query.trim() && !isLoading && results.length === 0 && (
            <div className="py-8 text-center text-stone-500 text-xs">
              No matching listings found for "<strong className="text-stone-800">{query}</strong>".
            </div>
          )}

          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onClose();
                if (onSelectRestaurant) onSelectRestaurant(item);
              }}
              className="p-3 rounded-xl border border-stone-200/80 hover:border-stone-300 bg-white hover:bg-stone-50 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs truncate">{item.name}</h4>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{item.city}</span>
                    {item.cuisine && (
                      <>
                        <span className="text-stone-300">•</span>
                        <span>{item.cuisine}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-coral-100 text-coral-600 font-money text-[11px] font-black block">
                  #{item.rank}
                </span>
                <span className="text-[11px] text-stone-600 font-money font-extrabold mt-0.5 block">
                  {formatCurrency(item.totalPaidCents)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
