'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { RegisterModal } from '@/components/register-modal';
import { TopupModal } from '@/components/topup-modal';
import { RulesModal } from '@/components/rules-modal';
import { Footer } from '@/components/footer';
import { Crown, MapPin, Utensils, TrendingUp, ArrowLeft, Building2 } from 'lucide-react';
import { formatCurrency, formatCityName } from '@/lib/city-utils';

function RestaurantContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?scope=national&limit=100`);
      const data = await res.json();
      if (data.items) {
        const found = data.items.find((r: any) => r.id === id);
        if (found) {
          setRestaurant(found);
        }
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col justify-between text-white">
        <Navbar
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenTopup={() => setIsTopupOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
        />
        <div className="text-center py-20 space-y-4">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h1 className="text-2xl font-bold">Restaurant Listing Not Found</h1>
          <Link href="/" className="text-amber-400 hover:underline text-sm font-semibold">
            Return to Leaderboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090d16] text-white">
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      <main className="max-w-4xl mx-auto w-full px-4 py-10 space-y-8 flex-1">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>

        {/* Restaurant Card */}
        <div className="glass-card-amber rounded-3xl p-8 space-y-6 border border-amber-500/40 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/80 shadow-lg">
                <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                    Rank #{restaurant.rank}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {restaurant.name}
                  </h1>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 font-medium">
                  <Link
                    href={`/city/${encodeURIComponent(restaurant.normalizedCity)}`}
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{restaurant.city}</span>
                  </Link>

                  {restaurant.cuisine && (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      • <Utensils className="w-3.5 h-3.5" /> {restaurant.cuisine}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsTopupOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Top Up / Overtake</span>
            </button>
          </div>

          {restaurant.description && (
            <p className="text-sm text-slate-300 italic border-t border-slate-800 pt-4 leading-relaxed">
              "{restaurant.description}"
            </p>
          )}

          {/* Stats Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Verified Paid</span>
              <div className="text-xl sm:text-2xl font-black gold-gradient-text mt-1">
                {formatCurrency(restaurant.totalPaidCents)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">City Scope</span>
              <div className="text-base sm:text-lg font-bold text-white mt-1">
                {formatCityName(restaurant.city)}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">National Leaderboard</span>
              <div className="text-base sm:text-lg font-extrabold text-amber-400 mt-1">
                Verified Listing
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <TopupModal isOpen={isTopupOpen} onClose={() => setIsTopupOpen(false)} targetRestaurant={restaurant} />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}

export default function RestaurantDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16] text-white p-8">Loading...</div>}>
      <RestaurantContent />
    </Suspense>
  );
}
