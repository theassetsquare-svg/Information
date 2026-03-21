'use client';

import { useState, useMemo } from 'react';
import { getAllVenues, CAT_SLUG_TO_LABEL } from '../lib/venues';
import type { Venue } from '../lib/venues';
import VsBattle from './VsBattle';

interface MatchUp {
  title: string;
  a: Venue;
  b: Venue;
}

function getDayHash(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function generateMatchups(venues: Venue[]): MatchUp[] {
  const day = getDayHash();
  const matchups: MatchUp[] = [];

  const pairings = [
    { catA: 'club', catB: 'lounge', label: '클럽 vs 라운지' },
    { catA: 'night', catB: 'hoppa', label: '나이트 vs 호빠' },
    { catA: 'room', catB: 'yojeong', label: '룸 vs 요정' },
  ];

  pairings.forEach((pair, idx) => {
    const venuesA = venues.filter(v => v.cat_slug === pair.catA);
    const venuesB = venues.filter(v => v.cat_slug === pair.catB);
    if (venuesA.length > 0 && venuesB.length > 0) {
      const a = venuesA[(day + idx * 7) % venuesA.length];
      const b = venuesB[(day + idx * 13) % venuesB.length];
      matchups.push({ title: pair.label, a, b });
    }
  });

  return matchups;
}

const hallOfFame = [
  { winner: '강남 옥타곤', loser: '이태원 케이크샵', votes: '72% vs 28%', week: '2025년 48주차' },
  { winner: '수유 샴푸나이트', loser: '노원 세븐나이트', votes: '65% vs 35%', week: '2025년 47주차' },
  { winner: '압구정 코드라운지', loser: '청담 르클럽', votes: '58% vs 42%', week: '2025년 46주차' },
  { winner: '강남 레이스', loser: '이태원 파우스트', votes: '61% vs 39%', week: '2025년 45주차' },
  { winner: '해운대 빌리진', loser: '서면 그루브', votes: '55% vs 45%', week: '2025년 44주차' },
];

const lastWeekResults = [
  { matchup: '클럽 vs 나이트', winner: '클럽 사이드가 승리', pct: '62%' },
  { matchup: '라운지 vs 호빠', winner: '라운지 사이드가 승리', pct: '57%' },
  { matchup: '룸 vs 요정', winner: '요정 사이드가 승리', pct: '54%' },
];

export default function VsPageClient() {
  const allVenues = useMemo(() => getAllVenues(), []);
  const matchups = useMemo(() => generateMatchups(allVenues), [allVenues]);
  const [votedMap, setVotedMap] = useState<Record<number, number>>({});
  const [countsMap, setCountsMap] = useState<Record<number, [number, number]>>({
    0: [47, 53],
    1: [38, 62],
    2: [55, 45],
  });

  const vote = (matchIdx: number, side: number) => {
    if (votedMap[matchIdx] !== undefined) return;
    setVotedMap(prev => ({ ...prev, [matchIdx]: side }));
    setCountsMap(prev => {
      const cur = prev[matchIdx] || [50, 50];
      const updated: [number, number] = side === 0 ? [cur[0] + 1, cur[1]] : [cur[0], cur[1] + 1];
      return { ...prev, [matchIdx]: updated };
    });
  };

  return (
    <>
      {/* 메인 VS (VsBattle 컴포넌트) */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '2rem 1.5rem', marginBottom: '2rem',
      }}>
        <VsBattle venues={allVenues} />
      </div>

      {/* 추가 매치업 */}
      {matchups.map((m, idx) => {
        const voted = votedMap[idx];
        const counts = countsMap[idx] || [50, 50];
        const total = counts[0] + counts[1];
        return (
          <div key={idx} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem',
          }}>
            <h3 style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--purple)', marginBottom: '1rem' }}>
              {m.title}
            </h3>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              gap: '0.75rem', alignItems: 'center',
            }}>
              <button
                onClick={() => vote(idx, 0)}
                style={{
                  padding: '1.25rem 0.75rem',
                  background: voted === 0 ? 'var(--purple)' : 'var(--bg-alt)',
                  color: voted === 0 ? '#FFF' : 'var(--text)',
                  border: voted === 0 ? '2px solid var(--purple)' : '2px solid var(--border)',
                  borderRadius: '12px',
                  cursor: voted !== undefined ? 'default' : 'pointer',
                  fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                }}
              >
                <span style={{ display: 'block', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{m.a.name}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{m.a.region} · {CAT_SLUG_TO_LABEL[m.a.cat_slug]}</span>
                {voted !== undefined && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ background: voted === 0 ? 'rgba(255,255,255,0.3)' : 'var(--border)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round(counts[0] / total * 100)}%`, background: voted === 0 ? '#FFF' : 'var(--purple)', height: '100%', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>
                      {Math.round(counts[0] / total * 100)}%
                    </span>
                  </div>
                )}
              </button>

              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple)' }}>VS</span>

              <button
                onClick={() => vote(idx, 1)}
                style={{
                  padding: '1.25rem 0.75rem',
                  background: voted === 1 ? 'var(--purple)' : 'var(--bg-alt)',
                  color: voted === 1 ? '#FFF' : 'var(--text)',
                  border: voted === 1 ? '2px solid var(--purple)' : '2px solid var(--border)',
                  borderRadius: '12px',
                  cursor: voted !== undefined ? 'default' : 'pointer',
                  fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                }}
              >
                <span style={{ display: 'block', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{m.b.name}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{m.b.region} · {CAT_SLUG_TO_LABEL[m.b.cat_slug]}</span>
                {voted !== undefined && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ background: voted === 1 ? 'rgba(255,255,255,0.3)' : 'var(--border)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round(counts[1] / total * 100)}%`, background: voted === 1 ? '#FFF' : 'var(--purple)', height: '100%', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>
                      {Math.round(counts[1] / total * 100)}%
                    </span>
                  </div>
                )}
              </button>
            </div>
            {voted !== undefined && (
              <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                투표 완료. 총 {total}명 참여.
              </p>
            )}
          </div>
        );
      })}

      {/* 지난주 결과 */}
      <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>지난주 결과</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {lastWeekResults.map((r, i) => (
            <div key={i} style={{
              padding: '1.25rem', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--purple)', fontWeight: 600 }}>{r.matchup}</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem' }}>{r.winner}</p>
              </div>
              <span style={{
                background: 'rgba(212,175,55,0.08)', color: 'var(--purple)',
                padding: '0.25rem 0.75rem', borderRadius: '20px',
                fontSize: '0.85rem', fontWeight: 700,
              }}>
                {r.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 명예의 전당 */}
      <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>명예의 전당</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          역대 VS 대결에서 승리한 업소들의 기록이다.
        </p>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {hallOfFame.map((h, i) => (
            <div key={i} style={{
              padding: '1.25rem', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.week}</span>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--purple)' }}>{h.winner}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> vs {h.loser}</span>
                  </p>
                </div>
                <span style={{
                  background: 'linear-gradient(135deg, #FFFFFF, #F9FAFB)',
                  color: 'var(--purple)', padding: '0.25rem 0.75rem',
                  borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {h.votes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
