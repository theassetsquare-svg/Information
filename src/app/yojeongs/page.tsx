import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';
import { SlotMachine, DailyStreak, EndlessRecommend } from '../../components/AddictionEngine';
import { FullCompareHook } from '../../components/HookingCTAs';

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
        <h1 style={{ marginTop: '1rem', color: '#D4AF37' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '480px', marginBottom: '1.5rem', color: '#D4C5A9' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#F0E6D3' }}>요정은 한국 전통 접대 문화의 정수다. 한정식 코스가 기본이며, 국악 라이브 공연이 함께하는 곳도 있다. 프라이빗 룸에서 격식을 갖추고 대화하는 자리에 적합하다. 대부분 예약제로 운영되며, 가격대가 높은 편이다.</p>
          <p style={{ marginTop: '1rem', color: '#F0E6D3' }}>{year}년 기준 {venues.length}곳을 정리했다.</p>
        </div>

        <div className="venue-grid">{venues.map(v => <VenueCard key={v.slug} venue={v} />)}</div>

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: '#111', borderRadius: '16px', border: '1px solid #333' }}>
          <h2 style={{ color: '#D4AF37' }}>요정 처음이세요?</h2>
          <ul className="checklist">
            <li>반드시 사전 예약. 당일 워크인은 거의 불가능하다</li>
            <li>복장: 격식 있게. 정장이나 깔끔한 비즈니스 캐주얼</li>
            <li>한정식 코스가 기본. 알레르기나 식이 제한이 있으면 미리 알려주자</li>
            <li>예산: 1인당 15~50만 원대</li>
            <li>국악 공연이 있는 곳은 별도 문의</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <FullCompareHook />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <SlotMachine venues={venues} />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <DailyStreak />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <EndlessRecommend venues={venues} />
        </div>
      </div>
    </section>
  );
}
