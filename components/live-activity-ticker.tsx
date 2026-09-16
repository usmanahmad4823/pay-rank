'use client';

import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Sparkles, Trophy, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

interface ActivityEvent {
  id: string;
  restaurantName: string;
  city: string;
  action: 'claimed #1' | 'topped up' | 'reclaimed rank';
  amountCents: number;
  timeAgo: string;
}

const INITIAL_EVENTS: ActivityEvent[] = [
  { id: '1', restaurantName: 'Le Petit Maison', city: 'Lahore', action: 'topped up', amountCents: 5000, timeAgo: '2m ago' },
  { id: '2', restaurantName: 'Cooco’s Den', city: 'Lahore', action: 'topped up', amountCents: 3000, timeAgo: '8m ago' },
  { id: '3', restaurantName: 'Khyber Shinwari', city: 'Peshawar', action: 'claimed #1', amountCents: 4500, timeAgo: '15m ago' },
  { id: '4', restaurantName: 'Sakura Sushi Bar', city: 'Karachi', action: 'topped up', amountCents: 2500, timeAgo: '24m ago' },
  { id: '5', restaurantName: 'Monal Roof Top', city: 'Islamabad', action: 'reclaimed rank', amountCents: 6000, timeAgo: '42m ago' },
];

export function LiveActivityTicker() {
  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_EVENTS);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const current = events[activeEventIndex];

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
          <div className="inline-flex items-center gap-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
            <span className="font-bold text-white">{current.restaurantName}</span>
            <span className="text-stone-400">in {current.city}</span>
            <span className="px-1.5 py-0.5 rounded bg-coral-500/20 text-coral-300 font-semibold text-[10px]">
              {current.action}
            </span>
            <span className="font-money font-black text-coral-400">
              +{formatCurrency(current.amountCents)}
            </span>
            <span className="text-stone-500 text-[10px]">({current.timeAgo})</span>
          </div>
        </div>

        {/* Right Stats summary */}
        <div className="hidden md:flex items-center gap-3 text-stone-400 text-[10px]">
          <span>Total Bids Today: <strong className="text-stone-200 font-money">$4,820</strong></span>
          <span className="text-stone-700">•</span>
          <span>Active Battles: <strong className="text-stone-200">14 cities</strong></span>
        </div>
      </div>
    </div>
  );
}
