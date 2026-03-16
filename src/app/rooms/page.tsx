import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('room');
const venues = getVenuesByCategory('room');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/rooms/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/rooms/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/rooms.png', width: 1200, height: 630 }] },
};

export default function RoomsPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 룸
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p>룸은 문이 닫히면 오롯이 프라이빗한 공간이 된다. 단체 모임, 비즈니스 접대, 가족 행사 등 격식과 프라이버시가 동시에 필요한 자리에 적합하다. 인원수에 맞는 사이즈를 고르는 것이 핵심이다.</p>
          <p style={{ marginTop: '1rem' }}>일산룸은 수도권 접근성이 뛰어나고 신실장이 총괄하는 것으로 알려져 있다. 해운대고구려는 부산 마린시티에 위치한 대형 룸으로 룸 60개 이상, 정찰제, 비즈니스 접대 전문, 픽업 서비스를 제공한다. {year}년 기준 {venues.length}곳을 정리했다.</p>
        </div>

        <div className="venue-grid">{venues.map(v => <VenueCard key={v.slug} venue={v} />)}</div>

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '16px' }}>
          <h2>룸 처음이세요?</h2>
          <ul className="checklist">
            <li>전화로 인원수, 예산, 목적을 미리 알리면 맞춤 안내를 받을 수 있다</li>
            <li>정찰제인 곳은 가격이 투명하다. 미리 확인하자</li>
            <li>주말 저녁은 빨리 찬다. 사전 예약 필수</li>
            <li>접대 목적이면 룸 사이즈와 분위기를 미리 확인하고 가는 게 좋다</li>
            <li>픽업 서비스가 있는 곳도 있다. 전화로 문의하자</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
