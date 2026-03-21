'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════
   틱톡/넷플릭스/슬롯머신 95분 체류 심리학
   ═══════════════════════════════════════════ */

/* ═══ [1] 틱톡식 무한 피드 — 끊을 수 없는 스크롤 ═══ */
export function InfiniteFeed({ venues }: { venues: any[] }) {
  const [count, setCount] = useState(3);
  const [explored, setExplored] = useState(3);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && count < venues.length) {
        setTimeout(() => {
          setCount(c => Math.min(c + 3, venues.length));
          setExplored(e => Math.min(e + 3, venues.length));
        }, 300);
      }
    }, { threshold: 0.1 });
    if (loader.current) obs.observe(loader.current);
    return () => obs.disconnect();
  }, [count, venues.length]);

  return (
    <div>
      {/* 자이가르닉 효과: 진행률 표시 → "조금만 더 보면 전부 본다" */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem',
        background: '#1A1714', borderRadius: '12px', border: '1px solid #D4AF37' }}>
        <div style={{ flex: 1, background: '#3D3425', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.round(explored / venues.length * 100)}%`, height: '100%',
            background: 'linear-gradient(90deg, #D4AF37, #D4AF37)', borderRadius: '4px', transition: 'width 0.5s' }} />
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', whiteSpace: 'nowrap' }}>
          {explored}/{venues.length} 탐색
        </span>
      </div>

      {venues.slice(0, count).map((v) => (
        <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: '1rem', marginBottom: '0.75rem', background: '#1A1714',
            border: '1px solid #3D3425', borderRadius: '12px', textDecoration: 'none', color: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>{v.cat_slug}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0', color: '#F7E7CE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#B8A080', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as any }}>{v.card_hook}</p>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#D4AF37', marginLeft: '0.5rem' }}>→</span>
          </div>
        </a>
      ))}
      {count < venues.length && (
        <div ref={loader} style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #3D3425', borderTop: '3px solid #D4AF37',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
            다음 발견까지 잠시만...
          </p>
          <style dangerouslySetInnerHTML={{ __html: '@keyframes spin{to{transform:rotate(360deg)}}' }} />
        </div>
      )}
      {count >= venues.length && (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#1A1714', borderRadius: '12px', marginTop: '0.5rem' }}>
          <p style={{ fontWeight: 700, color: '#D4AF37', marginBottom: '0.5rem' }}>전체 {venues.length}곳 탐색 완료!</p>
          <p style={{ fontSize: '0.85rem', color: '#B8A080' }}>처음부터 다시 둘러보시겠어요?</p>
          <button onClick={() => { setCount(3); setExplored(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ marginTop: '0.75rem', background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '8px',
              padding: '0.6rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}>
            처음부터 다시 →
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══ [2] 슬롯머신 — 가변보상 (Variable Reward) ═══ */
export function SlotMachine({ venues }: { venues: any[] }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const spin = () => {
    setSpinning(true); setResult(null);
    // 가변 지연: 기대감 극대화 (1~2.5초)
    const duration = 1000 + Math.random() * 1500;
    setTimeout(() => {
      const available = venues.filter(v => !history.includes(v.slug));
      const pool = available.length > 0 ? available : venues;
      const r = pool[Math.floor(Math.random() * pool.length)];
      setResult(r);
      setSpinning(false);
      setStreak(s => s + 1);
      setHistory(h => [...h.slice(-5), r.slug]);
    }, duration);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <h3 style={{ marginBottom: '0.25rem' }}>오늘의 행운</h3>
      <p style={{ fontSize: '0.85rem', color: '#B8A080', marginBottom: '1rem' }}>
        당겨서 운명의 장소를 만나보세요
        {streak > 0 && <span style={{ color: '#D4AF37', fontWeight: 700 }}> · {streak}연속 도전</span>}
      </p>

      <button onClick={spin} disabled={spinning} style={{
        background: spinning ? '#3D3425' : 'linear-gradient(135deg, #D4AF37, #D4AF37)',
        color: spinning ? '#B8A080' : '#0D0D0D', border: 'none', borderRadius: '50px', padding: '0.75rem 2rem',
        fontSize: '1rem', fontWeight: 700, cursor: spinning ? 'wait' : 'pointer',
        boxShadow: spinning ? 'none' : '0 4px 16px rgba(212,175,55,0.3)',
        transition: 'all 0.3s', fontFamily: 'var(--font-sans)',
        animation: spinning ? 'pulse2 0.4s infinite' : 'none',
        minHeight: '48px',
      }}>
        {spinning ? '두근두근...' : streak === 0 ? '레버 당기기' : '한 번 더!'}
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s' }}>
          <div style={{ padding: '1.5rem', background: '#1A1714', borderRadius: '16px', border: '2px solid #D4AF37', maxWidth: '360px', margin: '0 auto' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#F7E7CE' }}>{result.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#B8A080', marginBottom: '1rem' }}>{result.card_hook}</p>
            <a href={`/${result.cat_slug}/${result.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#D4AF37', color: '#0D0D0D', padding: '0.5rem 1.5rem',
                borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              자세히 보기 →
            </a>
          </div>
          {streak >= 3 && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>
              {streak}연속! 운이 폭발하고 있어요
            </p>
          )}
          {streak >= 5 && (
            <p style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, marginTop: '0.25rem' }}>
              전설의 도전자 등극! 계속 돌려보세요
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

/* ═══ [3] 넷플릭스식 자동 다음 — 오토플레이 ═══ */
export function AutoNext({ venues, current }: { venues: any[]; current?: string }) {
  const [countdown, setCountdown] = useState(8);
  const others = venues.filter(v => v.slug !== current);
  const next = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : null;

  useEffect(() => {
    if (countdown <= 0 || !next) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, next]);

  if (!next) return null;

  return (
    <div style={{ padding: '1.5rem', background: '#111', borderRadius: '16px', color: '#FFF', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        다음 추천
      </p>
      <p style={{ fontSize: '0.85rem', color: '#CCC', marginBottom: '0.75rem' }}>
        {countdown > 0 ? `${countdown}초 후 자동 이동` : '준비 완료'}
      </p>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#FFF' }}>{next.name}</h3>
      <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1rem' }}>{next.card_hook}</p>
      <a href={`/${next.cat_slug}/${next.slug}/`} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', background: '#D4AF37', color: '#0D0D0D', padding: '0.6rem 1.5rem',
          borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
        지금 보기 →
      </a>
      {/* 넷플릭스 스타일 진행 바 */}
      <div style={{ marginTop: '0.75rem', height: '3px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${(8 - countdown) / 8 * 100}%`, height: '100%', background: '#D4AF37',
          transition: 'width 1s linear', borderRadius: '2px' }} />
      </div>
    </div>
  );
}

/* ═══ [4] 읽기 진행률 — 완료 욕구 자극 ═══ */
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
      <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #D4AF37)',
        transition: 'width 0.1s', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
}

/* ═══ [5] 출석 스트릭 — 습관 형성 + 도파민 루프 ═══ */
export function DailyStreak() {
  const [streak, setStreak] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [showReward, setShowReward] = useState(false);

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
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
  };

  const dots = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || 7));
  const rewards = [
    { day: 3, text: '3일 연속! 밤의 탐험가' },
    { day: 7, text: '7일 연속! 전설의 야행러' },
    { day: 14, text: '14일 연속! 밤의 마스터' },
    { day: 30, text: '30일 연속! 밤문화 레전드' },
  ];
  const currentReward = rewards.filter(r => streak >= r.day).pop();

  return (
    <div style={{ padding: '1.5rem', background: '#1A1714', borderRadius: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* 보상 애니메이션 */}
      {showReward && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(212,175,55,0.95)', zIndex: 10, borderRadius: '16px', animation: 'fadeIn 0.3s' }}>
          <div>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+10P</p>
            <p style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '1.1rem' }}>출석 완료!</p>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#F7E7CE' }}>
        출석 체크 {streak > 0 && <span style={{ color: '#D4AF37' }}>· {streak}일째</span>}
      </h3>

      {/* 7일 진행 표시 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {dots.map((filled, i) => (
          <div key={i} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: filled ? '#D4AF37' : '#3D3425',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', color: filled ? '#0D0D0D' : '#B8A080', fontWeight: 700,
            transition: 'all 0.3s', transform: filled ? 'scale(1.1)' : 'scale(1)',
          }}>{filled ? '✓' : i + 1}</div>
        ))}
      </div>

      {!claimed ? (
        <button onClick={claim} style={{
          background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '8px',
          padding: '0.6rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
          fontFamily: 'var(--font-sans)', minHeight: '44px',
          boxShadow: '0 2px 8px rgba(212,175,55,0.3)',
        }}>
          오늘 도장 찍기 (+10P)
        </button>
      ) : (
        <p style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>오늘 출석 완료!</p>
      )}

      {currentReward && (
        <p style={{ fontSize: '0.8rem', color: '#B8A080', marginTop: '0.75rem', fontWeight: 600 }}>
          {currentReward.text}
        </p>
      )}

      {/* 다음 보상까지 안내 → 자이가르닉 */}
      {streak < 30 && (
        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
          {(() => {
            const next = rewards.find(r => streak < r.day);
            return next ? `${next.day - streak}일 더 오면 "${next.text.split('! ')[1]}" 달성` : '';
          })()}
        </p>
      )}
    </div>
  );
}

