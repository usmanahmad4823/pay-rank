'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Globe, ChevronDown, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';
import { CategoryDropdown } from '@/components/category-dropdown';
import { useCurrency } from '@/components/currency-context';

interface ClaimWidgetProps {
  currentTopBidCents: number;
  onClaimRank: (restaurantName: string, category: string, bidAmountCents: number) => void;
  onOpenCalculator?: () => void;
}

export function ClaimWidget({ currentTopBidCents, onClaimRank, onOpenCalculator }: ClaimWidgetProps) {
  const { formatAmount } = useCurrency();

  // Target bid defaults to top bid + min outbid (4 cents / 10 PKR) so user outbids #1
  const minRequiredCents = currentTopBidCents > 0 ? currentTopBidCents + 4 : 4;
  const [targetCents, setTargetCents] = useState<number>(minRequiredCents);
  const [inputName, setInputName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pakistani');

  // Keep targetCents synced with current #1 position bid plus 10 PKR outbid increment
  useEffect(() => {
    setTargetCents(currentTopBidCents > 0 ? currentTopBidCents + 4 : 4);
  }, [currentTopBidCents]);

  const increment = () => setTargetCents((prev) => prev + 4); // +10 PKR (4 cents)
  const decrement = () => setTargetCents((prev) => Math.max(minRequiredCents, prev - 4));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClaimRank(inputName, selectedCategory, targetCents);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 my-5 sm:my-8 text-center space-y-4 sm:space-y-5">
      {/* Dynamic Headline: Claim #1 for - $Amount + */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <h1 className="font-heading text-2xl xs:text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <span>Claim #1 for</span>
          <span className="text-stone-300 font-light hidden xs:inline">-</span>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={decrement}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-sm transition-colors border border-stone-200"
              title="Decrease bid by $1"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-coral-500 font-black font-money text-3xl sm:text-6xl">
              {formatAmount(targetCents)}
            </span>
            <button
              type="button"
              onClick={increment}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-coral-100 hover:bg-coral-200 text-coral-600 font-bold flex items-center justify-center text-sm transition-colors"
              title="Increase bid by $1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-3xl mx-auto">
        {/* ROI Calculator Button marked in screen */}
        {onOpenCalculator && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenCalculator();
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-full bg-white border border-stone-200/80 hover:bg-stone-50 text-stone-700 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-apple-card hover:shadow-apple-hover transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Open Outbid ROI Calculator"
          >
            <Calculator className="w-4 h-4 text-coral-500" />
            <span>ROI Calculator</span>
          </button>
        )}

        {/* Name / Handle Input */}
        <div className="relative w-full sm:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Globe className="w-4 h-4 stroke-[1.5]" />
          </div>
          <input
            type="text"
            required
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Your restaurant URL or @handle"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-stone-200/80 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-coral-500 shadow-apple-card hover:shadow-apple-hover transition-all"
          />
        </div>

        {/* Category Dropdown Selector */}
        <CategoryDropdown
          value={selectedCategory}
          onChange={(cat) => setSelectedCategory(cat)}
          className="w-full sm:w-44"
        />

        {/* Primary Claim Rank Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs sm:text-sm shadow-coral-pill transition-all active:scale-95 whitespace-nowrap"
        >
          Claim rank
        </button>
      </form>
    </section>
  );
}
