'use client';

import { useState, useMemo } from 'react';
import { getAllVenues, CAT_SLUG_TO_LABEL } from '../lib/venues';
import type { Venue } from '../lib/venues';
import Roulette from './Roulette';

const categoryButtons = [
  { slug: 'club', label: '클럽' },
  { slug: 'night', label: '나이트' },
  { slug: 'lounge', label: '라운지' },
  { slug: 'room', label: '룸' },
  { slug: 'yojeong', label: '요정' },
  { slug: 'hoppa', label: '호빠' },
];

export default function RoulettePageClient() {
  const allVenues = useMemo(() => getAllVenues(), []);
  const [catResult, setCatResult] = useState<Venue | null>(null);
  const [catSpinning, setCatSpinning] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const spinCategory = (catSlug: string) => {
    const filtered = allVenues.filter(v => v.cat_slug === catSlug);
    if (filtered.length === 0) return;
    setCatSpinning(true);
    setCatResult(null);
    setActiveCat(catSlug);
    setTimeout(() => {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setCatResult(random);
      setCatSpinning(false);
    }, 1200);
  };

  return (
    <>
      {/* 전체 랜덤 룰렛 */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '2.5rem 1.5rem', marginBottom: '3rem',
      }}>
        <Roulette venues={allVenues} />
      </div>

      {/* 카테고리별 랜덤 */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>카테고리별 랜덤</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          원하는 카테고리를 골라서 돌려보자.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {categoryButtons.map(cat => (
            <button
              key={cat.slug}
              onClick={() => spinCategory(cat.slug)}
              disabled={catSpinning}
              style={{
                padding: '0.875rem 0.5rem',
                background: activeCat === cat.slug ? 'var(--purple)' : 'var(--bg-alt)',
                color: activeCat === cat.slug ? '#FFF' : 'var(--text)',
                border: '1px solid',
                borderColor: activeCat === cat.slug ? 'var(--purple)' : 'var(--border)',
                borderRadius: '12px',
                cursor: catSpinning ? 'wait' : 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {catSpinning && (
          <p style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '1rem', margin: '1.5rem 0' }}>
            돌리는 중...
          </p>
        )}

        {catResult && !catSpinning && (
          <div style={{
            marginTop: '1.5rem', padding: '1.5rem',
            background: 'var(--bg-card)', border: '2px solid var(--border-accent)',
            borderRadius: '16px', maxWidth: '400px', margin: '1.5rem auto 0',
          }}>
            <span style={{
              fontSize: '0.75rem', color: 'var(--purple)', fontWeight: 600,
              letterSpacing: '0.08em',
            }}>
              {CAT_SLUG_TO_LABEL[catResult.cat_slug] || catResult.cat_slug} · {catResult.region}
            </span>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem' }}>{catResult.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {catResult.card_hook}
            </p>
            <a
              href={`/${catResult.cat_slug}/${catResult.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', background: 'var(--purple)', color: '#FFF',
                padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600,
                textDecoration: 'none', fontSize: '0.9rem',
              }}
            >
              상세 보기 →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
