'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', iconOnly = false, size = 'md' }: LogoProps) {
  const iconSizeClasses = {
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl text-sm',
    lg: 'w-11 h-11 rounded-2xl text-base',
  }[size];

  const crownSvgSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 sm:w-4.5 h-4 sm:h-4.5',
    lg: 'w-6 h-6',
  }[size];

  const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 group select-none ${className}`}
      title="PayRank — #1 Pay-to-Rank Leaderboard"
    >
      {/* Premium Geometric Crown Badge */}
      <div
        className={`relative ${iconSizeClasses} bg-gradient-to-br from-stone-950 via-stone-900 to-stone-850 text-white flex items-center justify-center font-bold border border-white/10 shadow-lg shadow-stone-950/20 group-hover:scale-105 group-hover:shadow-coral-500/25 group-hover:border-coral-500/40 transition-all duration-300 shrink-0 overflow-hidden`}
      >
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-coral-500/20 to-amber-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Custom Luxury Crown SVG Icon */}
        <svg
          className={`${crownSvgSize} relative z-10 text-coral-500 drop-shadow-[0_2px_4px_rgba(249,115,22,0.4)] transition-transform duration-300 group-hover:rotate-[-6deg]`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 18H21V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V18Z"
            fill="url(#logo_crown_base)"
          />
          <path
            d="M4.5 16.5L3 8L8.5 12L12 4.5L15.5 12L21 8L19.5 16.5H4.5Z"
            fill="url(#logo_crown_body)"
          />
          <circle cx="3" cy="7" r="1.25" fill="#F97316" />
          <circle cx="12" cy="3.5" r="1.5" fill="#FBBF24" />
          <circle cx="21" cy="7" r="1.25" fill="#F97316" />

          <defs>
            <linearGradient id="logo_crown_base" x1="3" y1="18" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="logo_crown_body" x1="3" y1="4.5" x2="21" y2="16.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="0.5" stopColor="#F97316" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {!iconOnly && (
        <span
          className={`font-heading font-black ${textSizeClasses} tracking-tight text-stone-900 leading-none whitespace-nowrap flex items-center`}
        >
          <span>Pay</span>
          <span className="bg-gradient-to-r from-coral-500 via-coral-600 to-amber-500 bg-clip-text text-transparent font-black ml-0.5">
            Rank
          </span>
        </span>
      )}
    </Link>
  );
}
