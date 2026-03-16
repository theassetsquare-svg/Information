import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('yojeong');
const venues = getVenuesByCategory('yojeong');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/yojeongs/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/yojeongs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/yojeongs.png', width: 1200, height: 630 }] },
};

export default function YojeongsPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 요정
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p>요정은 한국 전통 접대 문화의 정수다. 한정식 코스가 기본이며, 국악 라이브 공연이 함께하는 곳도 있다. 프라이빗 룸에서 격식을 갖추고 대화하는 자리에 적합하다. 대부분 예약제로 운영되며, 가격대가 높은 편이다.</p>
          <p style={{ marginTop: '1rem' }}>일산명월관요정은 고양시 일산동구에 위치하며 한정식 15가지 코스와 국악 공연, 프라이빗 룸 30개 이상을 갖추고 있다. 정찰제로 운영되어 가격이 투명하다. 신실장이 총괄한다. {year}년 기준 {venues.length}곳을 정리했다.</p>
        </div>

        <div className="venue-grid">{venues.map(v => <VenueCard key={v.slug} venue={v} />)}</div>

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '16px' }}>
          <h2>요정 처음이세요?</h2>
          <ul className="checklist">
            <li>반드시 사전 예약. 당일 워크인은 거의 불가능하다</li>
            <li>복장: 격식 있게. 정장이나 깔끔한 비즈니스 캐주얼</li>
            <li>한정식 코스가 기본. 알레르기나 식이 제한이 있으면 미리 알려주자</li>
            <li>예산: 1인당 15~50만 원대 (코스+주류 포함 여부에 따라 다름)</li>
            <li>국악 공연이 있는 곳은 별도 문의. 특별한 자리에 어울린다</li>
            <li>접대 목적이면 좌석 배치와 동선을 미리 확인하는 게 좋다</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
