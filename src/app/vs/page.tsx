import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../lib/venues';
import VsPageClient from '../../components/VsPageClient';

export const metadata: Metadata = {
  title: `양자택일 투표 — 승자를 골라보자 | ${SITE_NAME}`,
  description: '두 곳을 나란히 놓고 투표. 매주 새 대진표가 올라오며 승패 통계를 공개한다.',
  alternates: { canonical: SITE_URL + '/vs/' },
  openGraph: {
    title: `양자택일 투표 — 승자를 골라보자 | ${SITE_NAME}`,
    description: '두 곳을 나란히 놓고 투표. 매주 새 대진표.',
    url: SITE_URL + '/vs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function VsPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> VS 대결
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>업소 VS 대결</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '2.5rem' }}>
            어디가 더 나을까? 투표하고 다른 사람들의 선택을 확인하자.
          </p>

          <h2 style={{ marginBottom: '1.5rem' }}>이번주 대결</h2>
          <VsPageClient />
        </div>
      </section>
    </>
  );
}
