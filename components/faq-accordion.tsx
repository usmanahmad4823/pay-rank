'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How is rank calculated on PayRank?',
      answer: 'Rank positions are determined strictly by total verified paid amounts (currentBidCents). The entry with the highest cumulative paid total holds position #1 nationwide or within a specific city. If two entries have equal bids, the earlier timestamp holds priority.',
    },
    {
      question: 'How does the Re-Bid Top-Up mechanic work?',
      answer: 'Existing owners never pay twice. When submitting a re-bid for an already listed link or handle, our system automatically recognizes your entry, calculates your current balance, and charges ONLY the difference required to reach your new target total.',
    },
    {
      question: 'When do rank updates take effect?',
      answer: 'Listings and position changes update immediately upon receiving a cryptographically verified Stripe checkout signature webhook. Failed, pending, or unverified bids are never shown on the board.',
    },
    {
      question: 'Are there any recurring subscriptions or hidden fees?',
      answer: 'No. PayRank operates on a pure one-time bid model. There are zero monthly subscriptions, zero cancellation fees, and zero hidden maintenance charges. Pay once to claim your rank.',
    },
    {
      question: 'Are payments refundable?',
      answer: 'All payments are final and non-refundable. Because rank positions are updated in real-time on the public board, bids cannot be reverted once confirmed by the Stripe webhook.',
    },
  ];

  return (
    <section id="faq" className="w-full py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Rules & Transparency</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Frequently Asked <span className="blue-gradient-text">Questions</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Everything you need to know about monetary rankings, top-up math, and webhook verification.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="glass-card-light rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg hover:text-blue-600 transition-colors"
              >
                <span>{faq.question}</span>
                <div
                  className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
