'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { ShieldCheck, DollarSign, Globe, Lock, HelpCircle, ArrowLeft, Plus, Sparkles } from 'lucide-react';

export default function RulesPage() {
  const router = useRouter();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans">
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
        onOpenRules={() => {}}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-coral-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Leaderboard
        </button>

        <section className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-coral-500" /> Platform Guidelines & Transparency
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            How Pay-to-Rank Works
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
            PayRank is built on absolute transparency. No algorithms, no user review manipulation, no hidden boosting. Position is determined purely by total money paid.
          </p>
        </section>

        {/* 4 Pillars */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2.5 shadow-outbid-card">
            <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-900">1. Pure Monetary Ranking</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every restaurant is ranked strictly by <code className="text-coral-600 font-mono">total_paid_cents</code> descending. The highest cumulative payer holds rank #1. Minimum entry bid is $1.00.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2.5 shadow-outbid-card">
            <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-900">2. Dual Ranking Scopes</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your single paid amount determines your position on both your <strong className="text-stone-800">City Leaderboard</strong> and the <strong className="text-stone-800">National Leaderboard</strong> simultaneously.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2.5 shadow-outbid-card">
            <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-900">3. Top-Up Anytime</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              If another restaurant overtakes your rank, return anytime with your secret <strong className="text-stone-800">Owner Edit Token</strong> and make an additional top-up payment. Top-ups ADD to your existing total.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2.5 shadow-outbid-card">
            <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-900">4. All Payments Non-Refundable</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              All bids and top-ups are final, one-time non-refundable payments. Listings are verified automatically upon payment webhook confirmation.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 text-center space-y-3 shadow-outbid-card">
          <h2 className="font-heading text-xl font-extrabold text-stone-900">Ready to Claim Rank #1?</h2>
          <p className="text-stone-500 text-xs max-w-lg mx-auto">
            List your restaurant in under 60 seconds with an initial bid starting at just $1.
          </p>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-6 py-3 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>List Restaurant Now</span>
          </button>
        </section>
      </main>

      <Footer />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <TopupModal
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
      />
    </div>
  );
}