/* ═══ [6] 끝없는 추천 — "이것도 봤나요?" 도파민 루프 ═══ */
export function EndlessRecommend({ venues }: { venues: any[] }) {
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState(0);
  const shuffled = useRef([...venues].sort(() => Math.random() - 0.5));
  const show = shuffled.current.slice(idx % venues.length, (idx % venues.length) + 2);

  const next = () => {
    setIdx(i => i + 2);
    setSeen(s => s + 2);
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>이것도 봤나요?</h3>
        <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600 }}>{seen}곳 발견</span>
      </div>
      {show.map(v => (
        <a key={v.slug + idx} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: '#1A1714',
            border: '1px solid #3D3425', borderRadius: '10px', textDecoration: 'none', color: 'inherit',
            transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4AF37')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#3D3425')}>
          <strong style={{ color: '#F7E7CE' }}>{v.name}</strong>
          <span style={{ fontSize: '0.8rem', color: '#B8A080', marginLeft: '0.5rem' }}>{v.card_hook}</span>
        </a>
      ))}
      <button onClick={next} style={{
        display: 'block', width: '100%', padding: '0.7rem', background: '#161310',
        border: '1px solid #3D3425', borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.85rem', fontWeight: 600, color: '#D4AF37', fontFamily: 'var(--font-sans)',
        marginTop: '0.5rem', minHeight: '44px', transition: 'background 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#241F1A')}
        onMouseLeave={e => (e.currentTarget.style.background = '#161310')}>
        다른 곳 발견하기 →
      </button>
    </div>
  );
}

