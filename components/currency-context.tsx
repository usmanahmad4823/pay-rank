'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'PKR';

const USD_TO_PKR = 278;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
  formatAmount: (cents: number) => string;
  formatDollars: (dollars: number) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  exchangeRate: USD_TO_PKR,
  formatAmount: (cents: number) => `$${(cents / 100).toLocaleString()}`,
  formatDollars: (dollars: number) => `$${dollars.toLocaleString()}`,
  currencySymbol: '$',
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('payrank_currency') as Currency;
      if (saved === 'USD' || saved === 'PKR') {
        setCurrencyState(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('payrank_currency', newCurrency);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const formatAmount = (cents: number): string => {
    const usdVal = cents / 100;
    if (currency === 'PKR') {
      const pkrVal = Math.round(usdVal * USD_TO_PKR);
      return `Rs ${pkrVal.toLocaleString()}`;
    }
    const hasCents = cents % 100 !== 0;
    return `$${usdVal.toLocaleString('en-US', {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDollars = (dollars: number): string => {
    if (currency === 'PKR') {
      const pkrVal = Math.round(dollars * USD_TO_PKR);
      return `Rs ${pkrVal.toLocaleString()}`;
    }
    const hasCents = dollars % 1 !== 0;
    return `$${dollars.toLocaleString('en-US', {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const currencySymbol = currency === 'PKR' ? 'Rs ' : '$';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate: USD_TO_PKR,
        formatAmount,
        formatDollars,
        currencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
