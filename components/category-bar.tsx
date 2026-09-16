'use client';

import React from 'react';
import {
  LayoutGrid,
  Trophy,
  Search,
  Megaphone,
  Cpu,
  Flame,
  Coffee,
  Utensils,
  Compass,
  Sparkles,
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Pakistani', icon: Trophy },
    { name: 'Fine Dining', icon: Search },
    { name: 'Japanese', icon: Megaphone },
    { name: 'Italian', icon: Cpu },
    { name: 'BBQ', icon: Flame },
    { name: 'Cafes', icon: Coffee },
    { name: 'Bakery', icon: Utensils },
    { name: 'Fast Casual', icon: Compass },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-3">
      {/* Unified warm capsule bar matching reference screenshot */}
      <div className="bg-[#F5F2EC] rounded-full p-1.5 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar border border-stone-200/70 shadow-xs">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition-all ${
                  isSelected
                    ? 'bg-coral-500 text-white font-bold shadow-coral-pill'
                    : 'text-stone-800 font-semibold hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-coral-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Explore button on far right matching sample */}
        <button
          onClick={() => onSelectCategory('All')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-coral-500 hover:bg-coral-50 transition-colors whitespace-nowrap flex-shrink-0 border-l border-stone-300/40 pl-3 ml-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          <span>Explore</span>
        </button>
      </div>
    </div>
  );
}
