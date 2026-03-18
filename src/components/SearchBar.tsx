'use client';

import { useState, useMemo } from 'react';

interface Venue {
  name: string;
  slug: string;
  cat_slug: string;
  region: string;
  district: string;
  card_hook: string;
}

const popularTags = ['강남 플로어', '수원', '부산', '대전', '해운대', '호빠', '울산'];

export default function SearchBar({ venues }: { venues: Venue[] }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return venues.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.region.toLowerCase().includes(q) ||
      v.district.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, venues]);

  return (
    <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="업소명, 지역으로 검색"
        style={{
          width: '100%', padding: '0.875rem 1.25rem', fontSize: '1rem',
          border: '2px solid #E5E7EB', borderRadius: '12px',
          outline: 'none', background: '#FFF', color: '#111',
          fontFamily: 'var(--font-sans)',
        }}
      />

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px',
          marginTop: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden',
        }}>
          {results.map(v => (
            <a
              key={v.slug}
              href={`/${v.cat_slug}/${v.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '0.75rem 1rem',
                borderBottom: '1px solid #E5E7EB', textDecoration: 'none',
                color: '#111', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F5F5F5')}
              onMouseLeave={e => (e.currentTarget.style.background = '#FFF')}
            >
              <span style={{ fontWeight: 600 }}>{v.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#555', marginLeft: '0.5rem' }}>
                {v.region}
              </span>
            </a>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px',
          marginTop: '0.5rem', padding: '1rem', textAlign: 'center', color: '#555',
        }}>
          검색 결과가 없습니다.
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
        {popularTags.map(tag => (
          <button
            key={tag}
            onClick={() => { setQuery(tag); setOpen(true); }}
            style={{
              background: '#FFF', border: '1px solid #E5E7EB',
              borderRadius: '20px', padding: '0.4rem 0.875rem', fontSize: '0.85rem',
              color: '#333', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
