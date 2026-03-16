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
    images: [{ url: '/og/lounges.png', width: 1200, height: 630 }],
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

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>유형별 특징</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>와인 바</h3>
            <p>산지별 셀렉션이 핵심이다. 소믈리에가 상주하는 곳은 입문자에게도 편하다. 페어링 메뉴가 있다면 음식과 함께 즐기기 좋다. 분위기는 차분하고, 대화 중심의 저녁을 원한다면 적합하다.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>칵테일 전문점</h3>
            <p>바텐더의 실력이 곧 그 집의 수준이다. 시그니처 한 잔을 주문해보면 분위기를 가늠할 수 있다. 인스타그램에서 본 비주얼에 끌려 갔다가, 맛에 놀라는 곳이 여럿 있다.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>호텔 스카이라운지</h3>
            <p>뷰가 압도적이다. 야경을 배경으로 한 잔 기울이는 경험은 특별한 날에 어울린다. 가격대가 높지만, 기념일이나 프로포즈처럼 분위기가 중요한 자리라면 투자할 가치가 있다.</p>
          </div>
        </div>

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>방문 전 체크리스트</h2>
          <ul className="checklist">
            <li>예약 여부 확인 — 인기 있는 곳은 당일 워크인이 어렵다</li>
            <li>복장은 스마트 캐주얼 이상으로 준비</li>
            <li>주차보다 대중교통이 편하다. 음주 후 귀가까지 계획하자</li>
            <li>시그니처 메뉴가 있다면 첫 잔으로 주문해보자</li>
            <li>사진 촬영은 주변 손님을 배려하며</li>
            <li>2차로 이동할 곳까지 미리 동선을 짜두면 효율적</li>
          </ul>
        </div>

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>Q&amp;A</h2>
          <div className="faq-item">
            <p className="faq-q">Q. 혼자 가도 괜찮은가?</p>
            <p className="faq-a">물론이다. 바 카운터 자리는 혼자 오는 손님을 위해 설계된 것이나 다름없다. 바텐더와의 가벼운 대화도 즐길 수 있다.</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 예산은 어느 정도 잡아야 하나?</p>
            <p className="faq-a">칵테일 기준 1인당 3~5만 원 선이 일반적이다. 호텔 스카이라운지는 음료 한 잔에 2~3만 원대. 와인은 보틀 기준으로 5만 원대부터 시작한다.</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 1차로 적합한가, 2차로 적합한가?</p>
            <p className="faq-a">저녁 식사 후 2차로 많이 간다. 하지만 분위기 좋은 곳에서 1차부터 시작해 천천히 시간을 보내는 것도 좋은 선택이다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
