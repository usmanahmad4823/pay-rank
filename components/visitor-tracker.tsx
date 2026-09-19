'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();
  const [beaconUrl, setBeaconUrl] = useState<string>('');

  useEffect(() => {
    const timestamp = Date.now();
    const targetPath = encodeURIComponent(pathname || '/');
    
    // Set 1x1 image tracking beacon URL
    setBeaconUrl(`/api/track-visit?img=1&path=${targetPath}&t=${timestamp}`);

    // Also send async POST fetch call
    fetch(`/api/track-visit?t=${timestamp}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ path: pathname || '/' }),
    }).catch(() => {});
  }, [pathname]);

  if (!beaconUrl) return null;

  return (
    <img
      src={beaconUrl}
      alt=""
      width={1}
      height={1}
      style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