/* ═══ [7] 감정 여정 타이머 — 체류시간 시각화 ═══ */
export function JourneyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [milestone, setMilestone] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 60) setMilestone('1분 체류! 좋은 시작이에요');
    else if (seconds === 180) setMilestone('3분! 점점 빠져들고 있군요');
    else if (seconds === 300) setMilestone('5분! 진정한 탐험가');
    else if (seconds === 600) setMilestone('10분! 밤의 마스터 등극');
    else if (seconds === 900) setMilestone('15분! 전설이 되어가고 있어요');
  }, [seconds]);

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  if (seconds < 30) return null; // 30초 후부터 표시

  return (
    <div style={{ position: 'fixed', top: '48px', right: '8px', zIndex: 90,
      background: 'rgba(26,23,20,0.95)', border: '1px solid #3D3425', borderRadius: '20px',
      padding: '0.35rem 0.75rem', fontSize: '0.7rem', color: '#D4AF37', fontWeight: 600,
      backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {min}:{sec.toString().padStart(2, '0')}
      {milestone && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px',
          background: '#D4AF37', color: '#0D0D0D', padding: '0.4rem 0.75rem', borderRadius: '8px',
          fontSize: '0.7rem', whiteSpace: 'nowrap', animation: 'fadeIn 0.5s',
          boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>
          {milestone}
        </div>
      )}
    </div>
  );
}

/* ═══ [8] FOMO 카운터 — "지금 N명이 보고 있습니다" ═══ */
export function FOMOCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // 시간대별 시뮬레이션 (실제 데이터 없으므로)
    const hour = new Date().getHours();
    const base = hour >= 20 || hour < 4 ? 180 + Math.floor(Math.random() * 150) : 40 + Math.floor(Math.random() * 80);
    setCount(base);
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 7) - 3); // ±3 변동
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (count <= 0) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem',
      background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '20px', fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626', animation: 'blink 1.5s infinite' }} />
      지금 {count}명 탐색 중
      <style dangerouslySetInnerHTML={{ __html: '@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}' }} />
    </div>
  );
}

