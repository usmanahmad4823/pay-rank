'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Record real-time visitor visit in database on page load & navigation
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname || '/' }),
    }).catch((err) => {
      console.error('Visitor tracking failed:', err);
    });
  }, [pathname]);

  return null;
}
