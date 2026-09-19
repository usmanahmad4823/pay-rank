'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown, CheckCircle2, Share2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#0284C7', '#7C3AED', '#1D1D1F'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShareOnX = () => {
    const text = encodeURIComponent(
      '🔥 I just locked a top rank spot on PayRank! Outbid me if you can:'
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-200 text-center shadow-2xl bg-white space-y-6 text-neutral-900">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-amber-500 border border-amber-400 p-0.5 mx-auto shadow-lg flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <Crown className="w-10 h-10 text-amber-600 animate-bounce" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Stripe Webhook Verified</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Bid Verified & Ranked!
          </h2>
          <p className="text-xs text-neutral-600 mt-2 max-w-xs mx-auto">
            Your bid has been processed and your position on the public leaderboard has been updated in real-time.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleShareOnX}
            className="apple-pill-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share My Rank On X (Twitter)</span>
          </button>

          <button
            onClick={onClose}
            className="apple-pill-secondary w-full py-3 text-xs font-bold text-center block"
          >
            Back to Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
}
