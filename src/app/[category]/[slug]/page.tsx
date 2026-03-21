import type { Metadata } from 'next';
import { getAllVenues, getVenueBySlug, getRelatedVenues, SITE_URL, CAT_SLUG_TO_LABEL } from '../../../lib/venues';
import { generateGoldContent, SITE_NAME } from '../../../lib/gold-content';
import VenueCard from '../../../components/VenueCard';
import StickyPhoneBar from '../../../components/StickyPhoneBar';
import { ReadingProgress, AutoNext, EndlessRecommend, FOMOCounter, BlurReveal } from '../../../components/AddictionEngine';
import { MidContentHook, SimilarVenuesHook, AIRecommendHook, FullCompareHook } from '../../../components/HookingCTAs';
import RecentTracker from '../../../components/RecentTracker';

interface Props { params: { category: string; slug: string } }

export function generateStaticParams() {
  return getAllVenues().map(v => ({ category: v.cat_slug, slug: v.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return { title: '페이지를 찾을 수 없습니다' };
  const allV = getAllVenues();
  const vIdx = allV.findIndex(v => v.slug === params.slug);
  const gc = generateGoldContent(venue, vIdx);
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


export default function VenueDetailPage({ params }: Props) {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return <div className="container section"><h1>페이지를 찾을 수 없습니다</h1></div>;

  const allV = getAllVenues();
  const vIdx = allV.findIndex(v => v.slug === venue.slug);
  const gc = generateGoldContent(venue, vIdx);
  const related = getRelatedVenues(venue, 3);
  const year = new Date().getFullYear();
  const catLabel = CAT_SLUG_TO_LABEL[venue.cat_slug] || venue.category;
  const catPath = catPaths[venue.cat_slug] || '/';
  const hasPhone = !!(venue.nickname && venue.nickname_phone);

  // 카테고리 단어 필터 (키워드 스터핑 방지)
  const catWord = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' }[venue.cat_slug] || '';
  const filteredTags = venue.tags.filter(t => !t.includes(catWord) && t !== venue.category);
  const filteredCardTags = venue.card_tags.filter(t => !t.includes(catWord) && t !== venue.category);

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

      {/* 방문 기록 저장 (개인화 추천용) */}
      <RecentTracker slug={venue.slug} />

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
            <p style={{ color: '#6D28D9', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              담당: {venue.nickname}
            </p>
          )}
          <div className="detail-meta">
            <span>{venue.region}</span>
            {venue.hours && <span>{venue.hours}</span>}
          </div>
          <div style={{ marginTop: '0.75rem' }}><FOMOCounter /></div>
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
              {filteredTags.length > 0 && <tr><th>태그</th><td>{filteredTags.join(', ')}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* [D] 첫 방문 가이드 */}
      <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
        <div className="container narrow">
          <h2>처음 방문하세요?</h2>
          <p style={{ marginBottom: '1rem' }}>{gc.guide.intro}</p>
          <ul className="checklist">
            <li>신분증 지참 (주민등록증·면허증·여권)</li>
            {gc.guide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
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

      {/* FAQ — BlurReveal로 클릭 유도 */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>Q&amp;A</h2>
          <BlurReveal label="전체 Q&A 보기">
            {gc.faq.map((f, i) => (
              <div key={i} className="faq-item">
                <p className="faq-q">Q. {f.q}</p>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </BlurReveal>
        </div>
      </section>

      {/* [E] 인기 시간대 */}
      <section className="detail-section" style={{ background: '#F7F7F8', padding: '2rem 0' }}>
        <div className="container narrow">
          <h2>인기 시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {gc.timeSlots.map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ minWidth: '80px', fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{t.time}</span>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: t.bar, background: '#8B5CF6', height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#666', minWidth: '40px' }}>{t.level}</span>
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

      {/* 태그 (카테고리 단어 제외 — 스터핑 방지) */}
      {filteredCardTags.length > 0 && (
        <section style={{ padding: '1rem 0' }}>
          <div className="container narrow">
            {filteredCardTags.map(t => (
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
            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>같은 카테고리에서 추천</p>
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
