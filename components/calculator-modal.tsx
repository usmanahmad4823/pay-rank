'use client';

import React from 'react';
import { X } from 'lucide-react';
import { OutbidCalculator } from '@/components/outbid-calculator';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopBidCents: number;
  onClaimRank: (targetBidCents: number) => void;
}

export function CalculatorModal({
  isOpen,
  onClose,
  currentTopBidCents,
  onClaimRank,
}: CalculatorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          title="Close calculator"
        >
          <X className="w-5 h-5" />
        </button>

        <OutbidCalculator
          currentTopBidCents={currentTopBidCents}
          onClaimRank={(cents) => {
            onClaimRank(cents);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
