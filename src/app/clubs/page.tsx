import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('club');
const venues = getVenuesByCategory('club');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/clubs/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/clubs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/clubs.png', width: 1200, height: 630 }] },
};

const regions = [...new Set(venues.map(v => v.region))];

export default function ClubsPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 클럽
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>{cat.intro}</p>

        {/* 소개글 500자+ */}
        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p>EDM, 힙합, 하우스, 테크노. 장르가 곧 그 클럽의 정체성이다. 강남은 대형 플로어와 프리미엄 서비스가 특징이고, 압구정은 세련된 분위기와 20~30대 직장인 중심. 홍대는 인디 감성과 소규모 공간의 밀도 높은 경험, 이태원은 글로벌 DJ가 자주 찾는 테크노 성지다. 지방도 놓칠 수 없다. 부천, 청주, 대전까지 각 지역 색이 뚜렷한 플레이스가 있다.</p>
          <p style={{ marginTop: '1rem' }}>드레스코드가 있는 곳이 대부분이다. 슬리퍼와 트레이닝복은 입장이 제한된다. 피크타임은 금·토 자정 전후. 일찍 도착하면 대기 없이 들어갈 수 있다. 음료 가격은 지역마다 천차만별이니 미리 확인하고 가자. {year}년 기준 전국 {venues.length}곳의 플로어를 정리했다.</p>
        </div>

        {regions.map(region => {
          const rv = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {region} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rv.length}곳</span>
              </h2>
              <div className="venue-grid">{rv.map(v => <VenueCard key={v.slug} venue={v} />)}</div>
            </div>
          );
        })}

        {/* [D] 첫방문 가이드 */}
        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '16px' }}>
          <h2>클럽 처음이세요?</h2>
          <p style={{ marginBottom: '1rem' }}>걱정 마. 이것만 알면 된다.</p>
          <ul className="checklist">
            <li>복장: 셔츠+깨끗한 신발이면 대부분 통과. 슬리퍼·반바지는 NO</li>
            <li>준비물: 신분증(필수), 현금+카드, 보조배터리</li>
            <li>혼자 가도 됨. 바 카운터에 앉으면 자연스럽다</li>
            <li>피크타임: 금·토 23시~01시. 일찍 가면 대기 없음</li>
            <li>예산: 입장료 무료~3만 원, 음료 1~2만 원대가 일반적</li>
            <li>귀가: 카카오T 미리 설치. 막차는 자정 전후</li>
          </ul>
        </div>

        {/* [E] 인기 시간대 */}
        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>클럽 인기 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { time: '금요일 22~24시', bar: '75%', note: '오프닝' },
              { time: '금요일 24~02시', bar: '95%', note: '피크' },
              { time: '토요일 23~01시', bar: '90%', note: '피크' },
              { time: '평일 밤', bar: '25%', note: '여유' },
            ].map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ minWidth: '120px', fontSize: '0.9rem', fontWeight: 600 }}>{t.time}</span>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: t.bar, background: 'var(--purple)', height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
