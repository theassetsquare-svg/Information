'use client';

import { useMemo } from 'react';
import { getAllVenues, CAT_SLUG_TO_LABEL } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

const CAT_COLORS: Record<string, string> = {
  club: '#D4AF37',
  night: '#D4AF37',
  lounge: '#06B6D4',
  room: '#F59E0B',
  yojeong: '#EF4444',
  hoppa: '#F472B6',
};

const CAT_LINKS: Record<string, string> = {
  club: '/clubs/',
  night: '/nights/',
  lounge: '/lounges/',
  room: '/rooms/',
  yojeong: '/yojeongs/',
  hoppa: '/hoppas/',
};

interface RegionStat {
  region: string;
  count: number;
}

function getRegionStats(venues: Venue[]): RegionStat[] {
  const map: Record<string, number> = {};
  for (const v of venues) {
    map[v.region] = (map[v.region] || 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([region, count]) => ({ region, count }));
}

export default function MapClient() {
  const allVenues = useMemo(() => getAllVenues(), []);

  const categoryCards = useMemo(() => {
    const catSlugs = ['club', 'night', 'lounge', 'room', 'yojeong', 'hoppa'];
    return catSlugs.map((slug) => {
      const venues = allVenues.filter((v) => v.cat_slug === slug);
      const topRegions = getRegionStats(venues);
      return {
        slug,
        label: CAT_SLUG_TO_LABEL[slug],
        color: CAT_COLORS[slug],
        link: CAT_LINKS[slug],
        total: venues.length,
        topRegions,
      };
    }).filter((c) => c.total > 0);
  }, [allVenues]);

  return (
    <div>
      {/* 지도 플레이스홀더 */}
      <div
        style={{
          width: '100%',
          height: '400px',
          background: '#1A1714',
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

      {/* 업소 수 */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        총 <strong style={{ color: 'var(--purple)' }}>{allVenues.length}</strong>곳
      </p>

      {/* 카테고리별 요약 카드 6장 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {categoryCards.map((cat) => (
          <a
            key={cat.slug}
            href={cat.link}
            style={{
              display: 'block',
              padding: '1.25rem 1.5rem',
              border: `1px solid var(--border)`,
              borderRadius: '14px',
              textDecoration: 'none',
              color: 'inherit',
              background: 'var(--bg-card)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: cat.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                {cat.label}
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: cat.color,
                }}
              >
                {cat.total}곳
              </span>
            </div>

            {/* 주요 지역 */}
            {cat.topRegions.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {cat.topRegions.map((r) => (
                  <span
                    key={r.region}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      background: `${cat.color}10`,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {r.region} {r.count}곳
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
