'use client';

import { useState, useMemo } from 'react';
import { getAllVenues, CAT_SLUG_TO_LABEL, SITE_URL } from '../lib/venues';
import type { Venue } from '../lib/venues';

const questions = [
  {
    q: '어떤 음악이 들리면 몸이 움직이나요?',
    options: [
      { text: 'EDM · 하우스 · 테크노', scores: { club: 3 } },
      { text: '트로트 · 7080 팝송', scores: { night: 3 } },
      { text: '재즈 · 보사노바 · R&B', scores: { lounge: 3 } },
      { text: '국악 · 클래식', scores: { yojeong: 3 } },
    ],
  },
  {
    q: '이상적인 밤의 분위기는?',
    options: [
      { text: '사람 많고 에너지 넘치는 곳', scores: { club: 2, night: 1 } },
      { text: '테이블에 앉아 대화하는 곳', scores: { night: 2, room: 1 } },
      { text: '조명 낮고 잔 기울이는 곳', scores: { lounge: 3 } },
      { text: '프라이빗하고 조용한 곳', scores: { room: 2, yojeong: 1 } },
    ],
  },
  {
    q: '오늘 밤 예산은 얼마 정도?',
    options: [
      { text: '3만 원 이하', scores: { club: 2, night: 1 } },
      { text: '3~10만 원', scores: { night: 2, lounge: 1 } },
      { text: '10~30만 원', scores: { lounge: 2, room: 1 } },
      { text: '돈은 문제가 아니다', scores: { yojeong: 2, hoppa: 2 } },
    ],
  },
  {
    q: '보통 몇 시에 나가나요?',
    options: [
      { text: '저녁 7~9시', scores: { lounge: 2, yojeong: 2 } },
      { text: '밤 10~12시', scores: { night: 2, club: 1 } },
      { text: '자정 이후', scores: { club: 3 } },
    ],
  },
  {
    q: '누구와 함께 가나요?',
    options: [
      { text: '혼자 (새로운 만남)', scores: { club: 1, hoppa: 2 } },
      { text: '친구 2~3명', scores: { club: 2, lounge: 1 } },
      { text: '단체 모임 (5명+)', scores: { night: 2, room: 2 } },
      { text: '비즈니스 접대', scores: { yojeong: 3, room: 1 } },
    ],
  },
  {
    q: '주로 마시는 술은?',
    options: [
      { text: '맥주 · 하이볼', scores: { club: 2 } },
      { text: '소주 · 양주 (테이블)', scores: { night: 2, room: 1 } },
      { text: '와인 · 칵테일', scores: { lounge: 3 } },
      { text: '전통주 · 정종', scores: { yojeong: 3 } },
    ],
  },
  {
    q: '옷 스타일은?',
    options: [
      { text: '스트릿 · 캐주얼', scores: { club: 2 } },
      { text: '단정한 캐주얼', scores: { night: 2, lounge: 1 } },
      { text: '정장 · 비즈니스 캐주얼', scores: { lounge: 2, yojeong: 1 } },
      { text: '화려하게 꾸미고 싶다', scores: { hoppa: 2, lounge: 1 } },
    ],
  },
  {
    q: '선호하는 지역은?',
    options: [
      { text: '강남 · 이태원 · 홍대', scores: { club: 2, lounge: 1 } },
      { text: '수유 · 노원 · 상봉', scores: { night: 3 } },
      { text: '전통 요정 거리', scores: { yojeong: 3 } },
      { text: '상관없다 — 분위기가 중요', scores: { room: 1, hoppa: 1, lounge: 1 } },
    ],
  },
  {
    q: '밤문화 경험 빈도는?',
    options: [
      { text: '거의 매주', scores: { club: 2, night: 1 } },
      { text: '월 1~2회', scores: { lounge: 2, night: 1 } },
      { text: '특별한 날에만', scores: { room: 2, yojeong: 1 } },
      { text: '처음이다', scores: { hoppa: 1, lounge: 1, night: 1 } },
    ],
  },
  {
    q: '오늘 밤의 기분은?',
    options: [
      { text: '신나고 에너지 폭발', scores: { club: 3 } },
      { text: '사교적이고 활발', scores: { night: 2, hoppa: 1 } },
      { text: '차분하고 감성적', scores: { lounge: 3 } },
      { text: '격식 있게 대접받고 싶다', scores: { yojeong: 2, room: 1 } },
    ],
  },
];

type ResultType = {
  key: string;
  name: string;
  description: string;
  catSlug: string;
};

