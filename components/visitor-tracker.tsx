'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Increment page reload visitor counter in localStorage
    try {
      const currentLocal = parseInt(localStorage.getItem('payrank_local_visitors') || '0', 10);
      const newLocal = Math.max(1, currentLocal + 1);
      localStorage.setItem('payrank_local_visitors', newLocal.toString());
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('payrank_visitor_increment'));
      }
    } catch {
      // ignore storage errors
    }

    // 2. Record real-time visitor visit in database on page load & navigation
    fetch(`/api/track-visit?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ path: pathname || '/' }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
