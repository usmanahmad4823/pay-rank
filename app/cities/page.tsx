'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Building2,
  ChevronRight,
  Trophy,
  Sparkles,
  Flame,
  Star,
  Bot,
  ShieldCheck,
  Megaphone,
  BarChart3,
  Coins,
  Code2,
  Utensils,
  GraduationCap,
  Target,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { RulesModal } from '@/components/rules-modal';
import { SearchModal } from '@/components/search-modal';
import { PROVINCES, MAJOR_CITIES, CITY_ALIASES, normalizeString } from '@/lib/city-utils';
import { useCurrency } from '@/components/currency-context';

interface TopRestaurantItem {
  id: string;
  name: string;
  description?: string | null;
  logoUrl: string;
  totalPaidCents: number;
}

interface CityDirectoryItem {
  city: string;
  citySlug: string;
  province: string;
  provinceSlug: string;
  restaurantCount: number;
  totalCityVolumeCents: number;
  topRestaurants: TopRestaurantItem[];
}

const CITY_ICONS = [
  <Bot className="w-4 h-4 text-orange-500" key="bot" />,
  <ShieldCheck className="w-4 h-4 text-purple-500" key="shield" />,
  <Megaphone className="w-4 h-4 text-amber-500" key="phone" />,
  <BarChart3 className="w-4 h-4 text-red-500" key="chart" />,
  <Coins className="w-4 h-4 text-yellow-600" key="coins" />,
  <Code2 className="w-4 h-4 text-emerald-500" key="code" />,
  <Utensils className="w-4 h-4 text-coral-500" key="utensils" />,
  <Trophy className="w-4 h-4 text-blue-500" key="trophy" />,
];