/* ═══ [9] 블러 잠금 — 콘텐츠 끊기 → "더 보기" 클릭 유도 ═══ */
export function BlurReveal({ children, label = '전체 내용 보기' }: { children: React.ReactNode; label?: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ maxHeight: revealed ? 'none' : '200px', overflow: 'hidden', transition: 'max-height 0.5s' }}>
        {children}
      </div>
      {!revealed && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(transparent, #1A1714)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '1rem' }}>
          <button onClick={() => setRevealed(true)} style={{
            background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '8px',
            padding: '0.6rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', minHeight: '44px',
          }}>
            {label} ↓
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══ [10] 탐험 진행도 — 전체 카테고리 탐색 % ═══ */
export function ExploreProgress() {
  const [data, setData] = useState({ total: 110, visited: 0, categories: 0 });
  useEffect(() => {
    const stored = localStorage.getItem('recent_venues');
    if (stored) {
      const slugs: string[] = JSON.parse(stored);
      setData({ total: 110, visited: slugs.length, categories: new Set(slugs.map(s => s.split('-')[0])).size });
    }
  }, []);

  if (data.visited === 0) return null;
  const pct = Math.round(data.visited / data.total * 100);

  return (
    <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #1A1714, #241F1A)', borderRadius: '16px', border: '1px solid #D4AF37' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#F7E7CE' }}>나의 탐험 지도</h3>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37' }}>{pct}% 달성</span>
      </div>
      <div style={{ height: '8px', background: '#3D3425', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #D4AF37)',
          borderRadius: '4px', transition: 'width 1s ease-out' }} />
      </div>
      <p style={{ fontSize: '0.8rem', color: '#B8A080' }}>
        {data.total}곳 중 {data.visited}곳 방문 · {6 - data.categories}개 카테고리 미탐험
      </p>
      {pct < 50 && <p style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600, marginTop: '0.25rem' }}>50% 달성하면 밤의 탐험가 뱃지!</p>}
      {pct >= 50 && pct < 100 && <p style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600, marginTop: '0.25rem' }}>거의 다 왔어요! 전체 탐험 완료까지 {data.total - data.visited}곳</p>}
    </div>
  );
}

/* ═══ [11] 소셜 증거 토스트 — "방금 OO님이..." ═══ */
export function SocialProofToast() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const names = ['김**','이**','박**','최**','정**','강**','조**','윤**','장**','한**'];
  const actions = [
    (n: string) => `${n}님이 강남청담클럽 레이스 페이지를 봤습니다`,
    (n: string) => `${n}님이 수원찬스돔나이트에 전화했습니다`,
    (n: string) => `${n}님이 일산룸 상세를 확인했습니다`,
    (n: string) => `${n}님이 부산연산동물나이트를 저장했습니다`,
    (n: string) => `${n}님이 호빠 카테고리를 탐색 중입니다`,
  ];

  useEffect(() => {
    const showToast = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      setMsg(action(name));
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    };
    // 첫 표시: 45초 후, 이후 60~120초 랜덤
    const first = setTimeout(showToast, 45000);
    const interval = setInterval(showToast, 60000 + Math.random() * 60000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      maxWidth: '360px', width: 'calc(100% - 2rem)', zIndex: 80,
      background: '#1A1714', border: '1px solid #3D3425', borderRadius: '12px',
      padding: '0.75rem 1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      animation: 'slideUp2 0.4s ease-out', fontSize: '0.8rem', color: '#E8D5B5',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
        {msg}
      </div>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes slideUp2{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}' }} />
    </div>
  );
}

