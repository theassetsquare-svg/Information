import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';
import { SlotMachine, DailyStreak, EndlessRecommend } from '../../components/AddictionEngine';
import { FullCompareHook, AIRecommendHook } from '../../components/HookingCTAs';

const cat = getCategoryContent('lounge');
const venues = getVenuesByCategory('lounge');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/lounges/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/lounges/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/lounges.png', width: 1200, height: 630 }] },
};

export default function LoungesPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 라운지
        </div>
        <h1 style={{ marginTop: '1rem', color: '#8B5CF6' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '480px', marginBottom: '1.5rem', color: '#333' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#111' }}>라운지는 음악이 배경이고 대화가 주인공인 곳이다. 볼륨이 낮아 옆 사람 말이 들린다. 와인, 칵테일, 위스키 등 음료 퀄리티가 핵심이다. 소개팅, 비즈니스 미팅, 소규모 모임 장소로 많이 택한다.</p>
          <p style={{ marginTop: '1rem', color: '#111' }}>강남권 일대가 주 무대다. 바텐더의 실력이 곧 그 집의 수준. 시그니처 한 잔을 주문해보면 분위기를 가늠할 수 있다. 예약을 추천한다. 주말 저녁에는 자리가 빨리 찬다. {year}년 기준 {venues.length}곳을 비교했다.</p>
        </div>

        <div className="venue-grid">{venues.map(v => <VenueCard key={v.slug} venue={v} />)}</div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>
          전체 {venues.length}곳 — 카드를 눌러 상세 확인
        </p>

        <div style={{ marginTop: '2rem' }}>
          <AIRecommendHook />
        </div>

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: '#F5F5F5', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <h2 style={{ color: '#8B5CF6' }}>라운지 처음이세요?</h2>
          <ul className="checklist">
            <li>예약 추천. 인기 있는 곳은 당일 워크인이 어렵다</li>
            <li>복장: 스마트 캐주얼. 셔츠에 깔끔한 바지면 충분</li>
            <li>혼자 가도 됨. 바 카운터는 1인 손님을 위한 자리</li>
            <li>시그니처 칵테일부터 시작하면 그 집 수준을 파악할 수 있다</li>
            <li>예산: 칵테일 1잔 1.5~3만 원, 와인 보틀 5만 원대~</li>
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
