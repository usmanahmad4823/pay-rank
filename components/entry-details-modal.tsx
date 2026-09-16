'use client';

import React, { useState } from 'react';
import { X, Tag, MapPin, ExternalLink, MousePointerClick, ShieldAlert, Sparkles, TrendingUp, Key, Share2, Code, Check, Copy } from 'lucide-react';
import { LeaderboardItem } from './leaderboard-table';
import { formatCurrency } from '@/lib/city-utils';

interface EntryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: LeaderboardItem | null;
  onOpenTopup: (restaurant: LeaderboardItem) => void;
}

export function EntryDetailsModal({ isOpen, onClose, restaurant, onOpenTopup }: EntryDetailsModalProps) {
  const [ownerToken, setOwnerToken] = useState('');
  const [isCopiedShare, setIsCopiedShare] = useState(false);
  const [isCopiedEmbed, setIsCopiedEmbed] = useState(false);

  if (!isOpen || !restaurant) return null;

  const domain = `${restaurant.name.toLowerCase().replace(/\s+/g, '')}.com`;
  const estimatedClicks = (restaurant.rank * 482 + 120).toLocaleString();

  const handleCopyShare = () => {
    const shareText = `Check out ${restaurant.name} holding Rank #${restaurant.rank} in ${restaurant.city} on PayRank! ${window.location.origin}`;
    navigator.clipboard.writeText(shareText);
    setIsCopiedShare(true);
    setTimeout(() => setIsCopiedShare(false), 2500);
  };

  const handleCopyEmbed = () => {
    const embedSnippet = `<a href="${window.location.origin}" target="_blank" rel="noopener"><img src="${window.location.origin}/api/badge/${restaurant.id}" alt="Ranked #${restaurant.rank} on PayRank"/></a>`;
    navigator.clipboard.writeText(embedSnippet);
    setIsCopiedEmbed(true);
    setTimeout(() => setIsCopiedEmbed(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 border border-stone-200 flex-shrink-0">
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>{restaurant.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-coral-100 text-coral-600 font-money text-[11px] font-extrabold">
                  #{restaurant.rank}
                </span>
              </h2>
              <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{restaurant.city}</span>
                {restaurant.cuisine && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-700">{restaurant.cuisine}</span>
                  </>
                )}
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

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Description */}
          {restaurant.description && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 leading-relaxed">
              "{restaurant.description}"
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Current Rank
              </span>
              <span className="font-heading font-black text-xl text-coral-500 mt-0.5 block">
                #{restaurant.rank}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Total Bid
              </span>
              <span className="font-heading font-black text-xl text-stone-900 font-money mt-0.5 block">
                {formatCurrency(restaurant.totalPaidCents)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Total Clicks
              </span>
              <span className="font-heading font-black text-xl text-stone-900 mt-0.5 block">
                {estimatedClicks}
              </span>
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-2 border-t border-stone-200 pt-3">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-700">
              Listing Metadata
            </h4>
            <div className="space-y-1.5 text-stone-600 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Verified Web Domain:</span>
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-coral-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>{domain}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">City Scope:</span>
                <span className="font-semibold text-stone-800">{restaurant.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Category Tag:</span>
                <span className="font-semibold text-stone-800">{restaurant.cuisine || 'General'}</span>
              </div>
            </div>
          </div>

          {/* Share & Website Embed Badge Tools */}
          <div className="grid grid-cols-2 gap-2 border-t border-stone-200 pt-3">
            <button
              onClick={handleCopyShare}
              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
            >
              {isCopiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
              <span>{isCopiedShare ? 'Share Copied!' : 'Share Listing'}</span>
            </button>

            <button
              onClick={handleCopyEmbed}
              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
            >
              {isCopiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5 text-stone-500" />}
              <span>{isCopiedEmbed ? 'Badge Code Copied!' : 'Embed Badge'}</span>
            </button>
          </div>

          {/* Owner Re-Bid / Top-up Action Box */}
          <div className="p-4 rounded-xl bg-coral-50/70 border border-coral-200 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-coral-500 text-white flex items-center justify-center font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">Are you the owner of this listing?</h4>
                <p className="text-[10px] text-stone-500">Top up your bid to defend or improve your position.</p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenTopup(restaurant);
              }}
              className="w-full py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Top Up Bid for {restaurant.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
