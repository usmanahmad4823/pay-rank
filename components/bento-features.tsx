'use client';

import React from 'react';
import { ShieldCheck, Zap, TrendingUp, Lock, RefreshCw, BarChart3, Award, Sparkles } from 'lucide-react';

export function BentoFeatures() {
  return (
    <section id="bento-features" className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Core System Architecture</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
          Complete Monetary Platform to <br className="hidden sm:inline" />
          <span className="blue-gradient-text">Power Transparent Rankings</span>
        </h2>
        <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
          PayRank replaces subjective review algorithms with verifiable, real-time financial commitment. Highest bid holds #1 — guaranteed.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Large Asymmetric Card (Span 2) — Pure Price Ordering */}
        <div className="md:col-span-2 glass-card-light p-8 rounded-3xl relative overflow-hidden group hover:border-blue-300 hover:shadow-soft-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-100">
            Pillar 01 • Pure Price Mechanics
          </div>
          
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Pure Price Ordering — No Ads, No Algorithms
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
            Rank positions are determined strictly by total verified bid totals (`totalPaidCents`). Eliminate ad auctions, review bribery, and hidden SEO penalties.
          </p>

          {/* Interactive Mock Graphic */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">#1</span>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Le Bernardin NYC</div>
                  <div className="text-xs text-slate-500">Fine Dining • New York</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-blue-600 text-base">$4,250.00</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active Rank Champion</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">#2</span>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Per Se NYC</div>
                  <div className="text-xs text-slate-500">French • New York</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-700 text-sm">$3,800.00</div>
                <div className="text-[10px] text-slate-400">+$451 needed for #1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Re-Bid Top-Up Formula */}
        <div className="glass-card-light p-8 rounded-3xl relative overflow-hidden group hover:border-amber-300 hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-60 h-60 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
              Pillar 02 • Delta Math
            </div>

            <h3 className="font-heading font-bold text-xl text-slate-900">
              Re-Bid Top-Up Formula
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Existing owners never start over. Pay only the exact delta required to reach your target total bid and overtake rivals.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Top-Up Delta Calculation</div>
            <div className="text-xs text-slate-600">
              Target Bid: <span className="font-bold text-slate-900">$500</span> <br />
              Current Balance: <span className="font-bold text-slate-900">$300</span> <br />
              <span className="text-blue-600 font-black text-sm block mt-1">Charge: Only $200.00</span>
            </div>
          </div>
        </div>

        {/* Card 3: Signature-Verified Webhooks */}
        <div className="glass-card-light p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-300 hover:shadow-soft-lg transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-100">
            Pillar 03 • Webhook Integrity
          </div>

          <h3 className="font-heading font-bold text-xl text-slate-900">
            Signature-Verified Stripe Webhooks
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Zero pending or unverified bids appear on the board. Entries unlock instantly upon cryptographically verified payment confirmation.
          </p>
        </div>

        {/* Card 4: Span 2 — Zero Subscription Lock-Ins */}
        <div className="md:col-span-2 glass-card-light p-8 rounded-3xl relative overflow-hidden group hover:border-blue-300 hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2 border border-slate-200">
                Pillar 04 • Ownership & Flexibility
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                10 PKR Minimum Entry • Zero Recurring Subscriptions
              </h3>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-2xl font-black text-blue-600">10 PKR</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Minimum Lifetime Bid</div>
            </div>
          </div>

          <p className="text-slate-600 text-sm mt-4 leading-relaxed">
            No recurring monthly contracts, hidden maintenance fees, or automatic renewals. Pay once to hold your position until another entity bids higher.
          </p>
        </div>
      </div>
    </section>
  );
}