const resultTypes: ResultType[] = [
  {
    key: 'club',
    name: '클럽파티형',
    description: '비트 위에서 밤을 보내는 당신. 에너지 넘치는 플로어와 DJ의 드롭이 당신의 심장을 뛰게 한다. 금요일 밤 자정이 지나면 진짜 당신의 시간이 시작된다.',
    catSlug: 'club',
  },
  {
    key: 'night',
    name: '나이트사교형',
    description: '테이블에 둘러앉아 건배하는 게 당신의 스타일. 트로트든 팝송이든, 음악과 함께 사람들과 어울리는 걸 즐긴다. 전통 나이트의 매력을 아는 사람.',
    catSlug: 'night',
  },
  {
    key: 'lounge',
    name: '라운지감성형',
    description: '낮은 조명, 좋은 음악, 한 잔의 칵테일. 시끄러운 곳보다 분위기 있는 공간에서 대화를 즐기는 감성파. 당신에게 밤은 여유 그 자체다.',
    catSlug: 'lounge',
  },
  {
    key: 'room',
    name: '룸프라이빗형',
    description: '문 닫으면 우리만의 세상. 단체 모임이든 소수 정예든, 프라이빗한 공간에서 편하게 즐기는 걸 선호한다. 눈치 볼 일 없는 밤을 원하는 타입.',
    catSlug: 'room',
  },
  {
    key: 'yojeong',
    name: '요정격식형',
    description: '전통의 풍류를 아는 당신. 한정식과 국악, 격식 있는 자리를 즐긴다. 비즈니스든 특별한 날이든, 품격 있는 밤을 보내고 싶어 한다.',
    catSlug: 'yojeong',
  },
  {
    key: 'hoppa',
    name: '호빠프리미엄형',
    description: '대접받는 밤을 원하는 당신. 프리미엄 서비스와 세심한 배려, 특별한 경험을 추구한다. 가끔은 자신을 위한 투자도 필요하니까.',
    catSlug: 'hoppa',
  },
];

export default function QuizClient() {
  const allVenues = useMemo(() => getAllVenues(), []);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnswer = (scores: Partial<Record<string, number>>) => {
    const updated = { ...answers };
    Object.entries(scores).forEach(([k, v]) => {
      if (v !== undefined) {
        updated[k] = (updated[k] || 0) + v;
      }
    });
    setAnswers(updated);

    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const getResult = (): ResultType => {
    let maxKey = 'club';
    let maxVal = 0;
    Object.entries(answers).forEach(([k, v]) => {
      if (v > maxVal) {
        maxKey = k;
        maxVal = v;
      }
    });
    return resultTypes.find(r => r.key === maxKey) || resultTypes[0];
  };

  const getRecommended = (catSlug: string): Venue[] => {
    const filtered = allVenues.filter(v => v.cat_slug === catSlug);
    return filtered.slice(0, 3);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(SITE_URL + '/quiz/').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setFinished(false);
    setCopied(false);
  };

  const result = finished ? getResult() : null;
  const recommended = result ? getRecommended(result.catSlug) : [];
  const progress = Math.round(((finished ? questions.length : current) / questions.length) * 100);

  return (
    <>
      {/* 진행 바 */}
      <div style={{ background: 'var(--border)', borderRadius: '8px', height: '8px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, background: 'var(--purple)', height: '100%', borderRadius: '8px', transition: 'width 0.4s ease' }} />
      </div>

      {!finished ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'left' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--purple)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Q{current + 1} / {questions.length}
          </p>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{questions[current].q}</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {questions[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.scores)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '1rem 1.25rem', background: 'var(--bg-alt)',
                  border: '1px solid var(--border)', borderRadius: '12px',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem', color: 'var(--text)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.borderColor = 'var(--purple)';
                  (e.target as HTMLButtonElement).style.background = 'rgba(212,175,55,0.06)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
                  (e.target as HTMLButtonElement).style.background = 'var(--bg-alt)';
                }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : result ? (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF, #F9FAFB)',
            border: '2px solid var(--border-accent)', borderRadius: '20px',
            padding: '2.5rem 2rem', marginBottom: '2rem',
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--purple)', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.08em' }}>
              당신의 유형은
            </p>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--purple)', marginBottom: '1rem' }}>
              {result.name}
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              {result.description}
            </p>
          </div>

          {/* 추천 업소 */}
          {recommended.length > 0 && (
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {CAT_SLUG_TO_LABEL[result.catSlug]} 추천 업소
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {recommended.map(v => (
                  <a
                    key={v.slug}
                    href={`/${v.cat_slug}/${v.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', padding: '1.25rem',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: '12px', textDecoration: 'none', color: 'var(--text)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--purple)', fontWeight: 600 }}>
                      {CAT_SLUG_TO_LABEL[v.cat_slug]} · {v.region}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: '0.25rem 0' }}>{v.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{v.card_hook}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 버튼들 */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleShare}
              style={{
                background: 'var(--purple)', color: '#FFF', border: 'none',
                padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
              }}
            >
              {copied ? '링크 복사됨!' : '결과 공유하기'}
            </button>
            <button
              onClick={restart}
              style={{
                background: 'transparent', color: 'var(--purple)',
                border: '1px solid var(--purple)', padding: '0.75rem 2rem',
                borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
              }}
            >
              다시 하기
            </button>
          </div>
        </div>
      ) : null}

      {/* 모든 유형 소개 (항상 보임) */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>6가지 밤문화 유형</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {resultTypes.map(rt => (
            <div key={rt.key} style={{
              padding: '1.25rem', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '12px',
            }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--purple)', marginBottom: '0.25rem' }}>{rt.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>{rt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
