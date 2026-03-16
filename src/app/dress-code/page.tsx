import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../lib/venues';
import DressCodeClient from '../../components/DressCodeClient';

export const metadata: Metadata = {
  title: `드레스코드 가이드 — 뭘 입고 가야 할까? | ${SITE_NAME}`,
  description: '클럽, 나이트, 라운지, 룸, 요정, 호빠 카테고리별 복장 가이드. DO & DON\'T 리스트와 외출 전 체크리스트.',
  alternates: { canonical: SITE_URL + '/dress-code/' },
  openGraph: {
    title: `드레스코드 가이드 — 뭘 입고 가야 할까? | ${SITE_NAME}`,
    description: '카테고리별 복장 가이드. 이것만 알면 입장에서 막힐 일 없다.',
    url: SITE_URL + '/dress-code/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function DressCodePage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 드레스코드 가이드
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>드레스코드 가이드</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '2.5rem' }}>
            뭘 입고 가야 할까? 카테고리별로 정리한 복장 가이드. 이것만 알면 입장에서 막힐 일 없다.
          </p>
          <DressCodeClient />
        </div>
      </section>

      {/* 오늘 날씨 */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container narrow">
          <h2 style={{ marginBottom: '1rem' }}>오늘 날씨 체크</h2>
          <div style={{
            padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
              외출 전 날씨를 확인하고 복장을 결정하자.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: '12px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>비 올 때</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>방수 신발, 우산 필수. 밝은 색 옷은 피하자.</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: '12px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>추울 때</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>코트 안에 레이어드. 실내는 덥다.</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: '12px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>더울 때</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>린넨 셔츠, 가벼운 소재. 땀 관리 중요.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
