'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

interface BidCalculatorProps {
  onOpenRegister: () => void;
}

export function BidCalculator({ onOpenRegister }: BidCalculatorProps) {
  const [targetBid, setTargetBid] = useState<number>(250);
  const [existingBid, setExistingBid] = useState<number>(50);

  const deltaRequired = Math.max(0, targetBid - existingBid);
  const estimatedImpressions = Math.round(targetBid * 48.5 + 1200);
  
  // Calculate mock rank projection
  let projectedRank = 1;
  if (targetBid < 100) projectedRank = 8;
  else if (targetBid < 200) projectedRank = 5;
  else if (targetBid < 500) projectedRank = 2;

  return (
    <section id="pricing" className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card-light rounded-3xl p-6 sm:p-12 border border-blue-200/80 shadow-soft-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/60 to-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Position Calculator</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              Calculate Your Exact Delta & <br />
              <span className="blue-gradient-text">Projected Rank #1 Target</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Use our real-time bid engine simulator to test different target totals. See instant top-up requirements and estimated impression visibility.
            </p>

            {/* Slider 1: Target Total Bid */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Desired Total Bid Amount:</span>
                <span className="text-blue-600 text-lg font-black">{formatCurrency(targetBid * 100)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={targetBid}
                onChange={(e) => setTargetBid(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>$10 Min</span>
                <span>$500</span>
                <span>$1,000</span>
                <span>$2,000 Max</span>
              </div>
            </div>

            {/* Slider 2: Existing Balance (Top-Up Simulation) */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Current Balance (If Existing Owner):</span>
                <span className="text-amber-700 font-bold">{formatCurrency(existingBid * 100)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(0, targetBid - 10)}
                step="10"
                value={existingBid}
                onChange={(e) => setExistingBid(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Right Column: Dynamic Calculation Output Card */}
          <div className="lg:col-span-5">
            <div className="glass-card-amber-light p-6 sm:p-8 rounded-3xl space-y-6 text-center sm:text-left relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Checkout Breakdown</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-black">
                  Instant Webhook
                </span>
              </div>

              <div className="space-y-4 py-2 border-y border-amber-200/80">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Target Total Bid:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(targetBid * 100)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium font-mono text-xs">Less Credit Balance:</span>
                  <span className="font-bold text-amber-700">-{formatCurrency(existingBid * 100)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-base sm:text-lg font-black">
                  <span className="text-slate-900">Total Charged Today:</span>
                  <span className="text-blue-600">{formatCurrency(deltaRequired * 100)}</span>
                </div>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white/90 border border-amber-200">
                  <div className="text-xs text-slate-500 font-semibold">Projected Rank</div>
                  <div className="text-xl font-black text-amber-600 mt-0.5">#{projectedRank}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/90 border border-amber-200">
                  <div className="text-xs text-slate-500 font-semibold">Est. Monthly Views</div>
                  <div className="text-xl font-black text-blue-600 mt-0.5">~{estimatedImpressions.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={onOpenRegister}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group transition-all"
              >
                <span>Lock In Target Position</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
