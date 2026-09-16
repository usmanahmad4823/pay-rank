'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Crown, CheckCircle2, Copy, Check, MapPin, Globe, Sparkles, TrendingUp, Key, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('session_id') || '';
  const restaurantId = searchParams.get('restaurant_id') || '';
  const token = searchParams.get('token') || '';

  const [statusData, setStatusData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#FFFFFF', '#10B981'],
      });
    } catch (e) {
      // Ignore confetti errors if canvas fails
    }

    async function checkStatus() {
      try {
        const url = new URL('/api/checkout/status', window.location.origin);
        if (sessionId) url.searchParams.set('session_id', sessionId);
        if (restaurantId) url.searchParams.set('restaurant_id', restaurantId);
        if (token) url.searchParams.set('token', token);

        const res = await fetch(url.toString());
        const data = await res.json();
        if (data) {
          setStatusData(data);
        }
      } catch (err) {
        console.error('Failed to verify checkout status:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkStatus();
  }, [sessionId, restaurantId, token]);

  const copyToken = () => {
    if (!statusData?.ownerEditToken) return;
    navigator.clipboard.writeText(statusData.ownerEditToken);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 text-stone-900 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-500 font-bold text-xs">Verifying payment & updating rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 text-stone-900 font-sans">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-outbid-card space-y-5 text-center animate-in fade-in zoom-in-95 duration-300 my-6">
        {/* Confetti Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-coral-500 text-white flex items-center justify-center mx-auto shadow-coral-pill">
          <Crown className="w-8 h-8 fill-white" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payment Confirmed & Verified
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {statusData?.name || 'Your Restaurant'} is Live!
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Your payment of{' '}
            <strong className="text-coral-500 font-money">{formatCurrency(statusData?.totalPaidCents || 0)}</strong> has been verified.
          </p>
        </div>

        {/* Rank Positions Box */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-coral-500" /> {statusData?.city || 'City'} Rank
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-coral-500 mt-0.5">
              #{statusData?.rankInCity || 1}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-center gap-1">
              <Globe className="w-3 h-3 text-coral-500" /> National Rank
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
              #{statusData?.rankNational || 1}
            </div>
          </div>
        </div>

        {/* Owner Edit Token Box */}
        {statusData?.ownerEditToken && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-coral-500" /> Secret Owner Edit Token
              </label>
              <span className="text-[10px] text-stone-400 font-semibold">Keep secret!</span>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 font-mono text-xs truncate">
                {statusData.ownerEditToken}
              </code>
              <button
                onClick={copyToken}
                className="px-3 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0 shadow-coral-pill"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-stone-500">
              Save this token! You need it whenever you return to top up your payment and reclaim rank #1.
            </p>
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Link
            href={statusData?.normalizedCity ? `/city/${encodeURIComponent(statusData.normalizedCity)}` : '/'}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center justify-center gap-1.5"
          >
            <span>View City Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-stone-200"
          >
            <span>National Leaderboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 text-stone-900 font-sans">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-500 font-bold text-xs">Loading checkout status...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
