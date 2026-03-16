import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('club');
const venues = getVenuesByCategory('club');

export const metadata: Metadata = {
  title: cat.title,
  description: cat.description,
  alternates: { canonical: SITE_URL + '/clubs/' },
  openGraph: {
    title: cat.title, description: cat.description,
    url: SITE_URL + '/clubs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/clubs.png', width: 1200, height: 630 }],
  },
};

/* 지역별 그룹핑으로 키워드 분산 */
const regions = [...new Set(venues.map(v => v.region))];

export default function ClubsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>›</span> 클럽
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '600px', marginBottom: '2rem' }}>{cat.intro}</p>

        {regions.map(region => {
          const regionVenues = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {region} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{regionVenues.length}곳</span>
              </h2>
              <div className="venue-grid">
                {regionVenues.map(v => <VenueCard key={v.slug} venue={v} />)}
              </div>
            </div>
          );
        })}

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>권역별 분위기 비교</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>강남·서초권</h3>
            <p>대형 사운드 시스템과 넓은 플로어가 특징이다. 드레스코드가 있는 곳이 많고, 테이블 예약 시스템을 운영하는 경우도 있다. 금요일과 토요일 밤이 가장 활기차며, 자정 이후가 피크타임이다.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>마포·홍대권</h3>
            <p>인디 뮤직 씬이 살아 있는 동네. 소규모 공간에서 밀도 높은 경험을 할 수 있다. 입장료가 상대적으로 저렴하고, 20대 초반 비율이 높다. 골목마다 새로운 발견이 있다.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>용산·이태원권</h3>
            <p>해외 DJ가 자주 내한하는 전당이 모여 있다. 테크노, 하우스, 앰비언트 등 장르의 폭이 넓다. 외국인 비율이 높아 글로벌한 분위기를 경험할 수 있다.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>부산·지방</h3>
            <p>서면은 에너지가 넘치고, 해운대는 바닷바람과 함께하는 밤이 특별하다. 대구·대전·제주에도 지역색이 뚜렷한 공간이 있다. 서울과 다른 여유로운 밤을 원한다면 추천한다.</p>
          </div>
        </div>

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>방문 전 준비</h2>
          <ul className="checklist">
            <li>신분증은 필수. 주민등록증·면허증·여권만 인정되는 곳이 대부분이다</li>
            <li>복장은 깔끔하게. 슬리퍼와 반바지는 입장이 제한될 수 있다</li>
            <li>귀중품은 최소화. 핸드폰·카드·현금 정도만 챙기자</li>
            <li>대중교통 막차 시간을 미리 확인해두자</li>
            <li>일행과 만남 장소와 시간을 사전에 정해두면 편하다</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
