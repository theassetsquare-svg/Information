'use client';

import { useState, useEffect, useRef } from 'react';

/* ═══ 틱톡식 무한 피드 ═══ */
export function InfiniteFeed({ venues }: { venues: any[] }) {
  const [count, setCount] = useState(3);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && count < venues.length) {
        setTimeout(() => setCount(c => Math.min(c + 3, venues.length)), 300);
      }
    }, { threshold: 0.1 });
    if (loader.current) obs.observe(loader.current);
    return () => obs.disconnect();
  }, [count, venues.length]);

  return (
    <div>
      {venues.slice(0, count).map((v) => (
        <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: '1rem', marginBottom: '0.75rem', background: '#FFF',
            border: '1px solid #E5E7EB', borderRadius: '12px', textDecoration: 'none', color: 'inherit',
            transition: 'transform 0.2s', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 700, textTransform: 'uppercase' }}>{v.cat_slug}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0', color: '#111' }}>{v.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>{v.card_hook}</p>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#8B5CF6' }}>→</span>
          </div>
        </a>
      ))}
      {count < venues.length && (
        <div ref={loader} style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #E5E7EB', borderTop: '3px solid #8B5CF6',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style dangerouslySetInnerHTML={{ __html: '@keyframes spin{to{transform:rotate(360deg)}}' }} />
        </div>
      )}
      {count >= venues.length && (
        <p style={{ textAlign: 'center', color: '#555', padding: '1rem', fontSize: '0.85rem' }}>
          전체 {venues.length}곳을 모두 확인했습니다
        </p>
      )}
    </div>
  );
}

/* ═══ 슬롯머신 ═══ */
export function SlotMachine({ venues }: { venues: any[] }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [streak, setStreak] = useState(0);

  const spin = () => {
    setSpinning(true); setResult(null);
    setTimeout(() => {
      setResult(venues[Math.floor(Math.random() * venues.length)]);
      setSpinning(false); setStreak(s => s + 1);
    }, 1000 + Math.random() * 1500);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>오늘의 행운</h3>
      <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
        당겨서 운명의 장소를 확인하세요 {streak > 0 && `· ${streak}연속 도전 중`}
      </p>
      <button onClick={spin} disabled={spinning} style={{
        background: spinning ? '#E5E7EB' : 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
        color: '#FFF', border: 'none', borderRadius: '50px', padding: '0.75rem 2rem',
        fontSize: '1rem', fontWeight: 700, cursor: spinning ? 'wait' : 'pointer',
        boxShadow: spinning ? 'none' : '0 4px 16px rgba(139,92,246,0.3)',
        transition: 'all 0.3s', fontFamily: 'var(--font-sans)',
        animation: spinning ? 'pulse2 0.4s infinite' : 'none',
      }}>
        {spinning ? '돌리는 중...' : '레버 당기기'}
      </button>
      {result && (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s' }}>
          <div style={{ padding: '1.5rem', background: '#F5F3FF', borderRadius: '16px', border: '2px solid #DDD6FE', maxWidth: '360px', margin: '0 auto' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{result.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>{result.card_hook}</p>
            <a href={`/${result.cat_slug}/${result.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#8B5CF6', color: '#FFF', padding: '0.5rem 1.5rem',
                borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              자세히 보기 →
            </a>
          </div>
          {streak >= 3 && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#8B5CF6', fontWeight: 600 }}>{streak}연속! 오늘 운이 좋네요</p>}
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse2{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
      `}} />
    </div>
  );
}

/* ═══ 넷플릭스식 자동 다음 추천 ═══ */
export function AutoNext({ venues, current }: { venues: any[]; current?: string }) {
  const [countdown, setCountdown] = useState(10);
  const others = venues.filter(v => v.slug !== current);
  const next = others[Math.floor(Math.random() * others.length)];

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (!next) return null;

  return (
    <div style={{ padding: '1.5rem', background: '#111', borderRadius: '16px', color: '#FFF', textAlign: 'center' }}>
      <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>다음 추천이 {countdown > 0 ? `${countdown}초 후` : '준비되었습니다'}</p>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#FFF' }}>{next.name}</h3>
      <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1rem' }}>{next.card_hook}</p>
      <a href={`/${next.cat_slug}/${next.slug}/`} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', background: '#FFF', color: '#111', padding: '0.6rem 1.5rem',
          borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
        지금 보기 →
      </a>
      <div style={{ marginTop: '0.75rem', height: '3px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${(10 - countdown) * 10}%`, height: '100%', background: '#8B5CF6',
          transition: 'width 1s linear', borderRadius: '2px' }} />
      </div>
    </div>
  );
}

/* ═══ 읽기 진행률 바 ═══ */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.round((window.scrollY / h) * 100) : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 250, height: '3px', background: 'transparent' }}>
      <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
        transition: 'width 0.1s', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
}

/* ═══ 출석 스트릭 ═══ */
export function DailyStreak() {
  const [streak, setStreak] = useState(0);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const last = localStorage.getItem('streak_last');
    const s = parseInt(localStorage.getItem('streak_count') || '0');
    if (last === today) { setStreak(s); setClaimed(true); }
    else { setStreak(last === new Date(Date.now() - 86400000).toDateString() ? s + 1 : 1); }
  }, []);

  const claim = () => {
    localStorage.setItem('streak_last', new Date().toDateString());
    localStorage.setItem('streak_count', String(streak));
    setClaimed(true);
  };

  const dots = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || 7));

  return (
    <div style={{ padding: '1.25rem', background: '#F5F3FF', borderRadius: '16px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
        출석 체크 {streak > 0 && <span style={{ color: '#8B5CF6' }}>· {streak}일째</span>}
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {dots.map((filled, i) => (
          <div key={i} style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: filled ? '#8B5CF6' : '#E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', color: filled ? '#FFF' : '#555', fontWeight: 700,
          }}>{filled ? '✓' : i + 1}</div>
        ))}
      </div>
      {!claimed ? (
        <button onClick={claim} style={{
          background: '#8B5CF6', color: '#FFF', border: 'none', borderRadius: '8px',
          padding: '0.5rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          fontFamily: 'var(--font-sans)',
        }}>오늘 출석 도장 찍기</button>
      ) : (
        <p style={{ fontSize: '0.85rem', color: '#8B5CF6', fontWeight: 600 }}>오늘 출석 완료!</p>
      )}
      {streak >= 7 && <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>7일 연속 달성! 전설의 야행러</p>}
    </div>
  );
}

/* ═══ 끝없는 추천 ═══ */
export function EndlessRecommend({ venues }: { venues: any[] }) {
  const [idx, setIdx] = useState(0);
  const shuffled = [...venues].sort(() => Math.random() - 0.5);
  const show = shuffled.slice(idx, idx + 2);

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>이것도 봤나요?</h3>
      {show.map(v => (
        <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: '#FFF',
            border: '1px solid #E5E7EB', borderRadius: '10px', textDecoration: 'none', color: 'inherit' }}>
          <strong style={{ color: '#111' }}>{v.name}</strong>
          <span style={{ fontSize: '0.8rem', color: '#555', marginLeft: '0.5rem' }}>{v.card_hook}</span>
        </a>
      ))}
      <button onClick={() => setIdx(i => (i + 2) % venues.length)} style={{
        display: 'block', width: '100%', padding: '0.6rem', background: '#F5F5F5',
        border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.85rem', fontWeight: 600, color: '#8B5CF6', fontFamily: 'var(--font-sans)', marginTop: '0.5rem',
      }}>
        다른 곳 보기 →
      </button>
    </div>
  );
}
