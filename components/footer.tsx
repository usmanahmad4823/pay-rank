'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/80 bg-white py-8 text-stone-500 text-xs mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-heading font-black text-stone-900">
            payrank<span className="text-coral-500">.lol</span>
          </span>
          <span className="text-stone-300">•</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 font-semibold text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">Daily Leaderboard</Link>
          <a href="#top" className="hover:text-coral-500 transition-colors">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}


