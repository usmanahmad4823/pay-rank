'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'green' | 'coral';
}

export function Logo({ className = '', iconOnly = false, size = 'md', theme = 'green' }: LogoProps) {
  // Standard valid Tailwind CSS width and height classes
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const pSvgSize = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7.5 h-7.5',
  }[size];

  const textSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const bgClass = theme === 'green'
    ? 'bg-[#22A57E] shadow-emerald-500/20'
    : 'bg-[#F97316] shadow-coral-500/20';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      title="PayRank — #1 Pay-to-Rank Leaderboard"
    >
      {/* 100% Accurate Fully Circular Badge from Reference Image */}
      <div
        className={`relative ${iconSizeClasses} rounded-full ${bgClass} text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 shrink-0 overflow-hidden`}
      >
        {/* Exact Stylized White 'P' SVG Vector */}
        <svg
          className={`${pSvgSize} text-white transition-transform duration-300 group-hover:scale-105`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33 20C30.2386 20 28 22.2386 28 25V71C28 73.7614 30.2386 76 33 76C35.7614 76 38 73.7614 38 71V58H54C64.4934 58 73 49.4934 73 39C73 28.5066 64.4934 20 54 20H33ZM38 30V48H54C58.9706 48 63 43.9706 63 39C63 34.0294 58.9706 30 54 30H38Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Brand Wordmark (Shows next to logo) */}
      {!iconOnly && (
        <span
          className={`font-heading font-black ${textSizeClasses} tracking-tight text-stone-900 leading-none whitespace-nowrap flex items-center`}
        >
          <span>Pay</span>
          <span className="text-coral-500 font-black ml-0.5">
            Rank
          </span>
        </span>
      )}
    </Link>
  );
}
