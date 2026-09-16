'use client';

import React from 'react';
import { LayoutGrid, Trophy, Search, Megaphone, Cpu, Bot, Coins, Plus, Compass } from 'lucide-react';

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
    { name: 'BBQ', icon: Bot },
    { name: 'Cafes', icon: Coins },
    { name: 'Bakery', icon: Plus },
    { name: 'Fast Casual', icon: Compass },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-semibold">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-coral-500 text-white border-coral-500 shadow-coral-pill font-bold'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
