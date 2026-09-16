'use client';

import React, { useState } from 'react';
import { Calculator, Trophy, Sparkles, TrendingUp, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';
import { useCurrency } from '@/components/currency-context';

interface OutbidCalculatorProps {
  currentTopBidCents: number;
  onClaimRank: (targetBidCents: number) => void;
}

export function OutbidCalculator({ currentTopBidCents, onClaimRank }: OutbidCalculatorProps) {
  const { formatAmount, currencySymbol } = useCurrency();
  const [targetRank, setTargetRank] = useState<1 | 2 | 3>(1);
  const [customBidDollars, setCustomBidDollars] = useState<string>(
    ((currentTopBidCents + 1000) / 100).toString()
  );

  const calculatedCents = Math.max(1000, (parseFloat(customBidDollars) || 20) * 100);
  const estimatedDailyViews = Math.round(calculatedCents * 4.2);
  const estimatedMonthlyClicks = Math.round(calculatedCents * 1.8);

  const handleApplyRankPreset = (rank: 1 | 2 | 3) => {
    setTargetRank(rank);
    let target = currentTopBidCents;
    if (rank === 2) target = Math.round(currentTopBidCents * 0.7);
    if (rank === 3) target = Math.round(currentTopBidCents * 0.5);
    const required = target + 100;
    setCustomBidDollars((required / 100).toString());
  };

  return (
    <div className="w-full bg-white border border-stone-200/90 rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-4 shadow-apple-card space-y-2.5 mb-6 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-stone-900 text-xs">
              Instant Outbid ROI Calculator
            </h3>
            <p className="text-[10px] text-stone-400">Calculate exact bid cost and projected traffic to beat top rivals</p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200/60 text-[9px] font-bold uppercase tracking-wider">
          Pro Tool
        </span>
      </div>

      {/* Target Rank Selector Buttons */}
      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
        {[1, 2, 3].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleApplyRankPreset(r as 1 | 2 | 3)}
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              targetRank === r
                ? 'bg-coral-500 text-white border-coral-500 shadow-coral-pill'
                : 'bg-stone-50 text-stone-600 border-stone-200/80 hover:border-stone-300'
            }`}
          >
            Target Rank #{r}
          </button>
        ))}
      </div>

      {/* Calculator Body */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-stone-50/80 p-3 rounded-xl border border-stone-200/60 text-[10px]">
        {/* Input */}
        <div className="space-y-1">
          <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500">
            Bid Amount ({currencySymbol.trim()})
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-coral-500 font-extrabold text-xs">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="10"
              step="5"
              value={customBidDollars}
              onChange={(e) => setCustomBidDollars(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-white border border-stone-200/80 text-coral-500 font-money font-black text-sm focus:outline-none focus:border-coral-500"
            />
          </div>
          <p className="text-[9px] text-stone-400">
            Current #1 Bid: <strong className="text-stone-700 font-money">{formatAmount(currentTopBidCents)}</strong>
          </p>
        </div>

        {/* Projected Impact Stats */}
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-200/60 pt-1.5 sm:pt-0 sm:pl-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-stone-500">Est. Monthly Impressions:</span>
            <span className="font-bold text-stone-800">{estimatedDailyViews.toLocaleString()} views</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-stone-500">Est. Direct Link Clicks:</span>
            <span className="font-bold text-coral-600 font-money">{estimatedMonthlyClicks.toLocaleString()} clicks</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-stone-500">Rank Guarantee:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Permanent until outbid
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={() => onClaimRank(calculatedCents)}
        className="w-full py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center justify-center gap-1.5"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Claim Target Rank for {formatAmount(calculatedCents)}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
