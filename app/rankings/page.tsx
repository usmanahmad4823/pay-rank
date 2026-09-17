'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, Globe, Building2, Sparkles, Trophy } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LeaderboardTable, LeaderboardItem } from '@/components/leaderboard-table';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { RulesModal } from '@/components/rules-modal';
import { SearchModal } from '@/components/search-modal';

export default function NationalRankingsPage() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [timeframe, setTimeframe] = useState<'all-time' | 'today'>('all-time');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [targetTopupRestaurant, setTargetTopupRestaurant] = useState<LeaderboardItem | null>(null);

  useEffect(() => {
    async function fetchNationalLeaderboard() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?scope=national&page=${page}&timeframe=${timeframe}`);
        const data = await res.json();

        if (res.ok && data.items) {
          setItems(data.items);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.totalCount || 0);
        }
      } catch (err) {
        console.error('Error loading national leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNationalLeaderboard();
  }, [page, timeframe]);

  const handleOpenTopup = (restaurant: LeaderboardItem) => {
    setTargetTopupRestaurant(restaurant);
    setIsTopupOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans selection:bg-coral-100 selection:text-coral-900">
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Breadcrumb Header */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Link href="/cities" className="hover:text-stone-900 transition-colors flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <span>Pakistan</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="font-bold text-stone-900">National Rankings</span>
        </nav>

        {/* Page Banner & Headline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-apple-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200/60 uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-coral-500" />
              <span>National Leaderboard</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 tracking-tight">
              All Pakistan <span className="text-coral-500">Rankings</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Official nationwide leaderboard comparing all verified restaurants across every city and province in Pakistan.
            </p>
          </div>

          {/* Scope Switcher Links */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Link
              href="/cities"
              className="px-4 py-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold transition-all shadow-coral-pill"
            >
              Browse Cities Directory →
            </Link>
          </div>
        </div>

        {/* Timeframe Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div className="inline-flex p-1 rounded-full bg-stone-200/60 text-xs font-bold">
            <button
              onClick={() => setTimeframe('all-time')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                timeframe === 'all-time'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All-time
            </button>
            <button
              onClick={() => setTimeframe('today')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Today
            </button>
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2 rounded-full bg-stone-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-coral-400" />
            <span>List Restaurant Nationwide</span>
          </button>
        </div>

        <LeaderboardTable
          items={items}
          isLoading={isLoading}
          scope="national"
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={(p) => setPage(p)}
          onTopUpRestaurant={handleOpenTopup}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
      </main>

      <Footer />

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <TopupModal
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
        targetRestaurant={targetTopupRestaurant}
      />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
