'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, Search, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '@/components/currency-context';
import { Logo } from '@/components/logo';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenTopup: () => void;
  onOpenRules: () => void;
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenRegister, onOpenTopup, onOpenRules, onOpenSearch }: NavbarProps) {
  const { currency, setCurrency } = useCurrency();
  const pathname = usePathname();

  const isDailyActive = pathname === '/';
  const isCitiesActive = pathname.startsWith('/cities') || pathname.startsWith('/rankings') || pathname.startsWith('/city');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3 text-xs">
        {/* Logo & Online Status Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Logo size="sm" />

          {/* Live Visitor Stat Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100/80 text-stone-600 border border-stone-200/60 text-[11px] font-medium backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-stone-800">37 online</span>
            <span className="text-stone-300">•</span>
            <span>4,402 visitors today</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 hover:text-stone-900 cursor-pointer flex items-center font-semibold">stats<ArrowUpRight className="w-3 h-3 ml-0.5" /></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3 sm:gap-6 font-medium text-stone-500 text-xs sm:text-xs shrink min-w-0 overflow-hidden">
          <Link
            href="/"
            className={`transition-colors whitespace-nowrap ${
              isDailyActive
                ? 'font-bold text-coral-600'
                : 'text-stone-500 hover:text-stone-900 font-medium'
            }`}
          >
            Daily
          </Link>
          <Link
            href="/cities"
            className={`transition-colors whitespace-nowrap ${
              isCitiesActive
                ? 'font-bold text-coral-600'
                : 'text-stone-500 hover:text-stone-900 font-medium'
            }`}
          >
            Cities
          </Link>
          <button onClick={onOpenRules} className="hover:text-stone-900 transition-colors whitespace-nowrap text-stone-500 font-medium">
            About
          </button>
          <button onClick={onOpenRules} className="hover:text-stone-900 transition-colors whitespace-nowrap text-stone-500 font-medium">
            Rules
          </button>
        </nav>

        {/* Right Icon Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Currency Switcher Toggle Pill */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-stone-100/90 border border-stone-200/80 text-[10px] sm:text-[11px] font-bold shadow-xs shrink-0 whitespace-nowrap select-none">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center justify-center leading-none ${
                currency === 'USD'
                  ? 'bg-coral-500 text-white shadow-coral-pill font-extrabold'
                  : 'text-stone-600 hover:text-stone-900 font-semibold'
              }`}
              title="Switch currency to US Dollars ($)"
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('PKR')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center justify-center leading-none ${
                currency === 'PKR'
                  ? 'bg-coral-500 text-white shadow-coral-pill font-extrabold'
                  : 'text-stone-600 hover:text-stone-900 font-semibold'
              }`}
              title="Switch currency to Pakistani Rupees (PKR)"
            >
              PKR
            </button>
          </div>

          <button
            onClick={onOpenSearch || onOpenRegister}
            className="p-1.5 sm:p-2 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 transition-colors border border-stone-200/50 shrink-0"
            title="Search entries"
          >
            <Search className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </header>
  );
}