export default function CitiesDirectoryPage() {
  const { formatAmount } = useCurrency();
  const [cities, setCities] = useState<CityDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/cities');
        const data = await res.json();
        if (data.success && Array.isArray(data.cities)) {
          setCities(data.cities);
        }
      } catch (err) {
        console.error('Failed to fetch cities directory:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  const normSearch = normalizeString(searchTerm);

  // Filter cities by search term (matching name, province, or alias)
  const filteredCities = cities.filter((c) => {
    if (!normSearch) return true;
    const nameMatch = normalizeString(c.city).includes(normSearch);
    const provinceMatch = normalizeString(c.province).includes(normSearch);
    const aliasMatch = Object.entries(CITY_ALIASES).some(([alias, info]) => {
      return alias.includes(normSearch) && info.normalizedCity === normalizeString(c.city);
    });
    return nameMatch || provinceMatch || aliasMatch;
  });

  // Top 3 featured "Most active cities"
  const featuredCities = cities.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans selection:bg-coral-100 selection:text-coral-900">
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Header Title Section */}
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight flex items-center gap-2 flex-wrap">
            <span>Cities</span>
            <span className="text-coral-500 font-black">in Pak</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Every city has its own ranking. Pick one to see who leads it.
          </p>
        </div>

        {/* Featured Section: Most Active Cities */}
        {featuredCities.length > 0 && (
          <div className="bg-[#F8F6F0] p-5 sm:p-7 rounded-[28px] border border-stone-200/80 shadow-xs space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
                <span>Most active cities</span>
              </div>
              <p className="text-xs text-stone-500">
                Where ranks are getting claimed right now — and who is holding the top spot.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredCities.map((cityItem, idx) => {
                const leading = cityItem.topRestaurants[0];
                return (
                  <Link
                    key={cityItem.citySlug}
                    href={`/rankings/city/${cityItem.citySlug}`}
                    className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-coral-300 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {idx === 0 ? (
                          <div className="w-7 h-7 rounded-lg bg-coral-50 text-coral-500 flex items-center justify-center font-bold">
                            <Trophy className="w-4 h-4" />
                          </div>
                        ) : idx === 1 ? (
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <Target className="w-4 h-4" />
                          </div>
                        )}

                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            idx === 0
                              ? 'bg-coral-100 text-coral-700'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {idx === 0 ? '#1 THE HOTTEST' : `#${idx + 1}`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading font-extrabold text-base text-stone-900 group-hover:text-coral-500 transition-colors">
                        {cityItem.city}
                      </h3>

                      <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium mt-0.5">
                        <span>
                          {cityItem.restaurantCount} {cityItem.restaurantCount === 1 ? 'claim' : 'claims'}
                        </span>
                        <span>•</span>
                        <span>{idx === 0 ? '1 hour ago' : idx === 1 ? '3 hours ago' : '6 hours ago'}</span>
                      </div>
                    </div>

                    {leading && (
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={leading.logoUrl}
                            alt={leading.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <span className="text-[11px] font-semibold text-stone-700 truncate">
                            Leading <strong className="text-stone-900">{leading.name}</strong>
                          </span>
                        </div>
                        <span className="font-money font-bold text-coral-500 text-xs shrink-0">
                          {formatAmount(leading.totalPaidCents)}
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city by name or alias (Lahore, SKP, Karachi)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-stone-200/90 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:border-coral-500 shadow-apple-card transition-all"
            />
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>List Restaurant in a New City</span>
          </button>
        </div>

        {/* City Leaderboard Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-[24px] border border-stone-200 p-5 animate-pulse space-y-4"
              >
                <div className="h-6 w-32 bg-stone-200 rounded" />
                <div className="space-y-2">
                  <div className="h-10 bg-stone-100 rounded-xl" />
                  <div className="h-10 bg-stone-100 rounded-xl" />
                  <div className="h-10 bg-stone-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-md mx-auto shadow-apple-card">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-heading font-extrabold text-base text-stone-900">
              No matching active cities found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {searchTerm
                ? `No active cities found matching "${searchTerm}". Register a restaurant under this city to create its page instantly!`
                : 'No cities currently have registered restaurants.'}
            </p>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>List First Restaurant</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCities.map((cityItem, cityIdx) => {
              const icon = CITY_ICONS[cityIdx % CITY_ICONS.length];

              return (
                <Link
                  key={cityItem.citySlug}
                  href={`/rankings/city/${cityItem.citySlug}`}
                  className="bg-white p-5 rounded-[24px] border border-stone-200/90 shadow-apple-card hover:shadow-apple-hover hover:border-coral-300 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                >
                  {/* Card Header: Icon + City Name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200/60 group-hover:scale-105 transition-transform">
                        {icon}
                      </div>
                      <h2 className="font-heading font-extrabold text-base text-stone-900 group-hover:text-coral-500 transition-colors truncate">
                        {cityItem.city}
                      </h2>
                    </div>

                    <span className="text-[10px] font-bold text-stone-400 group-hover:text-coral-500 flex items-center transition-colors">
                      View all <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>

                  {/* Top 3 Restaurants List inside City Card */}
                  <div className="space-y-2">
                    {cityItem.topRestaurants.slice(0, 3).map((item, rankIdx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-50/80 group-hover:bg-stone-50 border border-stone-100 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="font-mono font-bold text-[11px] text-stone-400 shrink-0">
                            #{rankIdx + 1}
                          </span>
                          <img
                            src={item.logoUrl}
                            alt={item.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0 border border-stone-200"
                          />
                          <span className="font-bold text-stone-900 text-xs truncate">
                            {item.name}
                          </span>
                        </div>

                        <span className="font-money font-bold text-coral-500 text-[11px] shrink-0">
                          {formatAmount(item.totalPaidCents)}
                        </span>
                      </div>
                    ))}

                    {/* Fill empty slots if less than 3 restaurants */}
                    {cityItem.topRestaurants.length < 3 &&
                      [...Array(3 - cityItem.topRestaurants.length)].map((_, emptyIdx) => {
                        const spotRank = cityItem.topRestaurants.length + emptyIdx + 1;
                        return (
                          <div
                            key={emptyIdx}
                            className="flex items-center justify-between p-2 rounded-xl bg-stone-50/40 border border-dashed border-stone-200 text-xs"
                          >
                            <div className="flex items-center gap-2 text-stone-400">
                              <span className="font-mono font-bold text-[11px]">#{spotRank}</span>
                              <span className="italic text-[11px]">Available spot</span>
                            </div>
                            <span className="text-[10px] font-bold text-coral-500 hover:underline">
                              Claim #{spotRank}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <TopupModal isOpen={isTopupOpen} onClose={() => setIsTopupOpen(false)} />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
