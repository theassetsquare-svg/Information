'use client';

import { useState } from 'react';

const categories = [
  {
    slug: 'club',
    name: '클럽',
    icon: '🎧',
    doList: [
      '깔끔한 캐주얼: 셔츠, 깨끗한 청바지, 슬랙스',
      '스니커즈(깨끗한 것), 구두, 부츠',
      '블랙 위주의 심플한 코디',
      '단정한 헤어 스타일링',
      '향수는 가볍게 (너무 진하면 역효과)',
    ],
    dontList: [
      '슬리퍼, 쪼리, 크록스',
      '트레이닝복, 짧은 반바지',
      '후줄근한 티셔츠, 나시',
      '모자 (일부 클럽 제한)',
      '과도한 로고가 있는 옷',
    ],
    tip: '강남 클럽은 드레스코드가 엄격한 편이다. 홍대·이태원은 상대적으로 자유롭다.',
  },
  {
    slug: 'night',
    name: '나이트',
    icon: '🌙',
    doList: [
      '정장 또는 비즈니스 캐주얼',
      '슬랙스 + 셔츠 조합',
      '구두 또는 깨끗한 로퍼',
      '여성: 원피스, 블라우스 + 스커트',
      '단정하고 격식 있는 스타일',
    ],
    dontList: [
      '찢어진 청바지',
      '운동화 (일부 허용하는 곳도 있음)',
      '과도한 노출',
      '작업복, 등산복',
      '캐릭터 프린트 티셔츠',
    ],
    tip: '나이트는 전통적으로 격식을 중시한다. 특히 수유·강남권은 단정한 복장이 기본.',
  },
  {
    slug: 'lounge',
    name: '라운지',
    icon: '🍸',
    doList: [
      '스마트 캐주얼: 니트 + 슬랙스, 블레이저',
      '깔끔한 원피스, 블라우스',
      '로퍼, 앵클부츠, 힐',
      '시계, 심플한 액세서리',
      '세련된 컬러 매칭 (블랙, 네이비, 베이지)',
    ],
    dontList: [
      '스포츠 웨어',
      '지나치게 캐주얼한 복장',
      '샌들 (호텔 라운지는 특히 제한)',
      '티셔츠 + 반바지 조합',
      '백팩 (클러치나 크로스백 권장)',
    ],
    tip: '호텔 라운지일수록 드레스코드가 엄격하다. 예약 시 미리 확인하는 게 좋다.',
  },
  {
    slug: 'room',
    name: '룸',
    icon: '🚪',
    doList: [
      '편한 캐주얼 OK (프라이빗 공간)',
      '깨끗하고 단정한 차림이면 대부분 무방',
      '비즈니스 모임이면 슬랙스 + 셔츠',
      '편한 신발 (실내에서 오래 앉아 있으므로)',
    ],
    dontList: [
      '지나치게 노출이 많은 옷',
      '냄새가 나는 옷 (밀폐 공간이므로)',
      '운동 직후 차림',
      '야외 작업복',
    ],
    tip: '룸은 다른 카테고리보다 자유로운 편이다. 다만 함께 가는 사람에 맞춰 수준을 조절하자.',
  },
  {
    slug: 'yojeong',
    name: '요정',
    icon: '🏯',
    doList: [
      '정장이 기본. 넥타이는 선택',
      '고급스러운 셔츠 + 구두',
      '여성: 한복 또는 격식 있는 원피스',
      '깨끗한 양말 (좌식 공간이라 신발을 벗는 경우 있음)',
      '단정한 머리, 깔끔한 손톱',
    ],
    dontList: [
      '캐주얼 전면 금지',
      '스니커즈, 슬리퍼',
      '후드티, 맨투맨',
      '청바지 (일부 고급 요정 제한)',
      '향이 강한 향수',
    ],
    tip: '요정은 가장 격식을 중시하는 공간이다. 접대 자리라면 정장은 필수.',
  },
  {
    slug: 'hoppa',
    name: '호빠',
    icon: '✨',
    doList: [
      '화려하게 꾸미고 가자. 본인이 주인공',
      '원피스, 블라우스, 트렌디한 코디',
      '힐, 부츠, 세련된 플랫슈즈',
      '메이크업은 평소보다 한 단계 업',
      '좋은 향수, 액세서리',
    ],
    dontList: [
      '너무 캐주얼한 차림 (운동복, 슬리퍼)',
      '지나치게 과한 노출 (가게 분위기에 따라 다름)',
      '운동화 + 맨투맨 조합',
      '백팩보다는 핸드백이나 클러치',
    ],
    tip: '호빠는 여성이 주인공인 공간. 자신감 있게 꾸미고 가면 대우가 달라진다.',
  },
];

interface CheckItem {
  text: string;
  checked: boolean;
}

