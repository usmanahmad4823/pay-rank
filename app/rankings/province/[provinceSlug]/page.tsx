'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ChevronRight, Globe, Building2, Sparkles, Trophy } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LeaderboardTable, LeaderboardItem } from '@/components/leaderboard-table';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { RulesModal } from '@/components/rules-modal';
import { SearchModal } from '@/components/search-modal';
import { slugToProvince } from '@/lib/city-utils';

export default function ProvinceLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const provinceSlug = (params?.provinceSlug as string) || '';

  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [provinceData, setProvinceData] = useState<{
    province: string;
    provinceSlug: string;
  } | null>(null);
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
    if (!provinceSlug) return;

    async function fetchProvinceLeaderboard() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/rankings/province/${provinceSlug}?page=${page}&timeframe=${timeframe}`);
        const data = await res.json();

        if (res.ok && data.items) {
          setItems(data.items);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.totalCount || 0);
          setProvinceData({
            province: data.province || slugToProvince(provinceSlug),
            provinceSlug: data.provinceSlug || provinceSlug,
          });
        }
      } catch (err) {
        console.error('Error loading province leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProvinceLeaderboard();
  }, [provinceSlug, page, timeframe]);

  const handleOpenTopup = (restaurant: LeaderboardItem) => {
    setTargetTopupRestaurant(restaurant);
    setIsTopupOpen(true);
  };

  const displayProvinceName = provinceData?.province || slugToProvince(provinceSlug);

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
          <span className="font-bold text-stone-900">{displayProvinceName} Province</span>
        </nav>

        {/* Page Banner & Headline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-apple-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200/60 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-coral-500" />
              <span>Provincial Scope</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 tracking-tight">
              {displayProvinceName} <span className="text-coral-500">Leaderboard</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Official live ranking spanning all cities across <strong className="text-stone-800">{displayProvinceName}</strong>.
            </p>
          </div>

          {/* Scope Switcher Links */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Link
              href="/cities"
              className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all border border-stone-200/60"
            >
              Explore Cities Directory
            </Link>
            <Link
              href="/rankings"
              className="px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              View National Ranking
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
            className="px-4 py-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>List Restaurant in {displayProvinceName}</span>
          </button>
        </div>

        {/* Empty State vs Leaderboard Table */}
        {!isLoading && items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-lg mx-auto shadow-apple-card">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
              <Building2 className="w-6 h-6 text-coral-500" />
            </div>

            <h3 className="font-heading font-extrabold text-lg text-stone-900">
              No restaurants listed in {displayProvinceName} yet — be the first!
            </h3>

            <p className="text-xs text-stone-500 leading-relaxed">
              Claim rank #1 in {displayProvinceName} today and hold top visibility across the entire province.
            </p>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-6 py-3 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim #1 Position in {displayProvinceName}</span>
            </button>
          </div>
        ) : (
          <LeaderboardTable
            items={items}
            isLoading={isLoading}
            scope="national"
            cityName={displayProvinceName}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={(p) => setPage(p)}
            onTopUpRestaurant={handleOpenTopup}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}
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
