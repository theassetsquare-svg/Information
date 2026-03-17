import type { Metadata } from 'next';
import { getCategories, getAllVenues, SITE_NAME, SITE_URL } from '../lib/venues';
import { getHomeContent } from '../lib/gold-content';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import Roulette from '../components/Roulette';
import VsBattle from '../components/VsBattle';
import { SlotMachine, DailyStreak, LiveCounter, InfiniteFeed, EndlessRecommend } from '../components/AddictionEngine';

const content = getHomeContent();
const cats = getCategories();
const allVenues = getAllVenues();

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: { canonical: SITE_URL + '/' },
  openGraph: {
    title: content.title, description: content.description,
    url: SITE_URL + '/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const year = new Date().getFullYear();
  // 카테고리별 1개씩 = 최대 4개 (같은 단어 반복 최소화)
  const seen = new Set<string>();
  const top5 = allVenues.filter(v => { if (seen.has(v.cat_slug)) return false; seen.add(v.cat_slug); return true; }).slice(0, 4);
  const hidden = allVenues.slice(50, 51);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: SITE_NAME, url: SITE_URL, description: content.description,
    potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };

  const catDescs: Record<string, string> = {
    club: '비트 위에서 밤을 보내는 곳',
    night: '테이블과 격식의 전통 문화',
    lounge: '잔을 기울이며 나누는 대화',
    room: '문 닫으면 우리만의 공간',
    yojeong: '한정식과 국악의 풍류',
    hoppa: '여성을 위한 프리미엄 선택',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 히어로 + 검색 */}
      <section style={{ padding: '2.5rem 0 1.5rem', background: 'var(--bg-alt)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '0.5rem' }}>{content.heading}</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>{content.subheading}</p>
          <SearchBar venues={allVenues} />
        </div>
      </section>

      {/* 6종 카테고리 아이콘 */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.5rem',
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px',
                  textDecoration: 'none', color: 'var(--text)', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{cat.count}곳</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{catDescs[cat.slug]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOP5 핫한 곳 */}
      <section className="section">
        <div className="container">
          <h2>지금 핫한 곳 TOP 5</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>조회수 기준 인기 업소</p>
          <div className="venue-grid">
            {top5.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* [A] 룰렛 */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <Roulette venues={allVenues} />
        </div>
      </section>

      {/* [B] VS 대결 */}
      <section className="section">
        <div className="container">
          <VsBattle venues={allVenues} />
        </div>
      </section>

      {/* [D] 첫 방문 가이드 배너 */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '1px solid var(--border-accent)',
            borderRadius: '16px', padding: '1.5rem 2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>밤문화 처음이세요?</h3>
            <p style={{ color: 'var(--text-sub)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              뭘 입고 가야 하는지, 얼마나 드는지, 혼자 가도 되는지. 궁금한 거 다 정리했다.
            </p>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', background: 'var(--purple)', color: '#FFF',
              padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700,
              textDecoration: 'none', fontSize: '0.95rem' }}>
              첫 방문 가이드 보기 →
            </a>
          </div>
        </div>
      </section>

      {/* 더 많은 업소는 카테고리에서 */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>전국 {allVenues.length}곳 둘러보기</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            카테고리별로 정리된 전체 목록을 확인하세요.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer"
                style={{ padding: '0.6rem 1.25rem', background: 'var(--purple)', color: '#FFF',
                  borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                {cat.name} {cat.count}곳 →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 숨은 명소 */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <h2>이 업소 몰랐지?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>아는 사람만 아는 숨은 명소</p>
          <div className="venue-grid">
            {hidden.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* [E] 인기 시간대 */}
      <section className="section">
        <div className="container narrow">
          <h2>시간대별 추천</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>19시~22시 · 저녁 시작</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>라운지나 요정이 좋다. 저녁 식사 후 자연스럽게 이어지는 동선.</p>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>22시~01시 · 피크타임</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>사교장과 플로어가 가장 활기찬 시간대. 일찍 도착해서 자리를 잡자.</p>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>01시~05시 · 심야</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>진짜 밤은 자정 이후. 에너지가 가장 높아지는 하이라이트 시간.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 지역별 가이드 */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container narrow">
          <h2>지역별 밤의 표정</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { name: '강남·서초', desc: '대형 플로어와 프리미엄 라운지 밀집. 드레스코드 있는 곳이 많다.' },
              { name: '압구정·청담', desc: '세련된 분위기의 클럽과 라운지. 20~30대 직장인이 주 고객.' },
              { name: '홍대·이태원', desc: '글로벌 감각의 인디 씬. 음악 장르 폭이 넓다.' },
              { name: '수유·노원·상봉', desc: '전통 사교 문화의 본거지. 오랜 단골이 많은 지역.' },
              { name: '수원·인덕원·성남', desc: '경기권 밤문화 격전지. 접근성 좋은 곳이 많다.' },
              { name: '부산·울산', desc: '연산동·해운대 중심. 서울과 다른 온도의 밤.' },
            ].map(r => (
              <div key={r.name} style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{r.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container narrow">
          <h2>자주 묻는 질문</h2>
          {[
            { q: '밤문화 처음인데 어디부터?', a: '테이블 문화가 궁금하면 수유 쪽, 플로어를 원하면 강남 쪽, 조용한 곳이면 압구정코드라운지를 추천한다.' },
            { q: '혼자 가도 어색하지 않을까?', a: '바 카운터가 있는 곳이면 괜찮다. 혼자 오는 손님이 생각보다 많다.' },
            { q: '복장 규정은?', a: '깔끔한 캐주얼이 기본. 강남권은 슬리퍼·트레이닝복 입장 제한된다.' },
            { q: '예산은 보통 얼마?', a: '장소마다 다르지만, 음료 2~3잔 기준 3~5만 원 선이 일반적이다.' },
            { q: '새벽에 귀가는?', a: '카카오T나 타다 앱 미리 설치. 지하철 막차는 자정 전후.' },
          ].map((f, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">Q. {f.q}</p>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎰 슬롯머신 — 변동 보상 */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <SlotMachine venues={allVenues} />
        </div>
      </section>

      {/* 출석 스트릭 */}
      <section className="section">
        <div className="container narrow">
          <DailyStreak />
        </div>
      </section>

      {/* 무한 피드 — 틱톡식 */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>전체 업소 둘러보기</h2>
          <LiveCounter />
          <div style={{ marginTop: '1rem' }}>
            <InfiniteFeed venues={allVenues} />
          </div>
        </div>
      </section>

      {/* 끝없는 추천 */}
      <section className="section">
        <div className="container narrow">
          <EndlessRecommend venues={allVenues} />
        </div>
      </section>
    </>
  );
}
