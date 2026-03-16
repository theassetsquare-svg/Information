import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/venues';
import RankingClient from '@/components/RankingClient';

export const metadata: Metadata = {
  title: `주간 순위표 — 조회수 기반 집계 | ${SITE_NAME}`,
  description: '조회수 집계로 산출한 주간 순위표. 장르·기간별 필터를 걸어 확인할 수 있다.',
  alternates: { canonical: SITE_URL + '/ranking/' },
  openGraph: {
    title: `주간 순위표 — 조회수 기반 집계 | ${SITE_NAME}`,
    description: '조회수 집계로 산출한 주간 순위표.',
    url: SITE_URL + '/ranking/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function RankingPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 인기 랭킹
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>인기 랭킹 TOP 20</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', maxWidth: '600px' }}>
            지금 가장 주목받는 전국 밤문화 업소를 확인하자. 카테고리와 기간별로 필터링할 수 있다.
          </p>
          <RankingClient />
        </div>
      </section>
    </>
  );
}
