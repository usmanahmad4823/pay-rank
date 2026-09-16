'use client';

import React from 'react';

interface PublicProjectStatsProps {
  totalCount?: number;
}

export function PublicProjectStats({ totalCount }: PublicProjectStatsProps) {
  const count = totalCount || 2919;

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 my-10 space-y-6 text-center">
      <p className="text-xs sm:text-sm text-stone-600 font-medium">
        Some stats about this <span className="text-coral-500 font-bold">simple side project</span> since its launch 27 days ago
      </p>

      {/* 3 Stat Cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Visitors */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-0.5">
          <div className="flex items-center gap-2 font-mono font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span>1,558,322</span>
          </div>
          <span className="text-stone-500 text-xs font-medium">visitors</span>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-0.5">
          <div className="flex items-center gap-1 font-mono font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
            <span className="text-coral-500">$</span>
            <span>260,138</span>
          </div>
          <span className="text-stone-500 text-xs font-medium">revenue</span>
        </div>

        {/* Products added */}
        <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-0.5">
          <div className="font-mono font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
            {count.toLocaleString()}
          </div>
          <span className="text-stone-500 text-xs font-medium">products added</span>
        </div>
      </div>

      {/* Footer Attribution Line */}
      <div className="space-y-2 pt-2 text-center text-xs text-stone-500">
        <p>
          Built by{' '}
          <a
            href="https://x.com/jonathan_wilke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-coral-500 font-medium hover:text-coral-600 transition-colors cursor-pointer"
          >
            @jonathan_wilke
          </a>{' '}
          · Brought to you by{' '}
          <a
            href="https://supastarter.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-coral-500 font-medium hover:text-coral-600 transition-colors cursor-pointer"
          >
            supastarter.dev
          </a>
        </p>

        <div className="flex items-center justify-center gap-2 text-coral-500 font-semibold text-[11px] flex-wrap">
          <a href="/rules" className="hover:text-coral-600 transition-colors cursor-pointer">
            Rules
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#faq" className="hover:text-coral-600 transition-colors cursor-pointer">
            FAQ
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#terms" className="hover:text-coral-600 transition-colors cursor-pointer">
            Terms
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#privacy" className="hover:text-coral-600 transition-colors cursor-pointer">
            Privacy
          </a>
          <span className="text-stone-300">•</span>
          <a href="/rules#imprint" className="hover:text-coral-600 transition-colors cursor-pointer">
            Imprint
          </a>
          <span className="text-stone-300">•</span>
          <a href="#top" className="hover:text-coral-600 transition-colors cursor-pointer">
            Live stats
          </a>
        </div>
      </div>
    </section>
  );
}
