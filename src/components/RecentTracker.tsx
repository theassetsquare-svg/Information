'use client';

import { useEffect } from 'react';

export default function RecentTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_venues');
      const recent: string[] = stored ? JSON.parse(stored) : [];
      const filtered = recent.filter(s => s !== slug);
      filtered.unshift(slug);
      localStorage.setItem('recent_venues', JSON.stringify(filtered.slice(0, 10)));
    } catch {}
  }, [slug]);

  return null;
}
