'use client';

import { useState } from 'react';

interface Venue {
  name: string;
  slug: string;
  cat_slug: string;
  region: string;
  card_hook: string;
}

const catLabels: Record<string, string> = {
  club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠',
};

export default function Roulette({ venues }: { venues: Venue[] }) {
  const [result, setResult] = useState<Venue | null>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      const random = venues[Math.floor(Math.random() * venues.length)];
      setResult(random);
      setSpinning(false);
    }, 1500);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#D4AF37' }}>오늘 갈 곳 룰렛</h2>
      <p style={{ color: '#A89B80', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        어디 갈지 고민된다면 돌려보자. 운명이 정해준다.
      </p>

      <button
        onClick={spin}
        disabled={spinning}
        style={{
          background: spinning ? '#333' : 'linear-gradient(135deg, #D4AF37, #B8941F)',
          color: spinning ? '#A89B80' : '#0A0A0A', border: 'none', borderRadius: '50%',
          width: '140px', height: '140px', fontSize: '1.1rem', fontWeight: 700,
          cursor: spinning ? 'wait' : 'pointer', fontFamily: 'var(--font-serif)',
          transition: 'all 0.3s',
          boxShadow: spinning ? 'none' : '0 4px 20px rgba(212, 175, 55, 0.3)',
          animation: spinning ? 'pulse 0.5s infinite' : 'none',
        }}
      >
        {spinning ? '돌리는 중...' : '돌려보기'}
      </button>

      {result && (
        <div style={{
          marginTop: '1.5rem', padding: '1.5rem', background: '#1A1A1A',
          border: '2px solid #D4AF37', borderRadius: '16px',
          maxWidth: '400px', margin: '1.5rem auto 0',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {catLabels[result.cat_slug] || result.cat_slug}
          </span>
          <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem', color: '#D4AF37' }}>{result.name}</h3>
          <p style={{ color: '#A89B80', fontSize: '0.9rem', marginBottom: '1rem' }}>{result.card_hook}</p>
          <a
            href={`/${result.cat_slug}/${result.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', background: '#D4AF37', color: '#0A0A0A',
              padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600,
              textDecoration: 'none', fontSize: '0.9rem',
            }}
          >
            상세 보기 →
          </a>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}} />
    </div>
  );
}
