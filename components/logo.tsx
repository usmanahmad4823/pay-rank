'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'coral' | 'emerald';
}

export function Logo({ className = '', iconOnly = false, size = 'md', theme = 'coral' }: LogoProps) {
  const iconSizeClasses = {
    sm: 'w-7.5 h-7.5 text-xs',
    md: 'w-9 h-9 sm:w-10 sm:h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  const pSvgSize = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 sm:w-6 h-5.5 sm:h-6',
    lg: 'w-7.5 h-7.5',
  }[size];

  const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  }[size];

  const bgGradientClass = theme === 'emerald'
    ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-emerald-500/25'
    : 'bg-gradient-to-br from-coral-500 via-coral-600 to-amber-500 shadow-coral-500/25';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      title="PayRank — #1 Pay-to-Rank Leaderboard"
    >
      {/* Fully Circular Badge with White Stylized 'P' Emblem */}
      <div
        className={`relative ${iconSizeClasses} rounded-full ${bgGradientClass} text-white flex items-center justify-center font-bold border border-white/30 shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 shrink-0 overflow-hidden`}
      >
        {/* Subtle Outer Glow & Inner Ring */}
        <div className="absolute inset-0 rounded-full border border-white/20 opacity-80 pointer-events-none" />

        {/* Custom Bold Stylized 'P' SVG */}
        <svg
          className={`${pSvgSize} relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110`}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 10 6 C 8.343 6 7 7.343 7 9 V 23 C 7 24.657 8.343 26 10 26 C 11.657 26 13 24.657 13 23 V 19 H 17.5 C 21.642 19 25 15.642 25 11.5 C 25 7.358 21.642 6 17.5 6 H 10 Z M 13 10.5 H 17.5 C 18.052 10.5 19.5 10.948 19.5 12.5 C 19.5 14.052 18.052 14.5 17.5 14.5 H 13 V 10.5 Z"
            fill="white"
          />
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
