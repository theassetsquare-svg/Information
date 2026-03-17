import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';
import { SlotMachine, DailyStreak, EndlessRecommend, LiveCounter } from '../../components/AddictionEngine';

const cat = getCategoryContent('club');
const venues = getVenuesByCategory('club');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/clubs/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/clubs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/clubs.png', width: 1200, height: 630 }] },
};

export default function ClubsPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 플로어
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p>EDM, 힙합, 하우스, 테크노. 장르가 곧 플로어의 정체성이다. 각 지역마다 색이 다르다. 대형 사운드 시스템이 있는 곳, 소규모 공간에서 밀도 높은 경험을 주는 곳, 글로벌 DJ가 자주 찾는 곳까지 다양하다.</p>
          <p style={{ marginTop: '1rem' }}>드레스코드가 있는 곳이 대부분이다. 슬리퍼와 트레이닝복은 입장이 제한된다. 피크타임은 금·토 자정 전후. 일찍 도착하면 대기 없이 들어갈 수 있다. {year}년 기준 {venues.length}곳을 정리했다.</p>
        </div>

        <div className="venue-grid">{(() => {
          const seen: Record<string, number> = {};
          return venues.filter(v => {
            seen[v.region] = (seen[v.region] || 0) + 1;
            return seen[v.region] <= 1;
          }).map(v => <VenueCard key={v.slug} venue={v} />);
        })()}</div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          전체 {venues.length}곳 — 각 카드를 눌러 상세 확인
        </p>

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '16px' }}>
          <h2>처음이세요?</h2>
          <ul className="checklist">
            <li>복장: 셔츠+깨끗한 신발이면 대부분 통과. 슬리퍼·반바지는 NO</li>
            <li>준비물: 신분증(필수), 현금+카드, 보조배터리</li>
            <li>혼자 가도 됨. 바 카운터에 앉으면 자연스럽다</li>
            <li>피크타임: 금·토 23시~01시. 일찍 가면 대기 없음</li>
            <li>예산: 입장료 무료~3만 원, 음료 1~2만 원대가 일반적</li>
          </ul>
        </div>
        {/* 슬롯머신 */}
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
