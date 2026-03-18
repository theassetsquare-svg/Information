import type { Metadata } from 'next';
import { getAllVenues, getVenueBySlug, getRelatedVenues, SITE_URL, CAT_SLUG_TO_LABEL } from '../../../lib/venues';
import { generateGoldContent, SITE_NAME } from '../../../lib/gold-content';
import VenueCard from '../../../components/VenueCard';
import StickyPhoneBar from '../../../components/StickyPhoneBar';
import { ReadingProgress, AutoNext, EndlessRecommend } from '../../../components/AddictionEngine';
import { MidContentHook, SimilarVenuesHook, AIRecommendHook, FullCompareHook } from '../../../components/HookingCTAs';

interface Props { params: { category: string; slug: string } }

export function generateStaticParams() {
  return getAllVenues().map(v => ({ category: v.cat_slug, slug: v.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return { title: '페이지를 찾을 수 없습니다' };
  const gc = generateGoldContent(venue);
  const url = `${SITE_URL}/${venue.cat_slug}/${venue.slug}/`;
  return {
    title: gc.title,
    description: gc.description,
    alternates: { canonical: url },
    openGraph: {
      title: gc.title, description: gc.description, url,
      siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
      images: [{ url: gc.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: gc.title, description: gc.description, images: [gc.ogImage] },
  };
}

const catPaths: Record<string, string> = {
  club: '/clubs/', night: '/nights/', lounge: '/lounges/',
  room: '/rooms/', yojeong: '/yojeongs/', hoppa: '/hoppas/',
};

const catGuide: Record<string, { intro: string; tips: string[] }> = {
  night: {
    intro: '테이블 중심의 사교 문화. 웨이터가 자리를 안내한다. 복장은 깔끔하게, 신분증 필수.',
    tips: ['양주 1병이 기본 주문 단위', '테이블 위치가 경험을 좌우한다', '피크타임(22~01시) 전에 도착하면 좋은 자리'],
  },
  club: {
    intro: '서서 즐기는 플로어 중심. 드레스코드 확인 필수. 일찍 가면 대기 없이 입장.',
    tips: ['슬리퍼·운동복 입장 불가', '입장료+음료 별도인 곳 대부분', '귀중품은 최소한으로'],
  },
  lounge: {
    intro: '대화가 주인공인 공간. 볼륨 낮고 분위기 좋다. 예약 추천.',
    tips: ['시그니처 칵테일부터 시도해보자', '바 카운터는 1인 손님 환영', '주말 저녁은 예약 필수'],
  },
  room: {
    intro: '프라이빗 공간. 인원수에 맞는 사이즈를 미리 확인. 단체 모임·접대에 적합.',
    tips: ['전화로 인원·예산·목적 미리 전달', '정찰제 확인하면 가격 투명', '픽업 서비스 있는 곳도 있다'],
  },
  yojeong: {
    intro: '한정식 코스와 국악 공연. 예약제 운영. 격식을 갖추고 방문하자.',
    tips: ['사전 예약 필수 (당일 워크인 거의 불가)', '정장 또는 비즈니스 캐주얼', '알레르기 있으면 미리 알려주자'],
  },
  hoppa: {
    intro: '여성 고객을 위한 공간. 시스템을 미리 이해하면 첫 방문도 편하다.',
    tips: ['매니저가 시스템 설명해준다', '호스트 지명은 선택사항', '예산 미리 정해두면 부담 없다'],
  },
};

export default function VenueDetailPage({ params }: Props) {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return <div className="container section"><h1>페이지를 찾을 수 없습니다</h1></div>;

  const gc = generateGoldContent(venue);
  const related = getRelatedVenues(venue, 3);
  const year = new Date().getFullYear();
  const catLabel = CAT_SLUG_TO_LABEL[venue.cat_slug] || venue.category;
  const catPath = catPaths[venue.cat_slug] || '/';
  const hasPhone = !!(venue.nickname && venue.nickname_phone);
  const guide = catGuide[venue.cat_slug] || catGuide.night;

  // JSON-LD
  const localBizLd = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: venue.name,
    address: { '@type': 'PostalAddress', streetAddress: venue.address || undefined, addressLocality: venue.district, addressRegion: venue.region, addressCountry: 'KR' },
    openingHours: venue.hours || undefined,
    url: `${SITE_URL}/${venue.cat_slug}/${venue.slug}/`,
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: gc.faq.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: catLabel, item: SITE_URL + catPath },
      { '@type': 'ListItem', position: 3, name: venue.name },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* 브레드크럼 */}
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span>
          <a href={catPath} target="_blank" rel="noopener noreferrer">{catLabel}</a>
          <span>&rsaquo;</span> {venue.name}
        </div>
      </div>

      {/* 히어로 */}
      <section className="detail-hero">
        <div className="container">
          {venue.badge && <span className="venue-card-badge" style={{ marginBottom: '0.75rem' }}>{venue.badge}</span>}
          <h1>{venue.name}</h1>
          <p className="detail-tagline">{gc.tagline}</p>
          {hasPhone && (
            <p style={{ color: '#8B5CF6', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              담당: {venue.nickname}
            </p>
          )}
          <div className="detail-meta">
            <span>{venue.region}</span>
            {venue.hours && <span>{venue.hours}</span>}
          </div>
        </div>
      </section>

      {/* 서사 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>{year}년 방문 가이드</h2>
          {gc.narrative.split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: '1.25rem' }}>{p}</p>
          ))}
        </div>
      </section>

      {/* [후킹2] 중간 끊기 */}
      <div className="container"><MidContentHook /></div>

      {/* 기본 정보 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>기본 정보</h2>
          <table className="info-table">
            <tbody>
              {venue.address && <tr><th>주소</th><td>{venue.address}</td></tr>}
              {venue.hours && <tr><th>영업시간</th><td>{venue.hours}</td></tr>}
              {venue.station && <tr><th>교통</th><td>{venue.station}</td></tr>}
              {hasPhone && <tr><th>담당</th><td>{venue.nickname} ({venue.nickname_phone})</td></tr>}
              {venue.tags.length > 0 && <tr><th>태그</th><td>{venue.tags.join(', ')}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* [D] 첫 방문 가이드 */}
      <section className="detail-section" style={{ background: '#F5F5F5', padding: '2rem 0' }}>
        <div className="container narrow">
          <h2>처음 방문하세요?</h2>
          <p style={{ marginBottom: '1rem' }}>{guide.intro}</p>
          <ul className="checklist">
            <li>신분증 지참 (주민등록증·면허증·여권)</li>
            {guide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            <li>귀가 교통편 미리 확인</li>
          </ul>
        </div>
      </section>

      {/* [후킹4] AI 추천 */}
      <div className="container"><AIRecommendHook /></div>

      {/* 방문 체크리스트 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>방문 전 체크리스트</h2>
          <ul className="checklist">
            {gc.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>Q&amp;A</h2>
          {gc.faq.map((f, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q">Q. {f.q}</p>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* [E] 인기 시간대 */}
      <section className="detail-section" style={{ background: '#F5F5F5', padding: '2rem 0' }}>
        <div className="container narrow">
          <h2>인기 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { time: '평일 저녁', level: '여유', bar: '30%' },
              { time: '금요일 밤', level: '붐빔', bar: '85%' },
              { time: '토요일 밤', level: '피크', bar: '95%' },
              { time: '일요일', level: '한산', bar: '20%' },
            ].map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ minWidth: '80px', fontSize: '0.9rem', fontWeight: 600 }}>{t.time}</span>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: t.bar, background: '#8B5CF6', height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#555', minWidth: '40px' }}>{t.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 위치 안내 */}
      {(venue.address || venue.station) && (
        <section className="detail-section">
          <div className="container narrow">
            <h2>찾아가는 길</h2>
            {venue.address && <p>{venue.address}</p>}
            {venue.station && <p style={{ marginTop: '0.5rem' }}>{venue.station}</p>}
            {venue.map_url && (
              <p style={{ marginTop: '0.5rem' }}>
                <a href={venue.map_url} target="_blank" rel="noopener noreferrer">지도에서 보기 →</a>
              </p>
            )}
          </div>
        </section>
      )}

      {/* 태그 */}
      {venue.card_tags.length > 0 && (
        <section style={{ padding: '1rem 0' }}>
          <div className="container narrow">
            {venue.card_tags.map(t => (
              <span key={t} className="venue-card-tag" style={{ marginRight: '0.4rem', display: 'inline-block', marginBottom: '0.25rem' }}>{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* [후킹3] 비슷한 곳 → 메인 */}
      <div className="container"><SimilarVenuesHook /></div>

      {/* 관련 업소 */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <h2>비슷한 곳</h2>
            <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>같은 카테고리에서 추천</p>
            <div className="venue-grid">
              {related.map(v => <VenueCard key={v.slug} venue={v} />)}
            </div>
          </div>
        </section>
      )}

      {/* 읽기 진행률 */}
      <ReadingProgress />

      {/* [후킹5] 전체 비교 */}
      <div className="container"><FullCompareHook /></div>

      {/* 자동 다음 추천 */}
      <section className="section">
        <div className="container narrow">
          <AutoNext venues={related} current={venue.slug} />
        </div>
      </section>

      {/* 끝없는 추천 */}
      <section className="section">
        <div className="container narrow">
          <EndlessRecommend venues={related} />
        </div>
      </section>

      {/* 하단 여백 */}
      <div style={{ paddingBottom: hasPhone ? '80px' : '0' }} />

      {/* StickyPhoneBar */}
      {hasPhone && <StickyPhoneBar name={venue.name} nickname={venue.nickname} phone={venue.nickname_phone} />}
    </>
  );
}
