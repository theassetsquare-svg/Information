import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';

const cat = getCategoryContent('night');
const venues = getVenuesByCategory('night');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/nights/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/nights/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/nights.png', width: 1200, height: 630 }] },
};

const regions = [...new Set(venues.map(v => v.region))];

export default function NightsPage() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a><span>&rsaquo;</span> 테이블
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>{cat.intro}</p>

        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p>테이블 중심의 사교 문화. 부스나 홀에 앉아 양주를 주문하고, 웨이터가 서비스를 제공한다. 자리 배치에 따라 하루 저녁의 경험이 달라지니 입장 후 위치 선정이 중요하다.</p>
          <p style={{ marginTop: '1rem' }}>수유·상봉은 서울 전통 강세 지역이고, 수원·성남·인덕원은 경기권 격전지다. 부산 연산동, 대구, 대전, 광주 등 지방 도시에도 오래 역사를 가진 곳이 많다. 현지인 의견을 참고하되 직접 확인하는 게 최선이다.</p>
        </div>

        {/* 지역별 요약 링크 */}
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {regions.map(region => {
            const rv = venues.filter(v => v.region === region);
            return (
              <div key={region} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{region}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>{rv.length}곳</span>
                </div>
                <a href={`/night/${rv[0].slug}/`} style={{ fontSize: '0.9rem', color: 'var(--purple)', textDecoration: 'none', fontWeight: 600 }}>→</a>
              </div>
            );
          })}
        </div>

        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '16px' }}>
          <h2>처음 방문하세요?</h2>
          <p style={{ marginBottom: '1rem' }}>테이블 문화가 낯설어도 괜찮다. 기본만 알면 된다.</p>
          <ul className="checklist">
            <li>입장하면 웨이터가 자리를 안내한다. 따라가면 됨</li>
            <li>양주 1병이 기본 주문 단위. 안주는 별도</li>
            <li>복장: 깔끔한 캐주얼. 정장까지는 아니어도 단정하게</li>
            <li>혼자 가면 카운터석. 2인 이상이면 테이블 추천</li>
            <li>피크타임 전(22시 전후) 도착이 좋은 자리 확보의 핵심</li>
            <li>예산: 양주 1병 기준 10~30만 원대 (지역마다 다름)</li>
          </ul>
        </div>

        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>피크 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { time: '금요일 22~24시', bar: '80%', note: '활발' },
              { time: '금요일 24~02시', bar: '95%', note: '피크' },
              { time: '토요일 22~01시', bar: '90%', note: '피크' },
              { time: '평일 저녁', bar: '30%', note: '여유' },
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
