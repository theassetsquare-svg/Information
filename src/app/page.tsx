import type { Metadata } from 'next';
import { getCategories, getAllVenues, SITE_NAME, SITE_URL } from '../lib/venues';
import { getHomeContent } from '../lib/gold-content';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import Roulette from '../components/Roulette';
import VsBattle from '../components/VsBattle';
import { SlotMachine, DailyStreak, InfiniteFeed, EndlessRecommend, PersonalizedFeed, FOMOCounter, ExploreProgress, SwipeFeed, BingeChain, JackpotHunt, DailyFortune, BudgetCalculator, WeeklyHot, MoodMatch } from '../components/AddictionEngine';
import { AIRecommendHook, FullCompareHook, MidContentHook, SimilarVenuesHook } from '../components/HookingCTAs';

const content = getHomeContent();
const cats = getCategories();
const allVenues = getAllVenues();

/* 프리미엄 2개: 일산룸 + 일산명월관요정 */
const premiumSlugs = ['ilsan-room', 'ilsan-myeongwolgwan-yojeong'];
const premiumVenues = premiumSlugs.map(s => allVenues.find(v => v.slug === s)).filter(Boolean) as typeof allVenues;

/* 닉네임+전화 업소 */
const PRIORITY_SLUGS = [
  'busan-yeonsandong-mul-night', 'seongnam-shampoo-night', 'suwon-chancedom-night',
  'sillim-grandprix-night', 'cheongdam-h2o-night', 'paju-yadang-skydome-night', 'ulsan-champion-night',
];
const priorityVenues = PRIORITY_SLUGS.map(s => allVenues.find(v => v.slug === s)).filter(Boolean) as typeof allVenues;

/* TOP5: 카테고리 분산 */
const seenCat = new Set<string>();
const top5 = allVenues.filter(v => {
  if (seenCat.has(v.cat_slug)) return false;
  seenCat.add(v.cat_slug);
  return true;
}).slice(0, 5);

