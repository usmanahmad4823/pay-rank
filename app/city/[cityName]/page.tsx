'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { TopPodium } from '@/components/top-podium';
import { CitySwitcher } from '@/components/city-switcher';
import { LeaderboardTable, LeaderboardItem } from '@/components/leaderboard-table';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { RulesModal } from '@/components/rules-modal';
import { DuplicateModal } from '@/components/duplicate-modal';
import { Footer } from '@/components/footer';
import { MapPin, Globe, Plus, Building2, Flame } from 'lucide-react';
import { formatCityName, formatCurrency } from '@/lib/city-utils';

export default function CityLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const rawCityParam = (params.cityName as string) || '';
  const cityNameFormatted = formatCityName(rawCityParam);

  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [cityTotalPaid, setCityTotalPaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<LeaderboardItem | null>(null);
  const [duplicateData, setDuplicateData] = useState<any>(null);

  const fetchCityLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/leaderboard', window.location.origin);
      url.searchParams.set('scope', 'city');
      url.searchParams.set('city', rawCityParam);
      url.searchParams.set('page', page.toString());

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.items) {
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        if (data.cityStats) {
          setCityTotalPaid(data.cityStats.totalPaidCents);
        }
      }
    } catch (err) {
      console.error('Failed to fetch city leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [rawCityParam, page]);

  useEffect(() => {
    fetchCityLeaderboard();
  }, [fetchCityLeaderboard]);

  const handleOpenTopup = (restaurant?: LeaderboardItem) => {
    if (restaurant) setSelectedRestaurant(restaurant);
    setIsTopupOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans">
      {/* Navbar */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTopup={() => handleOpenTopup()}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* City Header Banner */}
        <section className="relative text-center py-6 sm:py-10 rounded-2xl bg-white border border-stone-200 p-6 shadow-outbid-card overflow-hidden">
          {/* Scope Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-xs font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-coral-500" />
            <span>City Scope: {cityNameFormatted}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Best Restaurants in <span className="text-coral-500 font-black">{cityNameFormatted}</span>
          </h1>

          <p className="text-stone-500 text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Ranked strictly by money paid. {totalCount} {totalCount === 1 ? 'restaurant' : 'restaurants'} listed with{' '}
            <strong className="text-coral-500 font-money">{formatCurrency(cityTotalPaid)}</strong> total pledged.
          </p>

          <div className="flex items-center justify-center gap-2.5 mt-5">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>List Restaurant in {cityNameFormatted}</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className="px-4 py-2.5 rounded-full bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-coral-500" />
              <span>View National Leaderboard</span>
            </button>
          </div>
        </section>

        {/* City Switcher */}
        <CitySwitcher currentCity={cityNameFormatted} />

        {/* City Podium */}
        {!isLoading && items.length > 0 && page === 1 && (
          <TopPodium topItems={items.slice(0, 3)} cityName={cityNameFormatted} onTopUpRestaurant={handleOpenTopup} />
        )}

        {/* Scoped Leaderboard Table */}
        <LeaderboardTable
          items={items}
          isLoading={isLoading}
          scope="city"
          cityName={cityNameFormatted}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onTopUpRestaurant={handleOpenTopup}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        defaultCity={cityNameFormatted}
        onDuplicateFound={(data) => {
          setDuplicateData(data);
          setIsDuplicateOpen(true);
        }}
      />

      <TopupModal
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
        targetRestaurant={selectedRestaurant}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <DuplicateModal
        isOpen={isDuplicateOpen}
        onClose={() => setIsDuplicateOpen(false)}
        duplicateData={duplicateData}
        onSelectTopUp={(listing) => {
          setSelectedRestaurant(listing);
          setIsTopupOpen(true);
        }}
      />
    </div>
  );
}
