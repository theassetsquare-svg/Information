import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../lib/venues';
import RoulettePageClient from '../../components/RoulettePageClient';

export const metadata: Metadata = {
  title: `오늘 갈 곳 룰렛 — 운명이 정해준다 | ${SITE_NAME}`,
  description: '어디 갈지 고민된다면 운명에 맡겨보자. 전체 랜덤 또는 카테고리별 랜덤으로 오늘의 행선지를 정한다.',
  alternates: { canonical: SITE_URL + '/roulette/' },
  openGraph: {
    title: `오늘 갈 곳 룰렛 — 운명이 정해준다 | ${SITE_NAME}`,
    description: '어디 갈지 고민된다면 운명에 맡겨보자. 버튼 하나로 오늘의 행선지가 정해진다.',
    url: SITE_URL + '/roulette/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function RoulettePage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 룰렛
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>오늘 갈 곳 룰렛</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '2.5rem' }}>
            어디 갈지 고민된다면 운명에 맡겨보자. 버튼 하나로 오늘의 행선지가 정해진다.
          </p>
          <RoulettePageClient />
        </div>
      </section>

      {/* 사용법 안내 */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container narrow">
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>이렇게 활용하자</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { title: '우유부단한 밤', desc: '어디 갈지 30분째 고민 중이라면, 그냥 돌려라. 운명이 정해준다.' },
              { title: '새로운 도전', desc: '매번 같은 곳만 갔다면, 룰렛으로 새로운 곳을 발견해보자.' },
              { title: '친구와 내기', desc: '다 같이 돌려서 나온 곳으로 가기. 의외의 재미가 있다.' },
            ].map(item => (
              <div key={item.title} style={{
                padding: '1.25rem', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: '12px',
              }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
