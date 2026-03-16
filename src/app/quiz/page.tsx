import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../lib/venues';
import QuizClient from '../../components/QuizClient';

export const metadata: Metadata = {
  title: `밤문화 성향 테스트 — 나에게 맞는 곳은? | ${SITE_NAME}`,
  description: '10개 질문에 답하면 나에게 맞는 밤문화 유형을 알려준다. 클럽파티형, 나이트사교형, 라운지감성형, 룸프라이빗형, 요정격식형, 호빠프리미엄형 중 당신은?',
  alternates: { canonical: SITE_URL + '/quiz/' },
  openGraph: {
    title: `밤문화 성향 테스트 — 나에게 맞는 곳은? | ${SITE_NAME}`,
    description: '10개 질문에 답하면 나에게 맞는 밤문화 유형을 알려준다.',
    url: SITE_URL + '/quiz/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function QuizPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 밤문화 성향 테스트
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>밤문화 성향 테스트</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem' }}>
            10개 질문에 답하면 나에게 맞는 밤문화 유형을 알려준다.
          </p>
          <QuizClient />
        </div>
      </section>
    </>
  );
}
