'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Trophy, CreditCard } from 'lucide-react';

export function HowItWorksTimeline() {
  const steps = [
    {
      step: '01',
      title: 'Submit Link & Target Bid',
      description: 'Enter your business name, destination website URL, city location, and target bid total starting at just $1.',
      icon: CreditCard,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '02',
      title: 'Stripe Webhook Verification',
      description: 'Complete checkout securely. Our server listens for signature-verified webhooks before marking your entry verified.',
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      step: '03',
      title: 'Claim Rank & Top Up Delta',
      description: 'Your rank updates instantly on the live city and national leaderboards. Top up anytime by paying only the difference.',
      icon: Trophy,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
          How PayRank Works — From <br className="hidden sm:inline" />
          <span className="blue-gradient-text">Submission to #1 Rank</span>
        </h2>
        <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
          Zero complex onboarding, zero subscription contracts. Get listed on the public board in under 60 seconds.
        </p>
      </div>

      {/* 3 Step Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="glass-card-light p-8 rounded-3xl relative overflow-hidden group hover:border-blue-300 hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} border flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-heading font-black text-3xl text-slate-300 group-hover:text-blue-500 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-600">
                <span>Verified Step</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
