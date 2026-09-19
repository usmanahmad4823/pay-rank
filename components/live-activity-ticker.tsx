'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useCurrency } from '@/components/currency-context';

interface ActivityEvent {
  id: string;
  restaurantName: string;
  city: string;
  action: string;
  amountCents: number;
  timeAgo: string;
}

export function LiveActivityTicker() {
  const { formatAmount } = useCurrency();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [todayVolumeCents, setTodayVolumeCents] = useState(0);
  const [activeCitiesCount, setActiveCitiesCount] = useState(0);

  useEffect(() => {
    async function fetchStatsTicker() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.recentEvents) && data.recentEvents.length > 0) {
            setEvents(data.recentEvents);
          }
          setTodayVolumeCents(data.todayVolumeCents || data.totalRevenueCents || 0);
          setActiveCitiesCount(data.activeCitiesCount || 1);
        }
      } catch (err) {
        console.error('Failed to fetch stats ticker:', err);
      }
    }
    fetchStatsTicker();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const current = events.length > 0 ? events[activeEventIndex] : null;

  return (
    <div className="w-full bg-stone-900 text-stone-200 border-b border-stone-800 text-[11px] font-medium py-2 px-4 overflow-hidden shadow-inner">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left Badge: Live Activity Feed */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500" />
          </span>
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-coral-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-coral-400 fill-coral-400" /> Live Feed
          </span>
        </div>

        {/* Center: Animated Event Item */}
        <div className="flex-1 overflow-hidden text-center sm:text-left">
          {current ? (
            <div className="inline-flex items-center gap-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
              <span className="font-bold text-white">{current.restaurantName}</span>
              <span className="text-stone-400">in {current.city}</span>
              <span className="px-1.5 py-0.5 rounded bg-coral-500/20 text-coral-300 font-semibold text-[10px]">
                {current.action}
              </span>
              <span className="font-money font-black text-coral-400">
                +{formatAmount(current.amountCents)}
              </span>
              <span className="text-stone-500 text-[10px]">({current.timeAgo})</span>
            </div>
          ) : (
            <span className="text-stone-400 animate-pulse">Loading live activity feed...</span>
          )}
        </div>

        {/* Right Stats summary */}
        <div className="hidden md:flex items-center gap-3 text-stone-400 text-[10px]">
          <span>Total Bids Volume: <strong className="text-stone-200 font-money">{formatAmount(todayVolumeCents)}</strong></span>
          <span className="text-stone-700">•</span>
          <span>Active Battles: <strong className="text-stone-200">{activeCitiesCount} {activeCitiesCount === 1 ? 'city' : 'cities'}</strong></span>
        </div>
      </div>
    </div>
  );
}
