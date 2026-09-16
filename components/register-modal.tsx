'use client';

import React, { useState } from 'react';
import { X, Upload, DollarSign, ShieldAlert, Sparkles, Building2, MapPin, Utensils, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/city-utils';

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
  'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80',
];

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
  defaultName?: string;
  defaultCuisine?: string;
  defaultBidDollars?: string;
  onDuplicateFound?: (duplicateInfo: any) => void;
}

export function RegisterModal({
  isOpen,
  onClose,
  defaultCity = '',
  defaultName = '',
  defaultCuisine = '',
  defaultBidDollars = '20',
  onDuplicateFound,
}: RegisterModalProps) {
  const [name, setName] = useState(defaultName);
  const [city, setCity] = useState(defaultCity);
  const [cuisine, setCuisine] = useState(defaultCuisine);
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0]);
  const [bidAmountDollars, setBidAmountDollars] = useState(defaultBidDollars);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state if default props change on modal open
  React.useEffect(() => {
    if (isOpen) {
      if (defaultName) setName(defaultName);
      if (defaultCity) setCity(defaultCity);
      if (defaultCuisine) setCuisine(defaultCuisine);
      if (defaultBidDollars) setBidAmountDollars(defaultBidDollars);
    }
  }, [isOpen, defaultName, defaultCity, defaultCuisine, defaultBidDollars]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setLogoUrl(data.url);
      } else {
        setErrorMessage(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMessage('Image upload failed. Please try again or use a sample.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Restaurant name is required.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('City is required.');
      return;
    }
    if (!logoUrl) {
      setErrorMessage('Logo image is required.');
      return;
    }

    const bidCents = Math.round(parseFloat(bidAmountDollars) * 100);
    if (isNaN(bidCents) || bidCents < 100) {
      setErrorMessage('Minimum entry bid is $1.00.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim(),
          cuisine: cuisine.trim(),
          description: description.trim(),
          logoUrl,
          bidCents,
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.isDuplicate) {
        if (onDuplicateFound) {
          onDuplicateFound(data);
        } else {
          setErrorMessage(data.message);
        }
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed.');
        return;
      }

      // Redirect to Stripe Checkout or Mock Success Page
      if (data.stripeCheckoutUrl) {
        window.location.href = data.stripeCheckoutUrl;
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-coral-500 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-stone-900">Claim & List Restaurant Rank</h2>
              <p className="text-[11px] text-stone-500">Pay once to hold your position on the public leaderboard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Restaurant Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Name / Handle <span className="text-coral-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Le Petit Maison"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                City <span className="text-coral-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore, New York"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Cuisine & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Category / Cuisine
              </label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Pakistani, Fine Dining"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-coral-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Short Tagline
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Roof-deck fine dining..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Logo Icon <span className="text-coral-500">*</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1.5 flex-1">
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {PRESET_LOGOS.slice(0, 5).map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLogoUrl(url)}
                      className={`w-7 h-7 rounded-md overflow-hidden border transition-all flex-shrink-0 ${
                        logoUrl === url ? 'border-coral-500 ring-2 ring-coral-200' : 'border-stone-200 opacity-60'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Amount Input */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-coral-500" /> Target Bid Amount (USD)
              </label>
              <span className="text-[11px] text-stone-500">Min: $1.00</span>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-coral-500 font-extrabold text-base">
                $
              </span>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={bidAmountDollars}
                onChange={(e) => setBidAmountDollars(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-coral-500 font-money font-black text-lg focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full py-3 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-coral-pill transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Pay ${bidAmountDollars || '1'} & Lock Rank</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

