import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../lib/venues';
import ChatClient from '../../components/ChatClient';

export const metadata: Metadata = {
  title: `챗봇 어시스턴트 — 맞춤 질의응답 | ${SITE_NAME}`,
  description: '예산·지역·무드 조건을 입력하면 맞춤 답변을 생성하는 챗봇. 준비 중이며 곧 오픈.',
  alternates: { canonical: SITE_URL + '/chat/' },
  openGraph: {
    title: `챗봇 어시스턴트 — 맞춤 질의응답 | ${SITE_NAME}`,
    description: '예산·지역·분위기 조건을 입력하면 맞춤 답변을 생성하는 챗봇.',
    url: SITE_URL + '/chat/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

const quickLinks = [
  { label: '밤문화 성향 테스트', href: '/quiz/', desc: '10개 질문으로 나에게 맞는 유형을 찾아보자' },
  { label: '오늘 갈 곳 룰렛', href: '/roulette/', desc: '운명에 맡기고 싶다면 룰렛을 돌려보자' },
  { label: '업소 VS 대결', href: '/vs/', desc: '두 곳 중 어디가 나을까? 투표하고 확인하자' },
];

export default function ChatPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> AI 상담
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 0' }}>
        <div className="container narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>AI 상담</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '2rem' }}>
            오늘밤 뭐하지? AI에게 물어보자.
          </p>

          {/* 채팅 영역 (client component) */}
          <ChatClient />
        </div>
      </section>

      {/* 그동안 이것들을 둘러보세요 */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container narrow">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>그동안 이것들을 둘러보세요</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            AI 상담이 오픈될 때까지, 이 서비스들을 이용해 보세요.
          </p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {quickLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '1.5rem',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', textDecoration: 'none',
                  color: 'var(--text)', transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <h3 style={{ fontSize: '1.05rem', color: 'var(--purple)', marginBottom: '0.25rem' }}>
                  {link.label} →
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                  {link.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 자주 하는 질문 미리보기 */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container narrow">
          <h2 style={{ marginBottom: '1.5rem' }}>자주 하는 질문</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            AI가 오픈되면 이런 질문에 답해줄 예정이다.
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              '오늘 강남에서 갈만한 클럽 추천해줘',
              '처음인데 혼자 가도 괜찮을까?',
              '예산 5만 원으로 갈 수 있는 곳은?',
              '이태원에서 테크노 듣고 싶은데 어디?',
              '드레스코드 없는 곳 알려줘',
              '2차로 갈 만한 라운지 추천해줘',
            ].map((q, i) => (
              <div key={i} style={{
                padding: '0.875rem 1.25rem', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: '10px',
                fontSize: '0.9rem', color: 'var(--text-sub)',
              }}>
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