/* ═══ [12] 개인화 추천 — 최근 본 기반 ═══ */
export function PersonalizedFeed({ venues }: { venues: any[] }) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent_venues');
    if (stored) setRecentSlugs(JSON.parse(stored));
  }, []);

  if (recentSlugs.length === 0) return null;

  const recentVenues = recentSlugs
    .map(slug => venues.find(v => v.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  if (recentVenues.length === 0) return null;

  // 같은 카테고리에서 추천
  const cats = [...new Set(recentVenues.map(v => v.cat_slug))];
  const recommended = venues
    .filter(v => cats.includes(v.cat_slug) && !recentSlugs.includes(v.slug))
    .slice(0, 3);

  return (
    <div style={{ padding: '1.5rem', background: '#1A1714', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#F7E7CE' }}>당신을 위한 추천</h3>
      <p style={{ fontSize: '0.8rem', color: '#B8A080', marginBottom: '1rem' }}>최근 관심사 기반</p>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {recommended.map(v => (
          <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', padding: '0.75rem 1rem', background: '#1A1714', border: '1px solid #D4AF37',
              borderRadius: '10px', textDecoration: 'none', color: '#F7E7CE' }}>
            <strong>{v.name}</strong>
            <span style={{ fontSize: '0.8rem', color: '#B8A080', marginLeft: '0.5rem' }}>{v.card_hook}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   95분 체류 — 틱톡/넷플릭스/슬롯머신 심리학 추가 7가지
   ═══════════════════════════════════════════════════════════ */

/* ═══ [13] 틱톡 "스와이프 피드" — 한 번에 1업소, 풀스크린 카드 ═══ */
export function SwipeFeed({ venues }: { venues: any[] }) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<'up'|'down'|null>(null);
  const shuffled = useRef([...venues].sort(() => Math.random() - 0.5));
  const v = shuffled.current[idx % shuffled.current.length];
  const catColors: Record<string, string> = { club: '#B8942B', night: '#D4AF37', lounge: '#D4AF37', room: '#1E3A5F', yojeong: '#059669', hoppa: '#DC2626' };

  const goNext = () => { setDirection('up'); setTimeout(() => { setIdx(i => i + 1); setDirection(null); }, 200); };
  const goPrev = () => { if (idx > 0) { setDirection('down'); setTimeout(() => { setIdx(i => i - 1); setDirection(null); }, 200); } };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', border: '1px solid #3D3425' }}>
      <div style={{
        background: `linear-gradient(135deg, ${catColors[v.cat_slug] || '#D4AF37'}22, ${catColors[v.cat_slug] || '#D4AF37'}08)`,
        padding: '2rem 1.5rem', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        transition: 'transform 0.2s, opacity 0.2s',
        transform: direction === 'up' ? 'translateY(-20px)' : direction === 'down' ? 'translateY(20px)' : 'none',
        opacity: direction ? 0.5 : 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ background: catColors[v.cat_slug] || '#D4AF37', color: '#0D0D0D', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>
            {v.category}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#B8A080' }}>{v.region}</span>
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', lineHeight: 1.3, color: '#F7E7CE' }}>{v.name}</h3>
        {v.nickname && <p style={{ color: '#D4AF37', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>담당: {v.nickname}</p>}
        <p style={{ color: '#E8D5B5', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{v.card_hook}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, textAlign: 'center', background: catColors[v.cat_slug] || '#D4AF37', color: '#0D0D0D', padding: '0.75rem', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            자세히 보기
          </a>
          <button onClick={goNext} style={{ flex: 1, background: '#161310', border: '1px solid #3D3425', borderRadius: '12px', padding: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', minHeight: '48px', color: '#E8D5B5' }}>
            다음 추천 →
          </button>
        </div>
      </div>
      {/* 진행 인디케이터 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', padding: '0.75rem', background: '#161310' }}>
        {Array.from({ length: Math.min(10, shuffled.current.length) }, (_, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === (idx % 10) ? '#D4AF37' : '#3D3425', transition: 'background 0.3s' }} />
        ))}
        <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '0.5rem' }}>{idx + 1}/{shuffled.current.length}</span>
      </div>
    </div>
  );
}

/* ═══ [14] 넷플릭스 "다음 에피소드" 자동재생 체인 — 끊을 수 없는 연쇄 ═══ */
export function BingeChain({ venues }: { venues: any[] }) {
  const [chain, setChain] = useState<any[]>([]);
  const [watching, setWatching] = useState(false);
  const [current, setCurrent] = useState(0);
  const [countdown, setCountdown] = useState(5);

  const startBinge = () => {
    const shuffled = [...venues].sort(() => Math.random() - 0.5).slice(0, 10);
    setChain(shuffled); setWatching(true); setCurrent(0); setCountdown(5);
  };

  useEffect(() => {
    if (!watching || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [watching, countdown]);

  const nextEp = () => { setCurrent(c => c + 1); setCountdown(5); };

  if (!watching) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1.5rem', background: '#111', borderRadius: '20px', color: '#FFF' }}>
        <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>몰아보기 모드</p>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#FFF' }}>10곳을 한 번에 훑어보기</h3>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.25rem' }}>넷플릭스처럼 다음 업소가 자동으로 넘어갑니다</p>
        <button onClick={startBinge} style={{ background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '12px', padding: '0.875rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font-sans)', minHeight: '48px', boxShadow: '0 4px 16px rgba(212,175,55,0.4)' }}>
          시작하기 ▶
        </button>
      </div>
    );
  }

  if (current >= chain.length) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#111', borderRadius: '20px', color: '#FFF' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</p>
        <h3 style={{ color: '#FFF', marginBottom: '0.75rem' }}>10곳 탐험 완료!</h3>
        <button onClick={startBinge} style={{ background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '12px', padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', minHeight: '48px' }}>
          새 시리즈 시작 →
        </button>
      </div>
    );
  }

  const v = chain[current];
  return (
    <div style={{ background: '#111', borderRadius: '20px', overflow: 'hidden', color: '#FFF' }}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#999' }}>EP.{current + 1} / 10</span>
          <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600 }}>{countdown > 0 ? `${countdown}초 후 다음` : '준비 완료'}</span>
        </div>
        <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '0.5rem' }}>{v.name}</h3>
        <p style={{ fontSize: '0.85rem', color: '#CCC', marginBottom: '1rem' }}>{v.card_hook}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, textAlign: 'center', background: '#D4AF37', color: '#0D0D0D', padding: '0.625rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            상세 보기
          </a>
          <button onClick={nextEp} style={{ flex: 1, background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '8px', padding: '0.625rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)', minHeight: '44px' }}>
            다음 EP →
          </button>
        </div>
      </div>
      {/* 넷플릭스 진행바 */}
      <div style={{ height: '4px', background: '#333' }}>
        <div style={{ width: `${(current + 1) / 10 * 100}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #D4AF37)', transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

/* ═══ [15] 슬롯머신 "잭팟 헌팅" — 레어 업소 찾기 ═══ */
export function JackpotHunt({ venues }: { venues: any[] }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [jackpot, setJackpot] = useState(false);
  const [tries, setTries] = useState(0);

  const spin = () => {
    setSpinning(true); setJackpot(false);
    setTimeout(() => {
      const picks = Array.from({ length: 3 }, () => venues[Math.floor(Math.random() * venues.length)]);
      const isJackpot = picks[0].cat_slug === picks[1].cat_slug && picks[1].cat_slug === picks[2].cat_slug;
      setResult(picks);
      setJackpot(isJackpot);
      setSpinning(false);
      setTries(t => t + 1);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1E1B4B, #312E81)', borderRadius: '20px', textAlign: 'center', color: '#FFF' }}>
      <h3 style={{ color: '#FFF', marginBottom: '0.25rem' }}>잭팟 헌팅</h3>
      <p style={{ fontSize: '0.8rem', color: '#A5B4FC', marginBottom: '1rem' }}>
        3개가 같은 카테고리면 잭팟! {tries > 0 && <span>{tries}번째 도전</span>}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem', minHeight: '80px', alignItems: 'center' }}>
        {spinning ? (
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} style={{ width: '80px', height: '80px', background: '#4338CA', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', animation: `spin ${0.3 + i * 0.1}s linear infinite` }}>?</div>
          ))
        ) : result.length > 0 ? (
          result.map((v, i) => (
            <a key={i} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ width: '80px', padding: '0.5rem', background: jackpot ? '#F59E0B' : '#4338CA', borderRadius: '12px', textDecoration: 'none', color: '#FFF', fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', transition: 'transform 0.3s', animation: jackpot ? 'pulse2 0.5s infinite' : 'fadeIn 0.3s' }}>
              <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>{v.category}</div>
              <div style={{ marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name.split(' ').pop()}</div>
            </a>
          ))
        ) : (
          <p style={{ color: '#A5B4FC', fontSize: '0.9rem' }}>레버를 당겨보세요</p>
        )}
      </div>
      {jackpot && <p style={{ color: '#F59E0B', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', animation: 'pulse2 0.5s infinite' }}>🎰 잭팟! 같은 카테고리 3개!</p>}
      <button onClick={spin} disabled={spinning} style={{
        background: spinning ? '#4338CA' : 'linear-gradient(135deg, #F59E0B, #EF4444)', color: '#FFF', border: 'none', borderRadius: '50px', padding: '0.75rem 2rem', fontWeight: 700, cursor: spinning ? 'wait' : 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', minHeight: '48px',
        boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
      }}>
        {spinning ? '돌아가는 중...' : '레버 당기기 🎰'}
      </button>
    </div>
  );
}

/* ═══ [16] "오늘의 운세" — 매일 다른 결과 → 매일 방문 ═══ */
export function DailyFortune({ venues }: { venues: any[] }) {
  const [revealed, setRevealed] = useState(false);
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const todayVenue = venues[seed % venues.length];

  const fortunes = [
    '오늘 밤 운이 트인다. 첫 번째 자리가 명당.',
    '금요일 에너지가 충전되는 날. 새로운 곳을 시도해볼 것.',
    '오래된 단골보다 새 장소가 길하다.',
    '동행자의 추천을 따르면 좋은 밤이 된다.',
    '오늘은 바 카운터에 앉아라. 의외의 인연.',
    '자정이 지나면 분위기가 바뀐다. 끝까지 버텨라.',
    '이번 주말은 평소와 다른 카테고리를 시도할 때.',
    '예약이 길함. 워크인은 대기가 길어진다.',
  ];
  const fortune = fortunes[seed % fortunes.length];

  return (
    <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)', border: '1px solid #FDE68A', borderRadius: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>오늘의 밤 운세</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', border: 'none', borderRadius: '50px', padding: '0.875rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font-sans)', minHeight: '48px', boxShadow: '0 4px 16px rgba(217,119,6,0.3)' }}>
          운세 확인하기 ✨
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <p style={{ fontSize: '1rem', color: '#92400E', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.7 }}>{fortune}</p>
          <div style={{ padding: '1rem', background: '#1A1714', borderRadius: '12px', border: '1px solid #FDE68A' }}>
            <p style={{ fontSize: '0.75rem', color: '#B45309', marginBottom: '0.25rem' }}>오늘의 행운 장소</p>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#F7E7CE' }}>{todayVenue.name}</h3>
            <a href={`/${todayVenue.cat_slug}/${todayVenue.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#F59E0B', color: '#FFF', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              확인하기 →
            </a>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '0.75rem' }}>내일 다시 확인하세요. 매일 바뀝니다.</p>
        </div>
      )}
    </div>
  );
}

/* ═══ [17] "예산 계산기" — 인원+주종 → 예상 금액 + 맞춤 추천 ═══ */
export function BudgetCalculator({ venues }: { venues: any[] }) {
  const [people, setPeople] = useState(4);
  const [bottles, setBottles] = useState(1);
  const [category, setCategory] = useState('night');
  const prices: Record<string, number> = { night: 250000, club: 150000, lounge: 180000, room: 400000, yojeong: 500000, hoppa: 300000 };
  const catLabels: Record<string, string> = { night: '나이트', club: '클럽', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' };
  const total = prices[category] * bottles;
  const perPerson = Math.ceil(total / people);
  const matched = venues.filter(v => v.cat_slug === category).slice(0, 3);

  return (
    <div style={{ padding: '1.5rem', background: '#1A1714', border: '1px solid #3D3425', borderRadius: '20px' }}>
      <h3 style={{ marginBottom: '0.25rem', color: '#F7E7CE' }}>오늘 밤 예산 계산기</h3>
      <p style={{ fontSize: '0.8rem', color: '#B8A080', marginBottom: '1rem' }}>인원과 카테고리를 선택하면 예상 비용을 알려드립니다</p>
      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.entries(catLabels).map(([k, l]) => (
            <button key={k} onClick={() => setCategory(k)} style={{
              padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontFamily: 'var(--font-sans)',
              border: category === k ? '2px solid #D4AF37' : '1px solid #3D3425',
              background: category === k ? '#241F1A' : '#1A1714', color: category === k ? '#D4AF37' : '#B8A080',
              cursor: 'pointer', fontWeight: category === k ? 700 : 400,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '50px', color: '#E8D5B5' }}>인원</label>
          <input type="range" min="1" max="10" value={people} onChange={e => setPeople(Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontWeight: 700, color: '#D4AF37', minWidth: '30px' }}>{people}명</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '50px', color: '#E8D5B5' }}>양주</label>
          <input type="range" min="1" max="5" value={bottles} onChange={e => setBottles(Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontWeight: 700, color: '#D4AF37', minWidth: '30px' }}>{bottles}병</span>
        </div>
      </div>
      <div style={{ padding: '1rem', background: '#241F1A', borderRadius: '12px', textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#B8A080' }}>예상 총 비용</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4AF37' }}>{total.toLocaleString()}원</p>
        <p style={{ fontSize: '0.85rem', color: '#E8D5B5' }}>1인당 약 <strong>{perPerson.toLocaleString()}원</strong></p>
      </div>
      {matched.length > 0 && (
        <div>
          <p style={{ fontSize: '0.8rem', color: '#B8A080', marginBottom: '0.5rem' }}>이 예산에 맞는 곳</p>
          {matched.map(v => (
            <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '0.5rem 0.75rem', marginBottom: '0.25rem', background: '#161310', borderRadius: '8px', textDecoration: 'none', color: '#F7E7CE', fontSize: '0.85rem' }}>
              <strong>{v.name}</strong> <span style={{ color: '#B8A080' }}>· {v.region}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ [18] "이번주 TOP3 변동" — 매주 바뀜 → 매주 방문 ═══ */
export function WeeklyHot({ venues }: { venues: any[] }) {
  const week = Math.floor(Date.now() / (7 * 86400000));
  const seed = week * 31;
  const top3 = [0, 1, 2].map(i => venues[(seed + i * 13) % venues.length]);
  const changes = ['+2', 'NEW', '-1'];

  return (
    <div style={{ padding: '1.5rem', background: '#1A1714', border: '1px solid #3D3425', borderRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#F7E7CE' }}>이번주 급상승</h3>
        <span style={{ fontSize: '0.7rem', color: '#999', background: '#161310', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>매주 갱신</span>
      </div>
      {top3.map((v, i) => (
        <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: i < 2 ? '1px solid #241F1A' : 'none', textDecoration: 'none', color: 'inherit' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#D4AF37', color: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F7E7CE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</p>
            <p style={{ fontSize: '0.8rem', color: '#B8A080' }}>{v.card_hook}</p>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: changes[i] === 'NEW' ? '#DC2626' : changes[i].startsWith('+') ? '#16A34A' : '#EF4444', flexShrink: 0 }}>
            {changes[i] === 'NEW' ? '🔥 NEW' : changes[i].startsWith('+') ? `▲${changes[i]}` : `▼${changes[i].slice(1)}`}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ═══ [19] "감정 기반 추천" — 기분 선택 → 맞춤 업소 ═══ */
export function MoodMatch({ venues }: { venues: any[] }) {
  const [mood, setMood] = useState<string|null>(null);
  const moods = [
    { emoji: '🔥', label: '신나고 싶다', cats: ['club', 'night'] },
    { emoji: '🍷', label: '차분하게 마시고 싶다', cats: ['lounge', 'yojeong'] },
    { emoji: '👑', label: '제대로 접대하고 싶다', cats: ['room', 'yojeong'] },
    { emoji: '💃', label: '특별한 밤을 보내고 싶다', cats: ['hoppa', 'club'] },
    { emoji: '🎲', label: '아무데나 좋아', cats: ['club', 'night', 'lounge', 'room', 'yojeong', 'hoppa'] },
  ];
  const selected = moods.find(m => m.label === mood);
  const matched = selected ? venues.filter(v => selected.cats.includes(v.cat_slug)).sort(() => Math.random() - 0.5).slice(0, 3) : [];

  return (
    <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #241F1A, #1A1714)', border: '1px solid #D4AF37', borderRadius: '20px' }}>
      <h3 style={{ marginBottom: '0.25rem', color: '#F7E7CE' }}>지금 기분이 어때요?</h3>
      <p style={{ fontSize: '0.8rem', color: '#B8A080', marginBottom: '1rem' }}>기분에 맞는 곳을 추천해드립니다</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {moods.map(m => (
          <button key={m.label} onClick={() => setMood(m.label)} style={{
            padding: '0.5rem 0.875rem', borderRadius: '50px', fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
            border: mood === m.label ? '2px solid #D4AF37' : '1px solid #D4AF37',
            background: mood === m.label ? '#D4AF37' : '#1A1714', color: mood === m.label ? '#0D0D0D' : '#E8D5B5',
            cursor: 'pointer', fontWeight: mood === m.label ? 700 : 400, minHeight: '40px',
          }}>{m.emoji} {m.label}</button>
        ))}
      </div>
      {matched.length > 0 && (
        <div style={{ animation: 'fadeIn 0.4s' }}>
          <p style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, marginBottom: '0.5rem' }}>당신에게 맞는 곳</p>
          {matched.map(v => (
            <a key={v.slug} href={`/${v.cat_slug}/${v.slug}/`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: '#1A1714', border: '1px solid #D4AF37', borderRadius: '12px', textDecoration: 'none', color: '#F7E7CE' }}>
              <strong>{v.name}</strong>
              <span style={{ fontSize: '0.8rem', color: '#B8A080', marginLeft: '0.5rem' }}>{v.card_hook}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
