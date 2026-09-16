'use client';

import React, { useState } from 'react';
import { Minus, Plus, Globe, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

interface ClaimWidgetProps {
  currentTopBidCents: number;
  onClaimRank: (restaurantName: string, category: string, bidAmountCents: number) => void;
}

export function ClaimWidget({ currentTopBidCents, onClaimRank }: ClaimWidgetProps) {
  // Target bid defaults to top bid + $1 (or $20 if board is empty)
  const defaultTargetCents = currentTopBidCents > 0 ? currentTopBidCents + 100 : 2000;
  const [targetCents, setTargetCents] = useState<number>(defaultTargetCents);
  const [inputName, setInputName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pakistani');

  const increment = () => setTargetCents((prev) => prev + 100); // +$1
  const decrement = () => setTargetCents((prev) => Math.max(100, prev - 100)); // -$1

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClaimRank(inputName, selectedCategory, targetCents);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 my-5 sm:my-8 text-center space-y-4 sm:space-y-5">
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
              {formatCurrency(targetCents)}
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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-2xl mx-auto">
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
        <div className="relative w-full sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-4 pr-8 py-3 rounded-full bg-white border border-stone-200/80 text-stone-700 text-xs sm:text-sm appearance-none focus:outline-none focus:border-coral-500 shadow-apple-card hover:shadow-apple-hover cursor-pointer transition-all font-medium"
          >
            <option value="Pakistani">Pakistani</option>
            <option value="Fine Dining">Fine Dining</option>
            <option value="Japanese">Japanese</option>
            <option value="Italian">Italian</option>
            <option value="BBQ">BBQ</option>
            <option value="Cafes">Cafes</option>
            <option value="Bakery">Bakery</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
            <ChevronDown className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>

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
