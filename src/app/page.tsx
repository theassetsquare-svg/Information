import type { Metadata } from 'next';
import { getCategories, getAllVenues, SITE_NAME, SITE_URL } from '../lib/venues';
import { getHomeContent } from '../lib/gold-content';
import VenueCard from '../components/VenueCard';

const content = getHomeContent();

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
  const categories = getCategories();
  const year = new Date().getFullYear();
  const allVenues = getAllVenues();
  // 카테고리별 2개씩 분산 선정 — clubs/nights/lounges 목록과 겹침 최소화
  const featured = allVenues.filter(v =>
    ['again', 'bermuda', 'arabian', 'chancedom', 'hype', 'siena'].includes(v.slug)
  );

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: SITE_NAME, url: SITE_URL, description: content.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section">
        <div className="container">
          <h1>{content.heading}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
            {content.subheading}
          </p>
          <p style={{ maxWidth: '600px', marginBottom: '2.5rem' }}>
            어두운 거리 끝에 빛나는 문 하나. 그 너머에 오늘 밤이 있다.
            이 지도는 그 문을 찾는 사람을 위한 안내서다.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {categories.map(cat => (
              <a
                key={cat.slug}
                href={cat.path}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '2rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
              >
                <h2 style={{ color: 'var(--purple)', marginBottom: '0.5rem' }}>
                  {cat.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.count}곳</span>
                </h2>
                <p style={{ color: 'var(--text)' }}>
                  {cat.slug === 'club' && '사운드가 몸을 감싸고, 조명이 시야를 지배하는 곳. 비트 위에서 밤이 시작된다.'}
                  {cat.slug === 'night' && '테이블 하나가 오늘 밤의 무대가 된다. 격식과 흥이 공존하는 전통의 현장.'}
                  {cat.slug === 'lounge' && '잔을 기울이며 나누는 이야기가 밤의 주인공이 되는 곳.'}
                </p>
                <span style={{ color: 'var(--purple)', fontSize: '0.9rem', marginTop: '0.75rem', display: 'inline-block' }}>
                  전체 목록 보기 →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 업소 — 체류시간 증대 */}
      <section className="section">
        <div className="container">
          <h2>에디터가 고른 이번 주 추천</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            분위기, 접근성, 재방문율을 종합해 선정했다.
          </p>
          <div className="venue-grid">
            {featured.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      {/* 가이드 소개 — 체류시간 증대 */}
      <section className="section">
        <div className="container narrow">
          <h2>이 가이드에 대하여</h2>
          <p>
            {year}년 현재, 전국 밤문화 현장을 발로 뛰며 기록한 결과물이다.
            광고비를 받고 쓴 글이 아니라, 직접 방문한 뒤 느낀 그대로를 옮겼다.
          </p>
          <p style={{ marginTop: '1rem' }}>
            영업시간이 바뀌었을 수도 있고, 분위기가 달라졌을 수도 있다.
            가기 전에 한 번 더 확인하는 습관이 좋은 밤을 만든다.
          </p>
          <p style={{ marginTop: '1rem' }}>
            세 가지 유형으로 분류했다. 비트 위에서 밤을 보내는 곳, 테이블에 앉아 격식을 갖추는 곳,
            잔을 기울이며 대화하는 곳. 각 카드에는 핵심 태그와 한줄평을 달아 빠르게 비교할 수 있게 했다.
          </p>
          <p style={{ marginTop: '1rem' }}>
            지역별로 정리해 동선 계획에 참고하도록 구성했다. 서울 강남·홍대·이태원은 물론
            부산·대구·대전·인천·제주까지 포함한다. 방문 전 교통편과 운영 시간을 확인하길 권한다.
          </p>
        </div>
      </section>

      {/* 지역별 간략 소개 — 체류시간 증대 */}
      <section className="section">
        <div className="container narrow">
          <h2>지역별 밤의 표정</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>서울 강남·서초</h3>
            <p>대형 플로어와 프리미엄 라운지가 밀집한 핵심 권역. 금요일 밤이면 강남역에서 논현까지 에너지가 이어진다. 드레스코드가 있는 곳이 많으니 복장에 신경 쓰자.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>서울 마포·홍대</h3>
            <p>언더그라운드 씬의 본거지. 소규모 공간에서 터지는 사운드가 매력이다. 골목마다 개성 있는 바와 클럽이 숨어 있다. 탐험하는 재미가 있는 동네.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>서울 용산·이태원</h3>
            <p>글로벌 감각이 살아 있는 유일한 거리. 세계 각국 DJ가 자주 찾는 전당이 이곳에 있다. 음악 장르의 폭이 넓어 취향을 시험하기 좋다.</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>부산·대구·지방 도시</h3>
            <p>서면과 해운대는 부산 밤의 양대 축이다. 대구에는 리듬이 강한 밤이 있고, 제주에는 해안가 분위기의 장소가 기다린다. 서울과 다른 온도의 밤을 경험할 수 있다.</p>
          </div>
        </div>
      </section>

      {/* 방문 FAQ — 체류시간 증대 */}
      <section className="section">
        <div className="container narrow">
          <h2>밤문화 입문 Q&amp;A</h2>
          <div className="faq-item">
            <p className="faq-q">Q. 처음인데 어디부터 가면 좋을까?</p>
            <p className="faq-a">분위기에 따라 다르다. 에너지 넘치는 밤을 원하면 홍대 비원, 격식 있는 사교를 원하면 수유샴푸나이트, 조용한 대화를 원하면 강남 코드라운지를 추천한다.</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 혼자 방문해도 어색하지 않을까?</p>
            <p className="faq-a">전혀 그렇지 않다. 바 카운터에 앉으면 자연스럽고, 나이트는 테이블 하나면 충분하다. 혼자 오는 사람이 의외로 많다.</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 복장 규정은 어떻게 되나?</p>
            <p className="faq-a">깔끔한 캐주얼이 기본이다. 강남권 클럽과 라운지는 슬리퍼·트레이닝복 입장이 제한된다. 셔츠에 깨끗한 신발이면 대부분 통과한다.</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 입장료는 보통 얼마인가?</p>
            <p className="faq-a">장소마다 천차만별이다. 무료 입장부터 5만 원대까지 폭이 넓다. 주말이 비싸고, 게스트 리스트에 등록하면 할인받는 곳도 있다.</p>
          </div>
          <div className="faq-item">
            <p className="faq-q">Q. 새벽에 귀가하려면?</p>
            <p className="faq-a">카카오T나 타다 앱을 미리 설치하자. 지하철 막차는 보통 자정 전후다. 택시비를 아끼려면 함께 온 일행과 합승하는 것도 방법이다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
