'use client';

import React from 'react';
import { X, ShieldCheck, DollarSign, Globe, Lock, HelpCircle, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-coral-500 text-white flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-stone-900">Pay-to-Rank System Rules</h2>
              <p className="text-[11px] text-stone-500">100% transparent public leaderboard mechanics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-stone-700">
          {/* Core Rule Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h3 className="font-bold text-stone-900 text-xs">Pure Monetary Rank</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                No algorithms, fake reviews, or hidden SEO penalties. Position #1 is strictly held by total verified payment.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h3 className="font-bold text-stone-900 text-xs">Re-Bid Top-Up Formula</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Re-bidding on an existing entry recognizes your balance and charges only the delta to reach your new target.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h3 className="font-bold text-stone-900 text-xs">Owner Secret Tokens</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Keep your secret owner token safe to authorize instant rank top-ups whenever another entity bids higher.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <h3 className="font-bold text-stone-900 text-xs">Non-Refundable</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                All initial bids and top-ups update live upon Stripe signature webhook confirmation and are non-refundable.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
          >
            Understood & Got It
          </button>
        </div>
      </div>
    </div>
  );
}

