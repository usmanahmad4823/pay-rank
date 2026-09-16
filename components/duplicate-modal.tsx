'use client';

import React from 'react';
import { X, AlertTriangle, TrendingUp, Sparkles, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateData: any;
  onSelectTopUp: (listing: any) => void;
}

export function DuplicateModal({ isOpen, onClose, duplicateData, onSelectTopUp }: DuplicateModalProps) {
  if (!isOpen || !duplicateData) return null;

  const listing = duplicateData.existingListing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 text-center border-b border-stone-200 bg-stone-50">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-sm text-stone-900">Restaurant Already Listed!</h2>
          <p className="text-[11px] text-stone-500 mt-0.5">{duplicateData.message}</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {listing && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <img
                src={listing.logoUrl}
                alt={listing.name}
                className="w-12 h-12 rounded-lg object-cover border border-stone-200"
              />
              <div>
                <h3 className="font-bold text-stone-900 text-xs">{listing.name}</h3>
                <p className="text-[11px] text-stone-500">{listing.city}</p>
                <div className="text-[11px] text-coral-500 font-bold font-money mt-0.5">
                  Total Paid: {formatCurrency(listing.totalPaidCents)}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                onSelectTopUp(listing);
              }}
              className="w-full py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top Up Existing Listing Instead</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

