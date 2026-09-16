'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Trophy,
  Search,
  Megaphone,
  Cpu,
  Flame,
  Coffee,
  Utensils,
  Compass,
  ChevronDown,
  Check,
} from 'lucide-react';

export interface CategoryOption {
  name: string;
  icon: React.ElementType;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { name: 'Pakistani', icon: Trophy },
  { name: 'Fine Dining', icon: Search },
  { name: 'Japanese', icon: Megaphone },
  { name: 'Italian', icon: Cpu },
  { name: 'BBQ', icon: Flame },
  { name: 'Cafes', icon: Coffee },
  { name: 'Bakery', icon: Utensils },
  { name: 'Fast Casual', icon: Compass },
];

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
  className?: string;
}

export function CategoryDropdown({ value, onChange, className = '' }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedObj = CATEGORY_OPTIONS.find((c) => c.name === value) || CATEGORY_OPTIONS[0];
  const SelectedIcon = selectedObj.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 rounded-full bg-white border border-stone-200/80 text-stone-800 text-xs sm:text-sm font-semibold shadow-apple-card hover:shadow-apple-hover hover:border-stone-300 flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-98"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <SelectedIcon className="w-4 h-4 text-coral-500 flex-shrink-0" />
          <span className="truncate">{selectedObj.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-coral-500' : ''
          }`}
        />
      </button>

      {/* Floating Popover Dropdown Menu matching sample design */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-1.5 z-50 min-w-[190px] bg-white border border-stone-200/90 rounded-2xl shadow-xl p-1 space-y-0.5 max-h-72 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
          {CATEGORY_OPTIONS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = cat.name === value;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  onChange(cat.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#F5F2EC] text-stone-900 font-medium'
                    : 'text-stone-700 font-normal hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-coral-500' : 'text-stone-400'}`} />
                  <span>{cat.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-coral-500 stroke-[2]" />}
              </button>
            );
          })}

          {/* Bottom Chevron scroll indicator matching sample image 2 */}
          <div className="pt-0.5 flex justify-center pb-0.5 border-t border-stone-100/80 mt-0.5">
            <ChevronDown className="w-3 h-3 text-stone-300" />
          </div>
        </div>
      )}
    </div>
  );
}
