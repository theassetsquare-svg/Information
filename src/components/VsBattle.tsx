'use client';

import { useState, useMemo } from 'react';

interface Venue { name: string; slug: string; cat_slug: string; region: string; card_hook: string; }

export default function VsBattle({ venues }: { venues: Venue[] }) {
  const pair = useMemo(() => {
    const day = new Date().getDay();
    const a = venues[day % venues.length];
    const b = venues[(day * 7 + 13) % venues.length];
    return a.slug === b.slug ? [venues[0], venues[1]] : [a, b];
  }, [venues]);

  const [voted, setVoted] = useState<number | null>(null);
  const [counts, setCounts] = useState([47, 53]);
  const vote = (idx: number) => { if (voted !== null) return; setVoted(idx); setCounts(prev => prev.map((c, i) => i === idx ? c + 1 : c)); };
  const total = counts[0] + counts[1];

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>이번주 VS 대결</h2>
      <p style={{ color: '#666666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>어디가 더 나을까? 투표하고 결과를 확인하자.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', maxWidth: '480px', margin: '0 auto' }}>
        {pair.map((v, i) => (
          <button key={v.slug} onClick={() => vote(i)} style={{
            padding: '1.5rem 1rem', background: voted === i ? '#8B5CF6' : '#FFFFFF',
            color: voted === i ? '#FFFFFF' : '#111111',
            border: voted === i ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
            borderRadius: '16px', cursor: voted !== null ? 'default' : 'pointer',
            fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
          }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{v.name}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{v.region}</span>
            {voted !== null && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ background: voted === i ? 'rgba(255,255,255,0.3)' : '#E5E7EB', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round(counts[i] / total * 100)}%`, background: voted === i ? '#111111' : '#8B5CF6', height: '100%', borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>{Math.round(counts[i] / total * 100)}%</span>
              </div>
            )}
          </button>
        ))}
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8B5CF6', gridColumn: '2', gridRow: '1' }}>VS</span>
      </div>
      {voted !== null && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666666' }}>투표 완료. 총 {total}명 참여.</p>}
    </div>
  );
}
