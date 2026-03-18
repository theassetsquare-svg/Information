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
          style={{ display: 'block', padding: '1rem', marginBottom: '0.75rem', background: '#1A1A1A',
            border: '1px solid #333', borderRadius: '12px', textDecoration: 'none', color: 'inherit',
            transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#333'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>{v.cat_slug}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0', color: '#F0E6D3' }}>{v.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#A89B80' }}>{v.card_hook}</p>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#D4AF37' }}>→</span>
          </div>
        </a>
      ))}
      {count < venues.length && (
        <div ref={loader} style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #333', borderTop: '3px solid #D4AF37',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style dangerouslySetInnerHTML={{ __html: '@keyframes spin{to{transform:rotate(360deg)}}' }} />
        </div>
      )}
      {count >= venues.length && (
        <p style={{ textAlign: 'center', color: '#A89B80', padding: '1rem', fontSize: '0.85rem' }}>
          전체 {venues.length}곳을 모두 확인했습니다
        </p>
      )}
    </div>
  );
}

/* ═══ 슬롯머신식 변동 보상 ═══ */
export function SlotMachine({ venues }: { venues: any[] }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [streak, setStreak] = useState(0);

  const spin = () => {
    setSpinning(true);
    setResult(null);
    const duration = 1000 + Math.random() * 1500;
    setTimeout(() => {
      const r = venues[Math.floor(Math.random() * venues.length)];
      setResult(r);
      setSpinning(false);
      setStreak(s => s + 1);
    }, duration);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <h3 style={{ marginBottom: '0.5rem', color: '#D4AF37' }}>오늘의 행운 업소</h3>
      <p style={{ fontSize: '0.85rem', color: '#A89B80', marginBottom: '1rem' }}>
        당겨서 운명의 장소를 확인하세요 {streak > 0 && `· ${streak}연속 도전 중`}
      </p>

      <button onClick={spin} disabled={spinning} style={{
        background: spinning ? '#333' : 'linear-gradient(135deg, #D4AF37, #B8941F)',
        color: spinning ? '#A89B80' : '#0A0A0A', border: 'none', borderRadius: '50px', padding: '0.75rem 2rem',
        fontSize: '1rem', fontWeight: 700, cursor: spinning ? 'wait' : 'pointer',
        boxShadow: spinning ? 'none' : '0 4px 16px rgba(212,175,55,0.3)',
        transition: 'all 0.3s', fontFamily: 'var(--font-serif)',
        animation: spinning ? 'pulse2 0.4s infinite' : 'none',
      }}>
        {spinning ? '돌리는 중...' : '레버 당기기'}
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s' }}>
          <div style={{ padding: '1.5rem', background: '#1A1A1A', borderRadius: '16px', border: '2px solid #D4AF37', maxWidth: '360px', margin: '0 auto' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#D4AF37' }}>{result.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#D4C5A9', marginBottom: '1rem' }}>{result.card_hook}</p>
            <a href={`/${result.cat_slug}/${result.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#D4AF37', color: '#0A0A0A', padding: '0.5rem 1.5rem',
                borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              자세히 보기 →
            </a>
          </div>
          {streak >= 3 && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>
              {streak}연속! 오늘 운이 좋네요
            </p>
          )}
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
    <div style={{ padding: '1.5rem', background: '#1A1A1A', borderRadius: '16px', border: '1px solid #333', color: '#F0E6D3', textAlign: 'center' }}>
      <p style={{ fontSize: '0.8rem', color: '#A89B80', marginBottom: '0.5rem' }}>다음 추천이 {countdown > 0 ? `${countdown}초 후` : '준비되었습니다'}</p>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#D4AF37' }}>{next.name}</h3>
      <p style={{ fontSize: '0.85rem', color: '#D4C5A9', marginBottom: '1rem' }}>{next.card_hook}</p>
      <a href={`/${next.cat_slug}/${next.slug}/`} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', background: '#D4AF37', color: '#0A0A0A', padding: '0.6rem 1.5rem',
          borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
        지금 보기 →
      </a>
      <div style={{ marginTop: '0.75rem', height: '3px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${(10 - countdown) * 10}%`, height: '100%', background: '#D4AF37',
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
      <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F7E7CE)',
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
    if (last === today) {
      setStreak(s);
      setClaimed(true);
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = last === yesterday ? s + 1 : 1;
      setStreak(newStreak);
    }
  }, []);

  const claim = () => {
    const today = new Date().toDateString();
    localStorage.setItem('streak_last', today);
    localStorage.setItem('streak_count', String(streak));
    setClaimed(true);
  };

  const dots = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || 7));

  return (
    <div style={{ padding: '1.25rem', background: '#1A1A1A', border: '1px solid #333', borderRadius: '16px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#D4AF37' }}>
        출석 체크 {streak > 0 && <span style={{ color: '#F7E7CE' }}>· {streak}일째</span>}
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {dots.map((filled, i) => (
          <div key={i} style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: filled ? '#D4AF37' : '#333',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', color: filled ? '#0A0A0A' : '#A89B80', fontWeight: 700,
          }}>{filled ? '✓' : i + 1}</div>
        ))}
      </div>
      {!claimed ? (
        <button onClick={claim} style={{
          background: '#D4AF37', color: '#0A0A0A', border: 'none', borderRadius: '8px',
          padding: '0.5rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          fontFamily: 'var(--font-serif)',
        }}>
          오늘 출석 도장 찍기
        </button>
      ) : (
        <p style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>오늘 출석 완료!</p>
      )}
      {streak >= 7 && <p style={{ fontSize: '0.8rem', color: '#D4C5A9', marginTop: '0.5rem' }}>7일 연속 달성! 전설의 야행러</p>}
    </div>
  );
}

/* ═══ FOMO 실시간 카운터 ═══ */
export function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Math.floor(80 + Math.random() * 120));
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'blink 1.5s infinite' }} />
      지금 {count}명이 보고 있어요
      <style dangerouslySetInnerHTML={{ __html: '@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}' }} />
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
      <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: '#D4AF37' }}>이것도 봤나요?</h3>
      {show.map(v => (
        <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: '#1A1A1A',
            border: '1px solid #333', borderRadius: '10px', textDecoration: 'none', color: 'inherit' }}>
          <strong style={{ color: '#F0E6D3' }}>{v.name}</strong>
          <span style={{ fontSize: '0.8rem', color: '#A89B80', marginLeft: '0.5rem' }}>{v.card_hook}</span>
        </a>
      ))}
      <button onClick={() => setIdx(i => (i + 2) % venues.length)} style={{
        display: 'block', width: '100%', padding: '0.6rem', background: '#111',
        border: '1px solid #333', borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.85rem', fontWeight: 600, color: '#D4AF37', fontFamily: 'var(--font-serif)', marginTop: '0.5rem',
      }}>
        다른 곳 보기 →
      </button>
    </div>
  );
}
