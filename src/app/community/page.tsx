import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/venues';
import { SITE_NAME } from '../../lib/gold-content';
import CommunityBoard from '../../components/CommunityBoard';

export const metadata: Metadata = {
  title: `커뮤니티 — 밤문화 이야기가 모이는 곳 | ${SITE_NAME}`,
  description: '자유게시판, 후기, 파티모집, 꿀팁, 패션, Q&A. 밤문화 경험을 나누고 정보를 얻는 커뮤니티.',
  alternates: { canonical: SITE_URL + '/community/' },
  openGraph: {
    title: `커뮤니티 — 밤문화 이야기가 모이는 곳 | ${SITE_NAME}`,
    description: '자유게시판, 후기, 파티모집, 꿀팁, 패션, Q&A. 밤문화 경험을 나누고 정보를 얻는 커뮤니티.',
    url: SITE_URL + '/community/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function CommunityPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span> 커뮤니티
        </div>
        <h1 style={{ marginTop: '1rem' }}>커뮤니티</h1>
        <p style={{ maxWidth: '600px', marginBottom: '2rem', color: 'var(--text-sub)' }}>
          밤문화 경험을 나누고, 동행을 구하고, 궁금한 걸 물어보는 공간이다.
        </p>
        <CommunityBoard />
      </div>
    </section>
  );
}
