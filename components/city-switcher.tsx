'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Globe, ChevronRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

interface CityItem {
  normalizedCity: string;
  displayName: string;
  count: number;
  totalPaidCents: number;
}

interface CitySwitcherProps {
  currentCity?: string;
  onSelectCity?: (cityName: string) => void;
}

export function CitySwitcher({ currentCity, onSelectCity }: CitySwitcherProps) {
  const router = useRouter();
  const [cities, setCities] = useState<CityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/cities');
        const data = await res.json();
        if (data.cities) {
          setCities(data.cities);
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  const handleCityClick = (cityName: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    if (onSelectCity) {
      onSelectCity(cityName);
    } else {
      if (!cityName) {
        router.push('/');
      } else {
        router.push(`/city/${encodeURIComponent(cityName)}`);
      }
    }
  };

  const filteredCities = cities.filter((c) =>
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto my-8">
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search city leaderboard (e.g. Lahore, New York, London)..."
          className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white border border-slate-200/90 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-soft-sm transition-all"
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
          {currentCity && (
            <button
              onClick={() => handleCityClick('')}
              className="px-2.5 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>National</span>
            </button>
          )}

          <button
            onClick={() => handleCityClick(searchQuery || 'New York')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1 shadow-sm transition-all"
          >
            <span>Jump</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* City Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl bg-white/95 border border-slate-200 shadow-soft-lg overflow-hidden backdrop-blur-xl max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 px-4 bg-slate-50">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1 text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Active Cities ({cities.length})
            </span>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          {/* Option for All Cities */}
          <button
            onClick={() => handleCityClick('')}
            className={`w-full px-4 py-3 text-left flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition-colors ${
              !currentCity ? 'bg-blue-50/60 font-bold text-blue-700' : 'text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold">National Leaderboard</div>
                <div className="text-xs text-slate-500">All cities combined</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* List of Verified Cities */}
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <button
                key={city.normalizedCity}
                onClick={() => handleCityClick(city.displayName)}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentCity?.toLowerCase() === city.displayName.toLowerCase()
                    ? 'bg-blue-50/60 text-blue-700 font-bold'
                    : 'text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold">{city.displayName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                    {city.count} {city.count === 1 ? 'entry' : 'entries'}
                  </span>
                  <span className="text-blue-600 font-black">
                    {formatCurrency(city.totalPaidCents)}
                  </span>
                </div>
              </button>
            ))
          ) : searchQuery ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No existing entries in "<span className="text-blue-600 font-bold">{searchQuery}</span>" yet.
              <button
                onClick={() => handleCityClick(searchQuery)}
                className="block mx-auto mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                + Be the first to list in {searchQuery}
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Quick City Filter Pills */}
      {cities.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Popular:</span>
          <button
            onClick={() => handleCityClick('')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
              !currentCity
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
            }`}
          >
            Worldwide
          </button>
          {cities.slice(0, 5).map((city) => (
            <button
              key={city.normalizedCity}
              onClick={() => handleCityClick(city.displayName)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                currentCity?.toLowerCase() === city.displayName.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              {city.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

