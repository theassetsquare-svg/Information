import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/venues';
import MapClient from '@/components/MapClient';

export const metadata: Metadata = {
  title: `위치 탐색 — 반경 필터로 근처 검색 | ${SITE_NAME}`,
  description: '반경 설정 후 근처 스팟을 핀으로 표시. 업종 필터와 거리순 정렬을 지원한다.',
  alternates: { canonical: SITE_URL + '/map/' },
  openGraph: {
    title: `위치 탐색 — 반경 필터로 근처 검색 | ${SITE_NAME}`,
    description: '반경 설정 후 근처 스팟을 핀으로 표시.',
    url: SITE_URL + '/map/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function MapPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 지도
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>전국 밤문화 지도</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', maxWidth: '600px' }}>
            지역과 카테고리를 선택해 내 주변 업소를 찾아보자. 전국 103곳의 현장 정보를 한눈에 확인할 수 있다.
          </p>
          <MapClient />
        </div>
      </section>
    </>
  );
}
