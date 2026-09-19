'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Record real-time visitor visit in database on page load & navigation
    fetch(`/api/track-visit?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ path: pathname || '/' }),
    }).catch((err) => {
      console.error('Visitor tracking failed:', err);
    });
  }, [pathname]);

  return null;
}
