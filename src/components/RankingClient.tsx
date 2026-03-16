'use client';

import { useState, useMemo } from 'react';
import { getAllVenues, CAT_SLUG_TO_LABEL } from '@/lib/venues';

const CATEGORY_TABS = [
  { slug: 'all', label: '전체' },
  { slug: 'club', label: '클럽' },
  { slug: 'night', label: '나이트' },
  { slug: 'lounge', label: '라운지' },
  { slug: 'room', label: '룸' },
  { slug: 'yojeong', label: '요정' },
  { slug: 'hoppa', label: '호빠' },
];

const PERIOD_TABS = [
  { key: 'daily', label: '일간' },
  { key: 'weekly', label: '주간' },
  { key: 'monthly', label: '월간' },
];

function getRankColor(rank: number): string {
  if (rank === 1) return '#D4A017';
  if (rank === 2) return '#A0A0A0';
  if (rank === 3) return '#CD7F32';
  return '#8B5CF6';
}

export default function RankingClient() {
  const allVenues = useMemo(() => getAllVenues(), []);
  const [activeCat, setActiveCat] = useState('all');
  const [activePeriod, setActivePeriod] = useState('daily');

  const ranked = useMemo(() => {
    let list = activeCat === 'all' ? allVenues : allVenues.filter((v) => v.cat_slug === activeCat);
    return list.slice(0, 20);
  }, [allVenues, activeCat]);

  return (
    <div>
      {/* 카테고리 탭 */}
      <div className="filter-bar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.slug}
            className={`filter-btn${activeCat === tab.slug ? ' active' : ''}`}
            onClick={() => setActiveCat(tab.slug)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 기간 탭 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {PERIOD_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePeriod(tab.key)}
            style={{
              background: activePeriod === tab.key ? 'var(--purple)' : 'transparent',
              color: activePeriod === tab.key ? '#FFF' : 'var(--text-muted)',
              border: `1px solid ${activePeriod === tab.key ? 'var(--purple)' : 'var(--border)'}`,
              padding: '0.35rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 랭킹 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {ranked.map((venue, i) => {
          const rank = i + 1;
          const color = getRankColor(rank);

          return (
            <a
              key={venue.slug}
              href={`/${venue.cat_slug}/${venue.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'inherit',
                background: 'var(--bg-card)',
                transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                minHeight: '90px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* 순위 배지 */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: color,
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: rank <= 3 ? '1rem' : '0.85rem',
                  flexShrink: 0,
                }}
              >
                {rank}
              </div>

              {/* 업소 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                    {venue.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: 'rgba(139,92,246,0.08)',
                      color: 'var(--purple)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {CAT_SLUG_TO_LABEL[venue.cat_slug] || venue.cat_slug}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  {venue.region} {venue.district}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-sub)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {venue.card_hook}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {ranked.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
          해당 카테고리에 등록된 업소가 없습니다.
        </p>
      )}
    </div>
  );
}
