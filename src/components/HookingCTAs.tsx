'use client';

import { useState, useEffect } from 'react';

const MAIN_URL = 'https://ilsanroom.pages.dev';

export function MidContentHook() {
  return (
    <div className="hooking-mid">
      <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>전체 리뷰 93개 + 실시간 순위</p>
      <p>나머지 정보는 프리미엄 가이드에서 확인하세요</p>
      <a href={MAIN_URL} target="_blank" rel="noopener noreferrer">프리미엄 가이드 보기 →</a>
    </div>
  );
}

export function SimilarVenuesHook() {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', margin: '1.5rem 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <p style={{ color: '#333', marginBottom: '0.75rem', fontSize: '0.95rem' }}>비슷한 분위기 5곳 더 보기</p>
      <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block', background: '#8B5CF6', color: '#FFF', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
      }}>전체 비교하기 →</a>
    </div>
  );
}

export function AIRecommendHook() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '1px solid #DDD6FE', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', margin: '1.5rem 0' }}>
      <p style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>AI가 당신에게 맞는 곳을 추천합니다</p>
      <p style={{ color: '#333', fontSize: '0.9rem', marginBottom: '1rem' }}>취향, 예산, 위치를 분석해 최적의 밤을 설계합니다</p>
      <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block', background: '#8B5CF6', color: '#FFF', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
      }}>무료 AI 추천 받기 →</a>
    </div>
  );
}

export function FullCompareHook() {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', margin: '1.5rem 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <p style={{ color: '#111', fontSize: '0.95rem', marginBottom: '0.75rem' }}>103곳 전체를 한눈에 비교하고 싶다면</p>
      <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block', background: '#8B5CF6', color: '#FFF', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
      }}>전체 비교+랭킹 보기 →</a>
    </div>
  );
}

export function SlideUpHook() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 180000); return () => clearTimeout(t); }, []);
  if (!show || dismissed) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', zIndex: 150,
      background: '#FFF', borderTop: '2px solid #DDD6FE', padding: '1.25rem', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', animation: 'slideUp 0.5s ease-out' }}>
      <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: '0.5rem', right: '0.75rem', background: 'none', border: 'none', color: '#555', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
      <p style={{ color: '#111', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>더 깊은 정보가 기다리고 있습니다</p>
      <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block', background: '#8B5CF6', color: '#FFF', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
      }}>프리미엄 가이드 바로가기 →</a>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes slideUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}' }} />
    </div>
  );
}

export function ScrollBannerHook() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const handler = () => { const h = document.documentElement.scrollHeight - window.innerHeight; if (h > 0 && window.scrollY / h >= 0.8) setShow(true); };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!show || dismissed) return null;
  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 2rem)', maxWidth: '460px', zIndex: 140,
      background: '#FFF', border: '2px solid #DDD6FE', borderRadius: '16px', padding: '1.25rem', textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', animation: 'fadeInUp 0.4s ease-out' }}>
      <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: '0.5rem', right: '0.75rem', background: 'none', border: 'none', color: '#555', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
      <p style={{ color: '#8B5CF6', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>여기서 끝이 아닙니다</p>
      <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-block', background: '#8B5CF6', color: '#FFF', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
      }}>완벽한 밤 시작하기 →</a>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}' }} />
    </div>
  );
}
