'use client';

import React, { useState } from 'react';
import { X, TrendingUp, Key, ShieldAlert, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { LeaderboardItem } from './leaderboard-table';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRestaurant?: LeaderboardItem | null;
}

export function TopupModal({ isOpen, onClose, targetRestaurant }: TopupModalProps) {
  const [tokenInput, setTokenInput] = useState('');
  const [addAmountDollars, setAddAmountDollars] = useState('25');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!tokenInput.trim()) {
      setErrorMessage('Owner edit token is required for top-up authorization.');
      return;
    }

    const addCents = Math.round(parseFloat(addAmountDollars) * 100);
    if (isNaN(addCents) || addCents < 100) {
      setErrorMessage('Minimum top-up amount is $1.00.');
      return;
    }

    const restaurantId = targetRestaurant?.id;
    if (!restaurantId) {
      setErrorMessage('Please select a restaurant or use your top-up token link.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEditToken: tokenInput.trim(),
          addCents,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Top-up request failed.');
        return;
      }

      if (data.stripeCheckoutUrl) {
        window.location.href = data.stripeCheckoutUrl;
      }
    } catch (err) {
      console.error('Top-up error:', err);
      setErrorMessage('Network error occurred during top-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-coral-500 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-stone-900">Top Up Rank Balance</h2>
              <p className="text-[11px] text-stone-500">
                {targetRestaurant ? `Re-rank ${targetRestaurant.name}` : 'Increase restaurant ranking'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Target Restaurant Details */}
          {targetRestaurant && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <img
                src={targetRestaurant.logoUrl}
                alt={targetRestaurant.name}
                className="w-10 h-10 rounded-lg object-cover border border-stone-200"
              />
              <div>
                <h3 className="font-bold text-stone-900 text-xs">{targetRestaurant.name}</h3>
                <p className="text-[11px] text-coral-500 font-semibold font-money">
                  Rank: #{targetRestaurant.rank} • Total Paid: ${(targetRestaurant.totalPaidCents / 100).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Owner Token Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-coral-500" /> Owner Edit Token <span className="text-coral-500">*</span>
            </label>
            <input
              type="text"
              required
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste your tok_xxxxxxxx owner edit token"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-coral-500 font-mono"
            />
          </div>

          {/* Top-Up Amount */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Top-Up Amount (USD) <span className="text-coral-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-coral-500 font-bold text-base">
                +$
              </span>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={addAmountDollars}
                onChange={(e) => setAddAmountDollars(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-coral-500 font-money font-black text-lg focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Pay +${addAmountDollars || '0'} & Raise Rank</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

