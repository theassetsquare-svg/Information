import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('night');
const venues = getVenuesByCategory('night');

export const metadata: Metadata = {
  title: cat.title,
  description: cat.description,
  alternates: { canonical: SITE_URL + '/nights/' },
  openGraph: {
    title: cat.title, description: cat.description,
    url: SITE_URL + '/nights/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/nights.png', width: 1200, height: 630 }],
  },
};

const regions = [...new Set(venues.map(v => v.region))];

export default function NightsPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>›</span> 나이트
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '600px', marginBottom: '1rem' }}>{cat.intro}</p>
        <p style={{ maxWidth: '600px', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          테이블 위치 선정부터 피크타임 공략, 매너 규칙까지. {year}년 기준 {venues.length}곳을 엄선했다. 각 카드를 누르면 상세 가이드로 이동한다.
        </p>

        {regions.map(region => {
          const rv = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {region} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rv.length}곳</span>
              </h2>
              <div className="venue-grid">
                {rv.map(v => <VenueCard key={v.slug} venue={v} />)}
              </div>
            </div>
          );
        })}

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>방문 전 알아두면 좋은 것</h2>
          <p>피크 시간대는 보통 금·토 자정 전후다. 일찍 도착하면 좋은 자리를 선점할 수 있다.</p>
          <p style={{ marginTop: '0.75rem' }}>신분증은 필수이며, 복장은 깔끔하게 챙기자. 첫인상이 전체 흐름을 좌우한다.</p>
          <p style={{ marginTop: '0.75rem' }}>
            수도권부터 지방까지, 각 지역 나이트의 특색은 뚜렷하다. 수유·상봉은 전통 강세 지역이고,
            인천·수원·대전·울산에도 오랜 역사를 가진 곳이 있다. 현지인 후기를 참고하되 직접 확인이 최선이다.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            테이블 위치에 따라 하루 저녁 경험이 달라진다. 입구 근처는 출입이 잦고, 안쪽은 조용하며,
            무대 앞은 활기가 넘친다. 목적에 맞는 자리를 선택하는 것이 핵심이다.
          </p>
        </div>
      </div>
    </section>
  );
}
