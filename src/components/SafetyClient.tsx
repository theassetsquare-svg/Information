'use client';

import { useState } from 'react';

function calculateBAC(weightKg: number, drinks: number, gender: 'male' | 'female'): number {
  const alcoholGrams = drinks * 14;
  const r = gender === 'male' ? 0.68 : 0.55;
  const bac = (alcoholGrams / (weightKg * 1000 * r)) * 100;
  return Math.max(0, bac);
}

function getBACLevel(bac: number): { level: string; color: string; message: string } {
  if (bac === 0) return { level: '맑은 상태', color: '#16A34A', message: '음주 전이다.' };
  if (bac < 0.03) return { level: '미세 음주', color: '#16A34A', message: '가벼운 기분 전환 수준. 운전은 가능하지만 주의.' };
  if (bac < 0.05) return { level: '경미한 음주', color: '#EAB308', message: '판단력이 약간 저하된다. 운전 면허 정지 기준(0.03%)을 초과했다.' };
  if (bac < 0.08) return { level: '음주 상태', color: '#F97316', message: '반응 속도가 느려진다. 절대 운전 금지. 면허 취소 기준(0.08%)에 근접.' };
  if (bac < 0.15) return { level: '만취 상태', color: '#DC2626', message: '운동 기능과 판단력이 크게 저하된다. 면허 취소 수준이다.' };
  return { level: '위험 수준', color: '#7F1D1D', message: '의식 혼미 가능성. 즉시 음주를 중단하고 물을 마셔라.' };
}

export default function SafetyClient() {
  const [weight, setWeight] = useState<number>(70);
  const [drinks, setDrinks] = useState<number>(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const bac = calculateBAC(weight, drinks, gender);
  const bacInfo = getBACLevel(bac);

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '20px', padding: '2rem',
    }}>
      <h2 style={{ marginBottom: '0.5rem' }}>혈중알코올농도 계산기</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        체중과 음주량을 입력하면 추정 혈중알코올농도(BAC)를 계산한다. (참고용이며 정확하지 않을 수 있음)
      </p>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {/* 성별 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>성별</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['male', 'female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                style={{
                  flex: 1, padding: '0.625rem',
                  background: gender === g ? 'var(--purple)' : 'var(--bg-alt)',
                  color: gender === g ? '#FFF' : 'var(--text)',
                  border: '1px solid',
                  borderColor: gender === g ? 'var(--purple)' : 'var(--border)',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontWeight: 600,
                  fontSize: '0.9rem', transition: 'all 0.2s',
                }}
              >
                {g === 'male' ? '남성' : '여성'}
              </button>
            ))}
          </div>
        </div>

        {/* 체중 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            체중: {weight}kg
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--purple)' }}
            aria-label="체중 선택"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>40kg</span><span>120kg</span>
          </div>
        </div>

        {/* 음주량 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            음주량: {drinks}잔 (표준잔 기준)
          </label>
          <input
            type="range"
            min="0"
            max="15"
            value={drinks}
            onChange={e => setDrinks(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--purple)' }}
            aria-label="음주량 선택"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>0잔</span><span>15잔</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            1표준잔 = 소주 1잔 = 맥주 1잔(355ml) = 와인 1잔(150ml)
          </p>
        </div>
      </div>

      {/* 결과 */}
      <div style={{
        marginTop: '1.5rem', padding: '1.5rem', textAlign: 'center',
        background: 'var(--bg-alt)', borderRadius: '12px',
        border: `2px solid ${bacInfo.color}`,
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          추정 혈중알코올농도
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 800, color: bacInfo.color, marginBottom: '0.25rem' }}>
          {bac.toFixed(3)}%
        </p>
        <p style={{ fontWeight: 700, color: bacInfo.color, marginBottom: '0.5rem' }}>
          {bacInfo.level}
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
          {bacInfo.message}
        </p>
      </div>

      <div style={{
        marginTop: '1rem', padding: '0.75rem 1rem',
        background: 'rgba(220,38,38,0.06)', borderRadius: '8px',
        border: '1px solid rgba(220,38,38,0.15)',
      }}>
        <p style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
          이 계산기는 참고용이다. 실제 혈중알코올농도는 체질, 식사 여부, 음주 속도 등에 따라 달라진다. 조금이라도 마셨다면 운전하지 마라.
        </p>
      </div>
    </div>
  );
}
