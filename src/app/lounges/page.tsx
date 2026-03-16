import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('lounge');
const venues = getVenuesByCategory('lounge');

export const metadata: Metadata = {
  title: cat.title,
  description: cat.description,
  alternates: { canonical: SITE_URL + '/lounges/' },
  openGraph: {
    title: cat.title, description: cat.description,
    url: SITE_URL + '/lounges/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/images/og-thumb.jpg', width: 1200, height: 630 }],
  },
};

export default function LoungesPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>›</span> 라운지
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '600px', marginBottom: '1rem' }}>{cat.intro}</p>
        <p style={{ maxWidth: '600px', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          와인, 칵테일, 위스키. {year}년 기준 {venues.length}곳의 분위기와 메뉴를 비교했다. 소개팅이나 소규모 모임에도 적합한 선택지다.
        </p>

        <div className="venue-grid">
          {venues.map(v => <VenueCard key={v.slug} venue={v} />)}
        </div>

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>선택 기준</h2>
          <p>볼륨이 낮아 대화가 편한 곳, 인테리어와 조명에 신경 쓴 곳, 시그니처 음료가 인상적인 곳을 우선으로 골랐다.</p>
          <p style={{ marginTop: '0.75rem' }}>예약을 추천한다. 주말 저녁에는 자리가 빨리 찬다.</p>
          <p style={{ marginTop: '0.75rem' }}>
            강남·압구정·청담 일대가 주 무대다. 와인바부터 칵테일 전문점, 호텔 스카이라운지까지
            형태가 다양하다. 분위기 사진만 보고 판단하지 말고, 실제 음료 퀄리티와 서비스 수준까지 함께 따져야 한다.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            소개팅이나 소규모 모임 장소로 택한다면, 좌석 간격이 넓고 음악 볼륨이 낮은 곳이 유리하다.
            바 카운터에서 혼자 시간을 보내기에도 적합한 곳이 여럿 있다.
          </p>
        </div>
      </div>
    </section>
  );
}
