'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Search, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenTopup: () => void;
  onOpenRules: () => void;
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenRegister, onOpenTopup, onOpenRules, onOpenSearch }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 text-xs">
        {/* Logo & Online Status Pill */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <Crown className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
            </div>
            <span className="font-heading font-extrabold text-base text-stone-900 tracking-tight">
              payrank<span className="text-coral-500 font-black">.lol</span>
            </span>
          </Link>

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
        <nav className="flex items-center gap-4 sm:gap-6 font-medium text-stone-500 text-xs">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Daily
          </Link>
          <a href="#categories" className="hover:text-stone-900 transition-colors hidden xs:inline">
            Categories
          </a>
          <button onClick={onOpenRules} className="hover:text-stone-900 transition-colors">
            About
          </button>
          <button onClick={onOpenRules} className="hover:text-stone-900 transition-colors">
            Rules
          </button>
        </nav>

        {/* Right Icon Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch || onOpenRegister}
            className="p-2 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 transition-colors border border-stone-200/50"
            title="Search entries"
          >
            <Search className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </header>
  );
}


