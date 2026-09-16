'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { CategoryBar } from '@/components/category-bar';
import { ClaimWidget } from '@/components/claim-widget';
import { SidebarToday } from '@/components/sidebar-today';
import { LeaderboardTable, LeaderboardItem } from '@/components/leaderboard-table';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { RulesModal } from '@/components/rules-modal';
import { DuplicateModal } from '@/components/duplicate-modal';
import { EntryDetailsModal } from '@/components/entry-details-modal';
import { SearchModal } from '@/components/search-modal';
import { CalculatorModal } from '@/components/calculator-modal';
import { LiveActivityTicker } from '@/components/live-activity-ticker';
import { PublicProjectStats } from '@/components/public-project-stats';
import { Footer } from '@/components/footer';
import { Trophy } from 'lucide-react';

export default function NationalLeaderboardPage() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeframeTab, setTimeframeTab] = useState<'all-time' | 'today'>('all-time');
  const [isLoading, setIsLoading] = useState(true);

  // Claim Widget pre-fill state
  const [claimName, setClaimName] = useState('');
  const [claimCategory, setClaimCategory] = useState('');
  const [claimBidDollars, setClaimBidDollars] = useState('20');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [detailsRestaurant, setDetailsRestaurant] = useState<LeaderboardItem | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<LeaderboardItem | null>(null);
  const [duplicateData, setDuplicateData] = useState<any>(null);

  const [sidebarItems, setSidebarItems] = useState<LeaderboardItem[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        scope: 'national',
        page: page.toString(),
        timeframe: timeframeTab,
      });
      if (selectedCategory && selectedCategory !== 'All') {
        params.set('cuisine', selectedCategory);
      }

      // 1. Fetch main feed items for selected timeframe
      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      const data = await res.json();

      if (data.items) {
        setItems(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      }

      // 2. Fetch sidebar items for complementary timeframe
      const complementaryTimeframe = timeframeTab === 'all-time' ? 'today' : 'all-time';
      const sidebarParams = new URLSearchParams({
        scope: 'national',
        page: '1',
        timeframe: complementaryTimeframe,
      });
      if (selectedCategory && selectedCategory !== 'All') {
        sidebarParams.set('cuisine', selectedCategory);
      }

      const sidebarRes = await fetch(`/api/leaderboard?${sidebarParams.toString()}`);
      const sidebarData = await sidebarRes.json();
      if (sidebarData.items) {
        setSidebarItems(sidebarData.items);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategory, timeframeTab]);

  useEffect(() => {
    // Non-blocking trigger to seed mock data if database is fresh
    fetch('/api/seed').catch(() => {});
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleOpenTopup = (restaurant?: LeaderboardItem) => {
    if (restaurant) setSelectedRestaurant(restaurant);
    setIsTopupOpen(true);
  };

  const handleDuplicateFound = (data: any) => {
    setDuplicateData(data);
    setIsDuplicateOpen(true);
  };

  const topBidCents = items.length > 0 ? items[0].totalPaidCents : 0;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans selection:bg-coral-100 selection:text-coral-900">
      {/* 1. Header Navigation */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTopup={() => handleOpenTopup()}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Live Financial Bid Activity Stream Ticker */}
      <LiveActivityTicker />

      {/* Main Public Leaderboard App */}
      <main className="flex-1 w-full space-y-4">
        
        {/* 2. Horizontal Category Filter Scroll Bar */}
        <div id="categories">
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
          />
        </div>

        {/* 3. Timeframe / Scope Dual Tab Switcher (All-time vs Today) */}
        <div className="flex items-center justify-center my-4">
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-stone-200 shadow-outbid-card text-xs font-bold">
            <button
              onClick={() => setTimeframeTab('all-time')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                timeframeTab === 'all-time'
                  ? 'bg-coral-500 text-white shadow-coral-pill'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>All-time</span>
            </button>

            <button
              onClick={() => setTimeframeTab('today')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                timeframeTab === 'today'
                  ? 'bg-coral-500 text-white shadow-coral-pill'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" />
              <span>Today</span>
            </button>
          </div>
        </div>

        {/* 4. Claim #1 Hero Widget with ROI Calculator Button */}
        <ClaimWidget
          currentTopBidCents={topBidCents}
          onClaimRank={(name, category, targetBidCents) => {
            setClaimName(name);
            setClaimCategory(category);
            setClaimBidDollars((targetBidCents / 100).toString());
            setIsRegisterOpen(true);
          }}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />

        {/* 5. Main 2-Column Content Layout (Feed + Sidebar) */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-4">
          {/* Left Column: Main Leaderboard Feed Cards */}
          <div className="lg:col-span-8 w-full space-y-4">
            <LeaderboardTable
              items={items}
              isLoading={isLoading}
              scope="national"
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPage}
              onTopUpRestaurant={(restaurant) => {
                setDetailsRestaurant(restaurant);
                setIsDetailsOpen(true);
              }}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          </div>

          {/* Right Column: Today's / All-Time Ranking Sidebar Widget */}
          <div className="lg:col-span-4 w-full sticky top-20">
            <SidebarToday
              items={sidebarItems.length > 0 ? sidebarItems : items}
              title={timeframeTab === 'all-time' ? "Today's ranking" : "All-time ranking"}
              onSeeAll={() => setTimeframeTab(timeframeTab === 'all-time' ? 'today' : 'all-time')}
              onSelectRestaurant={(restaurant) => {
                setDetailsRestaurant(restaurant);
                setIsDetailsOpen(true);
              }}
            />
          </div>
        </div>

        {/* 6. Public Project Stats & Attribution Section (Centered in Middle of Screen) */}
        <PublicProjectStats totalCount={totalCount} />
      </main>

      {/* 6. Minimalist Outbid Footer */}
      <Footer />

      {/* Modals */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        defaultName={claimName}
        defaultCuisine={claimCategory}
        defaultBidDollars={claimBidDollars}
        onDuplicateFound={handleDuplicateFound}
      />

      <TopupModal
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
        targetRestaurant={selectedRestaurant}
      />

      <EntryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        restaurant={detailsRestaurant}
        onOpenTopup={handleOpenTopup}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRestaurant={(restaurant) => {
          setDetailsRestaurant(restaurant);
          setIsDetailsOpen(true);
        }}
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

      {/* Full-Screen Hover Overlay Modal for Instant Outbid ROI Calculator */}
      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentTopBidCents={topBidCents}
        onClaimRank={(calculatedCents) => {
          setClaimBidDollars((calculatedCents / 100).toString());
          setIsCalculatorOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </div>
  );
}
