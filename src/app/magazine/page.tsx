import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, getAllVenues } from '@/lib/venues';

export const metadata: Metadata = {
  title: `매거진 — 밤문화 트렌드와 현장 이야기 | ${SITE_NAME}`,
  description: '나이트 처음 가는 법, 클럽과 나이트의 차이, 혼자 방문 후기까지. 밤문화를 즐기기 전에 읽어두면 좋은 이야기.',
  alternates: { canonical: SITE_URL + '/magazine/' },
  openGraph: {
    title: `매거진 — 밤문화 트렌드와 현장 이야기 | ${SITE_NAME}`,
    description: '나이트 처음 가는 법, 클럽과 나이트의 차이, 혼자 방문 후기까지.',
    url: SITE_URL + '/magazine/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

interface Article {
  id: string;
  title: string;
  readTime: string;
  date: string;
  paragraphs: string[];
  catFilter: string;
}

const ARTICLES: Article[] = [
  {
    id: 'beginner-night-guide',
    title: '나이트 처음 가는 사람을 위한 완벽 가이드',
    readTime: '3분',
    date: '2026-03-10',
    catFilter: 'night',
    paragraphs: [
      '나이트는 클럽과 다르다. 테이블 중심의 좌석 배치가 기본이고, 입장하면 웨이터가 자리로 안내한다. 처음 방문하는 사람이 가장 당황하는 지점이 바로 이 시스템이다. 미리 알고 가면 훨씬 여유롭게 즐길 수 있다.',
      '복장은 깔끔한 캐주얼 이상이 기본이다. 남성은 셔츠에 슬랙스, 여성은 원피스나 블라우스 정도면 충분하다. 운동화나 슬리퍼는 입장이 제한되는 곳이 대부분이므로 구두나 단화를 준비하자. 첫인상은 복장에서 시작된다.',
      '예산은 지역과 업소에 따라 차이가 크다. 일반적으로 테이블 세팅비, 음료, 안주 비용이 발생한다. 2~4인 기준으로 최소 20만 원에서 50만 원 사이를 예상하면 된다. 처음이라면 전화로 미리 가격대를 확인하는 것이 현명하다.',
      '피크타임은 보통 밤 11시에서 새벽 1시 사이다. 너무 일찍 가면 분위기가 아직 오르지 않았을 수 있고, 너무 늦으면 좋은 자리가 없을 수 있다. 10시 반에서 11시 사이에 도착하는 것이 가장 적절하다.',
      '신분증은 반드시 챙겨야 한다. 만 19세 미만은 입장이 불가능하며, 신분증 없이는 나이와 상관없이 입장을 거절당할 수 있다. 주민등록증, 운전면허증, 여권 중 하나를 지참하자.',
      '혼자 가는 것도 가능하다. 바 카운터가 있는 곳이라면 1인석으로 활용하기 좋다. 다만 나이트 특성상 2인 이상일 때 더 자연스러운 분위기가 되므로, 처음이라면 동행을 추천한다. 주중에 방문하면 혼자서도 부담이 적다.',
      '마지막으로, 음주 후 귀가 방법은 반드시 미리 계획해두자. 대리운전 앱이나 택시 호출 앱을 미리 설치해두면 새벽에 당황하지 않는다. 특히 주말에는 택시 잡기가 어려우므로 호출 앱이 필수다.',
    ],
  },
  {
    id: 'club-vs-night',
    title: '클럽 vs 나이트, 뭐가 다른 거야?',
    readTime: '3분',
    date: '2026-03-07',
    catFilter: 'club',
    paragraphs: [
      '클럽과 나이트는 완전히 다른 업종이다. 같은 밤문화지만 분위기, 시스템, 즐기는 방식, 그리고 방문하는 사람들의 목적까지 다르다. 둘 중 어디가 나에게 맞는지 알아보자.',
      '클럽은 DJ가 선곡하는 음악과 댄스 플로어가 중심이다. EDM, 힙합, 테크노 등 장르에 따라 분위기가 크게 달라진다. 기본적으로 서서 즐기는 구조이며, 음악과 춤에 몰입하는 것이 핵심이다. 20대 초반에서 30대 초반이 주요 연령층이다.',
      '나이트는 테이블 좌석 시스템이다. 입장 후 웨이터가 자리를 안내하며, 테이블 단위로 음료와 안주를 주문한다. 음악은 DJ가 틀기도 하지만 밴드 라이브가 함께하는 곳도 있다. 30대 이상 연령층이 많고, 사교 중심의 문화다.',
      '가격 구조도 다르다. 클럽은 입장료를 받고 안에서 음료를 별도로 구매하는 방식이 일반적이다. 입장료는 1만 원에서 3만 원 선이고, 음료는 1잔에 만 원 내외다. 나이트는 테이블 세팅비가 기본이므로 전체 비용이 더 높은 편이다.',
      '복장 기준도 차이가 있다. 클럽은 비교적 자유로운 편이지만 슬리퍼나 지나치게 캐주얼한 복장은 제한된다. 나이트는 좀 더 격식을 차리는 편이어서 깔끔한 차림이 기본이다. 업소마다 기준이 다르므로 방문 전 확인하는 것이 좋다.',
      '음악 스타일로 보면, 클럽은 장르별로 특화된 곳이 많다. EDM 전문, 힙합 전문, 테크노 전문 등 자신의 취향에 맞는 곳을 골라 갈 수 있다. 나이트는 대중적인 댄스 음악이 주류이며, 시간대별로 분위기가 전환되는 구조다.',
      '결론적으로, 음악과 춤에 집중하고 싶다면 클럽, 좌석에 앉아 대화와 술자리를 겸하고 싶다면 나이트가 맞다. 둘 다 해보고 자신에게 맞는 스타일을 찾는 것이 가장 좋다. 처음이라면 주중에 가벼운 마음으로 방문해보자.',
    ],
  },
  {
    id: 'solo-visit-review',
    title: '혼자 가도 괜찮을까? 1인 방문 솔직 후기',
    readTime: '3분',
    date: '2026-03-03',
    catFilter: 'lounge',
    paragraphs: [
      '밤문화를 혼자 즐기는 것에 대한 편견이 있다. "혼자 왜 가?" 라는 시선이 걱정되는 사람이 많다. 하지만 실제로 혼자 방문하는 사람은 생각보다 많고, 제대로 즐기는 방법도 있다. 직접 경험한 내용을 솔직하게 공유한다.',
      '라운지는 1인 방문에 가장 적합한 카테고리다. 바 카운터가 잘 갖춰져 있어서 혼자 앉아 음료를 즐기는 것이 자연스럽다. 볼륨이 낮아 바텐더와 가벼운 대화를 나눌 수도 있고, 조용히 혼자만의 시간을 보내기에도 좋다.',
      '클럽도 혼자 가는 것이 불가능하지 않다. 입장은 자유이고, 플로어에서 음악에 맞춰 즐기면 된다. 다만 아무도 모르는 상태에서 혼자 서 있는 시간이 불편할 수 있으므로, 바에서 음료를 시키고 분위기를 파악하는 것이 좋다.',
      '나이트의 경우 1인 방문은 다소 어색할 수 있다. 테이블 단위 시스템이기 때문에 혼자 테이블을 잡으면 비용 부담도 크고 시선도 느껴진다. 바 카운터가 있는 나이트라면 가능하지만, 일반적으로는 동행이 있는 것이 편하다.',
      '혼자 방문할 때 가장 중요한 것은 시간대 선택이다. 피크타임에 혼자 가면 사람이 너무 많아 오히려 편할 수도 있지만, 입장부터 혼잡하다. 반대로 오픈 직후에 가면 한산해서 부담이 적다. 평일 이른 시간이 1인 방문의 최적 타이밍이다.',
      '복장은 혼자일수록 더 신경 쓰는 것이 좋다. 깔끔하게 차려입으면 자신감이 올라가고, 주변 시선도 자연스럽게 긍정적으로 바뀐다. 과하게 꾸밀 필요는 없지만, "적당히 신경 썼다"는 인상을 주는 정도면 충분하다.',
      '귀가 계획은 더더욱 중요하다. 동행이 없으므로 취해서 판단이 흐려지면 위험할 수 있다. 음주량을 조절하고, 귀가 수단을 미리 확보해두자. 대리운전 앱, 택시 호출 앱은 필수다. 위치 공유 기능을 활용하면 안전도를 높일 수 있다.',
      '결론적으로, 혼자 가는 밤문화는 충분히 가능하다. 라운지나 바 카운터가 있는 곳을 선택하고, 평일 이른 시간에 방문하면 부담 없이 즐길 수 있다. 혼자만의 시간이 필요한 날, 한번쯤 도전해봐도 좋다.',
    ],
  },
];

export default function MagazinePage() {
  const allVenues = getAllVenues();

  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 매거진
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>매거진</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2.5rem', maxWidth: '600px' }}>
            밤문화 트렌드와 현장 이야기. 처음 방문하는 사람부터 단골까지 읽어두면 좋은 콘텐츠를 모았다.
          </p>

          {ARTICLES.map((article, articleIdx) => {
            const relatedVenues = allVenues
              .filter((v) => v.cat_slug === article.catFilter)
              .slice(0, 3);

            return (
              <article
                key={article.id}
                style={{
                  marginBottom: articleIdx < ARTICLES.length - 1 ? '3rem' : 0,
                  paddingBottom: articleIdx < ARTICLES.length - 1 ? '3rem' : 0,
                  borderBottom: articleIdx < ARTICLES.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* 헤더 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span>{article.date}</span>
                    <span>읽는 시간 {article.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', marginBottom: '0' }}>
                    {article.title}
                  </h2>
                </div>

                {/* 본문 */}
                <div style={{ maxWidth: '720px' }}>
                  {article.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      style={{
                        marginBottom: '1.25rem',
                        fontSize: '0.95rem',
                        lineHeight: 1.85,
                        color: 'var(--text)',
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* 관련 업소 */}
                {relatedVenues.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                      관련 업소
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '0.75rem',
                      }}
                    >
                      {relatedVenues.map((venue) => (
                        <a
                          key={venue.slug}
                          href={`/${venue.cat_slug}/${venue.slug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            padding: '0.875rem 1rem',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            color: 'inherit',
                            background: 'var(--bg-card)',
                            transition: 'border-color 0.2s',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                            {venue.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {venue.region} {venue.district}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
