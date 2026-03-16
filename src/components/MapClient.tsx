'use client';

import { useState, useMemo } from 'react';
import { getAllVenues, CAT_SLUG_TO_LABEL } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

const CAT_COLORS: Record<string, string> = {
  club: '#8B5CF6',
  night: '#EC4899',
  lounge: '#06B6D4',
  room: '#F59E0B',
  yojeong: '#EF4444',
  hoppa: '#F472B6',
};

const CATEGORIES = [
  { slug: 'all', label: '전체' },
  { slug: 'club', label: '클럽' },
  { slug: 'night', label: '나이트' },
  { slug: 'lounge', label: '라운지' },
  { slug: 'room', label: '룸' },
  { slug: 'yojeong', label: '요정' },
  { slug: 'hoppa', label: '호빠' },
];

function groupByRegion(venues: Venue[]): Record<string, Venue[]> {
  const groups: Record<string, Venue[]> = {};
  for (const v of venues) {
    const key = v.region;
    if (!groups[key]) groups[key] = [];
    groups[key].push(v);
  }
  return groups;
}

export default function MapClient() {
  const allVenues = useMemo(() => getAllVenues(), []);
  const [activeCat, setActiveCat] = useState('all');

  const filtered = useMemo(() => {
    if (activeCat === 'all') return allVenues;
    return allVenues.filter((v) => v.cat_slug === activeCat);
  }, [allVenues, activeCat]);

  const grouped = useMemo(() => groupByRegion(filtered), [filtered]);
  const regionOrder = Object.keys(grouped).sort();

  return (
    <div>
      {/* 지도 플레이스홀더 */}
      <div
        style={{
          width: '100%',
          height: '400px',
          background: '#F3F4F6',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: '#FFF',
              fontSize: '1.5rem',
            }}
          >
            &#9906;
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
            카카오맵 연동 준비 중
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            지도 API 연결 후 전국 업소 위치를 표시합니다
          </p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className={`filter-btn${activeCat === cat.slug ? ' active' : ''}`}
            onClick={() => setActiveCat(cat.slug)}
            style={
              cat.slug !== 'all' && activeCat === cat.slug
                ? { borderColor: CAT_COLORS[cat.slug], color: CAT_COLORS[cat.slug] }
                : undefined
            }
          >
            {cat.slug !== 'all' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: CAT_COLORS[cat.slug],
                  marginRight: '0.4rem',
                  verticalAlign: 'middle',
                }}
              />
            )}
            {cat.label}
          </button>
        ))}
      </div>

      {/* 카테고리 색상 범례 */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        {Object.entries(CAT_COLORS).map(([slug, color]) => (
          <span key={slug} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            {CAT_SLUG_TO_LABEL[slug]}
          </span>
        ))}
      </div>

      {/* 업소 수 */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        총 <strong style={{ color: 'var(--purple)' }}>{filtered.length}</strong>곳
      </p>

      {/* 지역별 그룹 목록 */}
      {regionOrder.map((region) => (
        <div key={region} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            {region}
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              {grouped[region].length}곳
            </span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {grouped[region].map((venue) => (
              <a
                key={venue.slug}
                href={`/${venue.cat_slug}/${venue.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  background: 'var(--bg-card)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = CAT_COLORS[venue.cat_slug] || 'var(--purple)';
                  e.currentTarget.style.boxShadow = `0 2px 12px ${CAT_COLORS[venue.cat_slug] || 'var(--purple)'}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: CAT_COLORS[venue.cat_slug] || 'var(--purple)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {venue.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {CAT_SLUG_TO_LABEL[venue.cat_slug]} · {venue.district}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