export const metadata: Metadata = {
  title: '골드나잇 — 전국 나이트·클럽·라운지 실시간 정보',
  description: '전국 109곳 비교. 나이트·클럽·라운지·룸·요정·호빠 카테고리별 정리. 밤의 격이 다른 선택.',
  alternates: { canonical: SITE_URL + '/' },
  openGraph: {
    title: '골드나잇 — 전국 나이트·클럽·라운지 실시간 정보',
    description: '전국 109곳 비교. 밤의 격이 다른 선택.',
    url: SITE_URL + '/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const year = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: SITE_NAME, url: SITE_URL,
    description: '전국 109곳 비교. 밤의 격이 다른 선택.',
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

      {/* ═══ 히어로 + 검색 ═══ */}
      <section style={{ padding: '2.5rem 0 1.5rem', background: '#F5F5F5' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '0.5rem' }}>
            밤의 격이 다른 선택
          </h1>
          <p style={{ color: '#333', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            전국 {allVenues.length}곳 · {year}년 현장 정보
          </p>
          <div style={{ marginBottom: '1rem' }}><FOMOCounter /></div>
          <SearchBar venues={allVenues} />
        </div>
      </section>

      {/* ═══ 6종 카테고리 아이콘 ═══ */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.5rem',
                  background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px',
                  textDecoration: 'none', color: '#111', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8B5CF6' }}>{cat.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.25rem' }}>{cat.count}곳</span>
                <span style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>{catDescs[cat.slug]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 개인화 추천 (방문 기록 기반) ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container">
          <PersonalizedFeed venues={allVenues} />
        </div>
      </section>

      {/* ═══ 신실장 직통 상담 ═══ */}
      <section className="section">
        <div className="container">
          <h2>직통 상담 가능</h2>
          <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>
            신실장 담당 · 전화 한 통으로 바로 상담
          </p>
          <div className="venue-grid">
            {premiumVenues.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* ═══ 지금 핫한 곳 TOP5 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container">
          <h2>지금 핫한 곳</h2>
          <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>카테고리별 대표 공간</p>
          <div className="venue-grid">
            {top5.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* ═══ 담당 직통 7개 ═══ */}
      <section className="section">
        <div className="container">
          <h2>담당 직통 연결</h2>
          <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>전화 한 통으로 바로 상담</p>
          <div className="venue-grid">
            {priorityVenues.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* ═══ [A] 룰렛 — 체류 5분 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container">
          <Roulette venues={allVenues} />
        </div>
      </section>

      {/* ═══ [후킹4] AI 추천 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container"><AIRecommendHook /></div>
      </section>

      {/* ═══ [B] VS 대결 ═══ */}
      <section className="section">
        <div className="container">
          <VsBattle venues={allVenues} />
        </div>
      </section>

      {/* ═══ 감정 기반 추천 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container"><MoodMatch venues={allVenues} /></div>
      </section>

      {/* ═══ [후킹2] 중간 끊기 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container"><MidContentHook /></div>
      </section>

      {/* ═══ 오늘의 운세 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container"><DailyFortune venues={allVenues} /></div>
      </section>

      {/* ═══ [D] 첫 방문 가이드 배너 ═══ */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '1px solid #DDD6FE',
            borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>밤문화 처음이세요?</h3>
            <p style={{ color: '#333', marginBottom: '1rem', fontSize: '0.95rem' }}>
              뭘 입고 가야 하는지, 얼마 드는지, 혼자 가도 되는지. 다 정리했다.
            </p>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', background: '#8B5CF6', color: '#FFF',
              padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700,
              textDecoration: 'none', fontSize: '0.95rem' }}>
              첫 방문 가이드 보기 →
            </a>
          </div>
        </div>
      </section>

      {/* ═══ [E] 시간대별 추천 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container narrow">
          <h2>지금 이 시간, 어디가 좋을까</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { t: '19~22시 · 워밍업', d: '라운지에서 칵테일 한 잔. 요정에서 한정식 코스. 저녁부터 자연스럽게 밤으로.' },
              { t: '22~01시 · 피크타임', d: '테이블석이 가장 뜨거운 시간. 플로어 입장 대기가 시작된다. 일찍 움직여라.' },
              { t: '01~05시 · 심야', d: '진짜 밤은 자정 넘어서. 에너지가 올라가는 하이라이트. 귀가 앱 미리 준비.' },
            ].map(item => (
              <div key={item.t} style={{ padding: '1.25rem', background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.t}</h3>
                <p style={{ fontSize: '0.9rem', color: '#333' }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 전국 둘러보기 ═══ */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>전국 {allVenues.length}곳 둘러보기</h2>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer"
                style={{ padding: '0.6rem 1.25rem', background: '#8B5CF6', color: '#FFF',
                  borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                {cat.name} {cat.count}곳 →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ [후킹5] 전체 비교 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container"><FullCompareHook /></div>
      </section>

      {/* ═══ 퀴즈 CTA ═══ */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ background: '#FFF', border: '2px solid #E5E7EB', borderRadius: '16px',
            padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>나에게 맞는 곳은?</h3>
            <p style={{ color: '#333', marginBottom: '1rem', fontSize: '0.9rem' }}>
              5초 테스트. 취향에 딱 맞는 카테고리를 찾아보자.
            </p>
            <a href="/quiz/" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', background: '#06B6D4', color: '#FFF',
              padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700,
              textDecoration: 'none', fontSize: '0.95rem' }}>
              테스트 시작 →
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 지역별 밤의 표정 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container narrow">
          <h2>지역별 밤의 표정</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { name: '강남·서초', desc: '대형 플로어와 프리미엄 라운지 밀집 지역.' },
              { name: '압구정·청담', desc: '세련된 분위기. 20~30대 직장인이 주 고객.' },
              { name: '홍대·이태원', desc: '글로벌 감각의 인디 씬. 장르 폭이 넓다.' },
              { name: '수유·노원·상봉', desc: '전통 사교 문화의 본거지. 단골이 많다.' },
              { name: '수원·성남·인덕원', desc: '경기권 밤문화 격전지. 접근성 우수.' },
              { name: '부산·울산', desc: '연산동·해운대 중심. 서울과 다른 온도.' },
            ].map(r => (
              <div key={r.name} style={{ padding: '1rem', background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{r.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#333' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section">
        <div className="container narrow">
          <h2>자주 묻는 질문</h2>
          {[
            { q: '처음인데 어디부터?', a: '테이블 문화가 궁금하면 수유 쪽. 플로어를 원하면 강남. 조용한 곳이면 압구정 라운지.' },
            { q: '혼자 가도 괜찮나?', a: '바 카운터가 있는 곳이면 어색하지 않다. 혼자 오는 손님 생각보다 많다.' },
            { q: '복장 규정은?', a: '깔끔한 캐주얼이 기본. 강남권은 슬리퍼·트레이닝복 입장 제한.' },
            { q: '예산은 보통 얼마?', a: '장소마다 다르지만 음료 2~3잔 기준 3~5만 원 선이 보통.' },
            { q: '새벽에 귀가는?', a: '카카오T 미리 설치. 지하철 막차는 자정 전후.' },
          ].map((f, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">Q. {f.q}</p>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ [후킹3] 비슷한 곳 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container"><SimilarVenuesHook /></div>
      </section>

      {/* ═══ 인스타그램 링크 ═══ */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #FAFAFA, #F0F0F0)', border: '1px solid #E5E7EB',
            borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>SNS에서 만나요</h3>
            <p style={{ color: '#333', marginBottom: '1rem', fontSize: '0.9rem' }}>
              실시간 분위기, 이벤트 소식을 인스타그램에서 확인하세요
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['#강남클럽', '#부산나이트', '#압구정라운지', '#호빠추천'].map(tag => (
                <a key={tag} href={`https://www.instagram.com/explore/tags/${tag.replace('#','')}/`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ padding: '0.5rem 1rem', background: '#FFF', border: '1px solid #E5E7EB',
                    borderRadius: '20px', fontSize: '0.85rem', color: '#8B5CF6', fontWeight: 600, textDecoration: 'none' }}>
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 슬롯머신 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container">
          <SlotMachine venues={priorityVenues} />
        </div>
      </section>

      {/* ═══ 잭팟 헌팅 ═══ */}
      <section className="section">
        <div className="container">
          <JackpotHunt venues={allVenues} />
        </div>
      </section>

      {/* ═══ 예산 계산기 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container">
          <BudgetCalculator venues={allVenues} />
        </div>
      </section>

      {/* ═══ 이번주 급상승 ═══ */}
      <section className="section">
        <div className="container">
          <WeeklyHot venues={allVenues} />
        </div>
      </section>

      {/* ═══ 출석 체크 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container narrow">
          <DailyStreak />
        </div>
      </section>

      {/* ═══ 틱톡 스와이프 피드 ═══ */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>한 곳씩 발견하기</h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '1rem', fontSize: '0.85rem' }}>
            다음 추천을 눌러보세요
          </p>
          <SwipeFeed venues={allVenues} />
        </div>
      </section>

      {/* ═══ 몰아보기 모드 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container">
          <BingeChain venues={allVenues} />
        </div>
      </section>

      {/* ═══ 무한 피드 ═══ */}
      <section className="section" style={{ background: '#F5F5F5' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>전체 둘러보기</h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '1rem', fontSize: '0.85rem' }}>
            스크롤하면 더 많은 곳이 나옵니다
          </p>
          <InfiniteFeed venues={allVenues} />
        </div>
      </section>

      {/* ═══ 탐험 진행도 ═══ */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container narrow">
          <ExploreProgress />
        </div>
      </section>

      {/* ═══ 끝없는 추천 ═══ */}
      <section className="section">
        <div className="container narrow">
          <EndlessRecommend venues={priorityVenues} />
        </div>
      </section>
    </>
  );
}
