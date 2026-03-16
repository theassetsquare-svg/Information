import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('hoppa');
const venues = getVenuesByCategory('hoppa');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/hoppas/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/hoppas/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/hoppas.png', width: 1200, height: 630 }] },
};

const regions = [...new Set(venues.map(v => v.region))];

export default function HoppasPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 호빠
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>{cat.intro}</p>

        {/* 여성 친화 소개글 */}
        <div className="narrow" style={{ marginBottom: '2.5rem', padding: '2rem', background: '#FFF5F7', borderRadius: '16px', border: '1px solid #FECDD3' }}>
          <p style={{ color: '#881337' }}>호빠는 여성 고객을 위한 프리미엄 엔터테인먼트 공간이다. 호스트가 테이블에서 대화와 서비스를 제공한다. 시스템을 미리 이해하고 가면 첫 방문도 편안하다.</p>
          <p style={{ marginTop: '1rem', color: '#881337' }}>강남, 부산, 장안동, 건대 등 주요 상권에 위치한 곳을 정리했다. 가격은 업소마다 다르니 방문 전 전화로 확인하는 것을 추천한다. 예산을 미리 정해두면 부담 없이 즐길 수 있다. {year}년 기준 {venues.length}곳.</p>
        </div>

        {regions.map(region => {
          const rv = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {region} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rv.length}곳</span>
              </h2>
              <div className="venue-grid">{rv.map(v => <VenueCard key={v.slug} venue={v} />)}</div>
            </div>
          );
        })}

        {/* 호빠 첫방문 가이드 — 여성 친화 */}
        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: '#FFF5F7', borderRadius: '16px', border: '1px solid #FECDD3' }}>
          <h2 style={{ color: '#881337' }}>호빠 처음이세요?</h2>
          <p style={{ marginBottom: '1rem', color: '#4A1D2F' }}>친구랑 가도 좋고, 혼자 가도 괜찮다. 시스템만 알면 편하다.</p>
          <ul className="checklist">
            <li style={{ color: '#4A1D2F' }}>입장하면 매니저가 시스템을 설명해준다. 모르는 건 바로 물어보자</li>
            <li style={{ color: '#4A1D2F' }}>호스트 지명은 선택사항. 마음에 드는 사람이 없으면 교체 가능</li>
            <li style={{ color: '#4A1D2F' }}>복장: 평소처럼 편하게. 드레스코드 없는 곳이 대부분</li>
            <li style={{ color: '#4A1D2F' }}>예산: 미리 정해두면 부담 없음. 전화로 시스템과 가격을 먼저 확인</li>
            <li style={{ color: '#4A1D2F' }}>안전: 대부분의 업소에 CCTV와 보안 인력이 상주한다</li>
            <li style={{ color: '#4A1D2F' }}>2차 강요 없음. 본인이 원하는 만큼만 즐기면 된다</li>
          </ul>
        </div>

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>호빠 인기 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { time: '금요일 21~23시', bar: '80%', note: '활발' },
              { time: '금요일 23~01시', bar: '95%', note: '피크' },
              { time: '토요일 22~01시', bar: '85%', note: '붐빔' },
              { time: '평일 저녁', bar: '35%', note: '여유' },
            ].map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ minWidth: '120px', fontSize: '0.9rem', fontWeight: 600 }}>{t.time}</span>
                <div style={{ flex: 1, background: '#FECDD3', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: t.bar, background: '#E11D48', height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