const initialChecklist: CheckItem[] = [
  { text: '신분증 (주민등록증 또는 여권)', checked: false },
  { text: '현금 + 카드 모두 챙겼다', checked: false },
  { text: '보조배터리 충전 완료', checked: false },
  { text: '드레스코드에 맞는 복장 확인', checked: false },
  { text: '향수 적당히 뿌렸다', checked: false },
  { text: '머리 스타일링 완료', checked: false },
  { text: '귀가 교통편 확인 (카카오T 설치)', checked: false },
  { text: '친구에게 오늘 일정 공유', checked: false },
];

export default function DressCodeClient() {
  const [expandedCat, setExpandedCat] = useState<string | null>('club');
  const [checklist, setChecklist] = useState<CheckItem[]>(initialChecklist);

  const toggleCat = (slug: string) => {
    setExpandedCat(expandedCat === slug ? null : slug);
  };

  const toggleCheck = (idx: number) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(c => c.checked).length;

  return (
    <>
      {/* 카테고리별 드레스코드 */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {categories.map(cat => {
          const isOpen = expandedCat === cat.slug;
          return (
            <div key={cat.slug} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '16px', overflow: 'hidden',
              borderColor: isOpen ? 'var(--border-accent)' : 'var(--border)',
              transition: 'border-color 0.2s',
            }}>
              <button
                onClick={() => toggleCat(cat.slug)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '1.25rem 1.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', color: 'var(--text)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{cat.name}</span>
                </span>
                <span style={{
                  color: 'var(--purple)', fontWeight: 600, fontSize: '1.25rem',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}>
                  ▾
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* DO */}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: '#16A34A', fontWeight: 700, marginBottom: '0.75rem' }}>
                        DO - 이렇게 입자
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cat.doList.map((item, i) => (
                          <li key={i} style={{
                            padding: '0.4rem 0', paddingLeft: '1.25rem', position: 'relative',
                            fontSize: '0.9rem', color: 'var(--text-sub)',
                          }}>
                            <span style={{ position: 'absolute', left: 0, color: '#16A34A', fontWeight: 700 }}>+</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* DON'T */}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: '#DC2626', fontWeight: 700, marginBottom: '0.75rem' }}>
                        DON&#39;T - 이건 안 된다
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cat.dontList.map((item, i) => (
                          <li key={i} style={{
                            padding: '0.4rem 0', paddingLeft: '1.25rem', position: 'relative',
                            fontSize: '0.9rem', color: 'var(--text-sub)',
                          }}>
                            <span style={{ position: 'absolute', left: 0, color: '#DC2626', fontWeight: 700 }}>-</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '1rem', padding: '0.875rem 1rem',
                    background: 'rgba(139,92,246,0.06)', borderRadius: '8px',
                    border: '1px solid var(--border-accent)',
                  }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--purple)', fontWeight: 600 }}>
                      TIP: {cat.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 외출 전 체크리스트 */}
      <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>외출 전 체크리스트</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          나가기 전에 하나씩 체크하자. ({checkedCount}/{checklist.length} 완료)
        </p>

        {/* 진행 바 */}
        <div style={{ background: 'var(--border)', borderRadius: '8px', height: '8px', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{
            width: `${(checkedCount / checklist.length) * 100}%`,
            background: checkedCount === checklist.length ? '#16A34A' : 'var(--purple)',
            height: '100%', borderRadius: '8px', transition: 'width 0.3s',
          }} />
        </div>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {checklist.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.875rem 1rem', background: 'var(--bg-card)',
                border: '1px solid', borderColor: item.checked ? '#16A34A' : 'var(--border)',
                borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                textAlign: 'left', width: '100%', transition: 'all 0.2s',
              }}
            >
              <span style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderColor: item.checked ? '#16A34A' : 'var(--border)',
                background: item.checked ? '#16A34A' : 'transparent',
                color: '#FFF', fontSize: '0.75rem', fontWeight: 700,
                transition: 'all 0.2s',
              }}>
                {item.checked ? '✓' : ''}
              </span>
              <span style={{
                fontSize: '0.95rem',
                color: item.checked ? 'var(--text-muted)' : 'var(--text)',
                textDecoration: item.checked ? 'line-through' : 'none',
                transition: 'all 0.2s',
              }}>
                {item.text}
              </span>
            </button>
          ))}
        </div>

        {checkedCount === checklist.length && (
          <div style={{
            marginTop: '1.5rem', padding: '1.25rem', textAlign: 'center',
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: '1px solid #BBF7D0', borderRadius: '12px',
          }}>
            <p style={{ fontWeight: 700, color: '#16A34A', fontSize: '1rem' }}>
              준비 완료! 즐거운 밤 되세요.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
