import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';
import { SlotMachine, DailyStreak, EndlessRecommend } from '../../components/AddictionEngine';
import { FullCompareHook } from '../../components/HookingCTAs';

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
        <h1 style={{ marginTop: '1rem', color: '#8B5CF6' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '480px', marginBottom: '1.5rem', color: '#333' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem', padding: '2rem', background: '#F5F3FF', borderRadius: '16px', border: '1px solid #DDD6FE' }}>
          <p style={{ color: '#333' }}>호빠는 여성 고객을 위한 프리미엄 엔터테인먼트 공간이다. 호스트가 테이블에서 대화와 서비스를 제공한다. 시스템을 미리 이해하고 가면 첫 방문도 편안하다.</p>
          <p style={{ marginTop: '1rem', color: '#333' }}>강남, 부산, 장안동, 건대 등 주요 상권에 위치한 곳을 정리했다. 가격은 업소마다 다르니 방문 전 전화로 확인하는 것을 추천한다. {year}년 기준 {venues.length}곳.</p>
        </div>

        {regions.map(region => {
          const rv = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#8B5CF6' }}>
                {region} <span style={{ color: '#555', fontSize: '0.85rem' }}>{rv.length}곳</span>
              </h2>
              <div className="venue-grid">{rv.map(v => <VenueCard key={v.slug} venue={v} />)}</div>
            </div>
          );
        })}

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: '#F5F3FF', borderRadius: '16px', border: '1px solid #DDD6FE' }}>
          <h2 style={{ color: '#8B5CF6' }}>호빠 처음이세요?</h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>친구랑 가도 좋고, 혼자 가도 괜찮다. 시스템만 알면 편하다.</p>
          <ul className="checklist">
            <li>입장하면 매니저가 시스템을 설명해준다. 모르는 건 바로 물어보자</li>
            <li>호스트 지명은 선택사항. 마음에 드는 사람이 없으면 교체 가능</li>
            <li>복장: 평소처럼 편하게. 드레스코드 없는 곳이 대부분</li>
            <li>예산: 미리 정해두면 부담 없음. 전화로 시스템과 가격을 먼저 확인</li>
            <li>안전: 대부분의 업소에 CCTV와 보안 인력이 상주한다</li>
            <li>2차 강요 없음. 본인이 원하는 만큼만 즐기면 된다</li>
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
