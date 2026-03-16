import type { Metadata } from 'next';
import { getCategories, SITE_NAME, SITE_URL } from '../lib/venues';
import { getHomeContent } from '../lib/gold-content';

const content = getHomeContent();

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: { canonical: SITE_URL + '/' },
  openGraph: {
    title: content.title, description: content.description,
    url: SITE_URL + '/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/images/og-thumb.jpg', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const categories = getCategories();
  const year = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: SITE_NAME, url: SITE_URL, description: content.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section">
        <div className="container">
          <h1>{content.heading}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--champagne)', marginBottom: '0.5rem' }}>
            {content.subheading}
          </p>
          <p style={{ maxWidth: '600px', marginBottom: '2.5rem' }}>
            어두운 거리 끝에 빛나는 문 하나. 그 너머에 오늘 밤이 있다.
            이 지도는 그 문을 찾는 사람을 위한 안내서다.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {categories.map(cat => (
              <a
                key={cat.slug}
                href={`/${cat.slug}s/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '2rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
              >
                <h2 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>
                  {cat.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.count}곳</span>
                </h2>
                <p style={{ color: 'var(--text)' }}>
                  {cat.slug === 'club' && '사운드가 몸을 감싸고, 조명이 시야를 지배하는 곳. 비트 위에서 밤이 시작된다.'}
                  {cat.slug === 'night' && '테이블 하나가 오늘 밤의 무대가 된다. 격식과 흥이 공존하는 전통의 현장.'}
                  {cat.slug === 'lounge' && '잔을 기울이며 나누는 이야기가 밤의 주인공이 되는 곳.'}
                </p>
                <span style={{ color: 'var(--gold)', fontSize: '0.9rem', marginTop: '0.75rem', display: 'inline-block' }}>
                  전체 목록 보기 →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2>이 가이드에 대하여</h2>
          <p>
            {year}년 현재, 전국 밤문화 현장을 발로 뛰며 기록한 결과물이다.
            광고비를 받고 쓴 글이 아니라, 직접 방문한 뒤 느낀 그대로를 옮겼다.
          </p>
          <p style={{ marginTop: '1rem' }}>
            영업시간이 바뀌었을 수도 있고, 분위기가 달라졌을 수도 있다.
            가기 전에 한 번 더 확인하는 습관이 좋은 밤을 만든다.
          </p>
          <p style={{ marginTop: '1rem' }}>
            세 가지 유형으로 분류했다. 비트 위에서 밤을 보내는 곳, 테이블에 앉아 격식을 갖추는 곳,
            잔을 기울이며 대화하는 곳. 각 카드에는 핵심 태그와 한줄평을 달아 빠르게 비교할 수 있게 했다.
          </p>
          <p style={{ marginTop: '1rem' }}>
            지역별로 정리해 동선 계획에 참고하도록 구성했다. 서울 강남·홍대·이태원은 물론
            부산·대구·대전·인천·제주까지 포함한다. 방문 전 교통편과 운영 시간을 확인하길 권한다.
          </p>
        </div>
      </section>
    </>
  );
}
