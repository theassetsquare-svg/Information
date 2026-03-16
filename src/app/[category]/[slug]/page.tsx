import type { Metadata } from 'next';
import { getAllVenues, getVenueBySlug, getRelatedVenues, SITE_URL } from '../../../lib/venues';
import { generateGoldContent, SITE_NAME } from '../../../lib/gold-content';
import { loadVenueContent, stripHtml } from '../../../lib/venue-loader';
import VenueCard from '../../../components/VenueCard';

interface Props {
  params: { category: string; slug: string };
}

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

export default function VenueDetailPage({ params }: Props) {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return <div className="container section"><h1>페이지를 찾을 수 없습니다</h1></div>;

  const gc = generateGoldContent(venue);
  const vc = loadVenueContent(venue.slug);
  const related = getRelatedVenues(venue, 3);
  const catLabel = venue.cat_slug === 'club' ? '클럽' : venue.cat_slug === 'night' ? '나이트' : '라운지';
  const catPlural = venue.cat_slug + 's';

  const localBizLd = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: venue.name,
    address: { '@type': 'PostalAddress', streetAddress: venue.address, addressLocality: venue.district, addressRegion: venue.region, addressCountry: 'KR' },
    openingHours: venue.hours,
    url: `${SITE_URL}/${venue.cat_slug}/${venue.slug}/`,
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: (vc?.faqItems || gc.faq).slice(0, 6).map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof f.a === 'string' ? f.a : '' },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: catLabel, item: `${SITE_URL}/${catPlural}/` },
      { '@type': 'ListItem', position: 3, name: venue.name },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>›</span>
          <a href={`/${catPlural}/`} target="_blank" rel="noopener noreferrer">{catLabel}</a>
          <span>›</span> {venue.name}
        </div>
      </div>

      {/* 히어로 */}
      <section className="detail-hero">
        <div className="container">
          {venue.badge && <span className="venue-card-badge" style={{ marginBottom: '0.75rem' }}>{venue.badge}</span>}
          <h1>{venue.name}</h1>
          <p className="detail-tagline">{gc.tagline}</p>
          <div className="detail-meta">
            <span>{venue.region} {venue.district}</span>
            <span>{catLabel}</span>
            <span>{venue.hours}</span>
          </div>
        </div>
      </section>

      {/* 고유 서사 (gold-content 생성) */}
      <section className="detail-section">
        <div className="container narrow">
          {gc.narrative.split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: '1.25rem' }}>{p}</p>
          ))}
        </div>
      </section>

      {/* 기존 venue-content 고유 콘텐츠 렌더링 */}
      {vc && (
        <>
          {/* 프롤로그 */}
          {vc.prologue && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.prologueTitle}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.prologue }} />
              </div>
            </section>
          )}

          {/* 씬 1 */}
          {vc.scene1 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.scene1Title}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.scene1 }} />
              </div>
            </section>
          )}

          {/* 씬 2 */}
          {vc.scene2 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.scene2Title}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.scene2 }} />
              </div>
            </section>
          )}

          {/* AI 요약 */}
          {vc.aiSummary && vc.aiSummary.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>핵심 요약</h2>
                <ul className="checklist">
                  {vc.aiSummary.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 실전 팁 */}
          {vc.tipSection && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.tipTitle}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.tipSection }} />
              </div>
            </section>
          )}

          {/* 후기/대화 */}
          {vc.dialogueSection && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.dialogueTitle}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.dialogueSection }} />
              </div>
            </section>
          )}

          {/* 체크리스트 */}
          {vc.checklist && vc.checklist.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.checklistTitle}</h2>
                <ul className="checklist">
                  {vc.checklist.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* FAQ (venue-content 버전) */}
          {vc.faqItems && vc.faqItems.length > 0 && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>Q&amp;A</h2>
                {vc.faqItems.map((f, i) => (
                  <div key={i} className="faq-item">
                    <p className="faq-q">Q. {f.q}</p>
                    <p className="faq-a">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 퀵 플랜 */}
          {vc.quickPlan && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>빠른 결정표</h2>
                {vc.quickPlan.decisionTable && (
                  <table className="info-table" style={{ marginBottom: '1.5rem' }}>
                    <thead>
                      <tr>
                        <th>항목</th>
                        <th>옵션 A</th>
                        <th>옵션 B</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vc.quickPlan.decisionTable.map((row, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{row.label}</td>
                          <td>{row.optionA}</td>
                          <td>{row.optionB}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {vc.quickPlan.scenarios && vc.quickPlan.scenarios.map((s, i) => (
                  <div key={i} style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
                  </div>
                ))}
                {vc.quickPlan.costNote && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                    💰 {vc.quickPlan.costNote}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* 아웃로 */}
          {vc.outro && (
            <section className="detail-section">
              <div className="container narrow">
                <h2>{vc.outroTitle}</h2>
                <div dangerouslySetInnerHTML={{ __html: vc.outro }} />
              </div>
            </section>
          )}
        </>
      )}

      {/* venue-content가 없는 경우 fallback */}
      {!vc && (
        <>
          <section className="detail-section">
            <div className="container narrow">
              <h2>기본 정보</h2>
              <table className="info-table">
                <tbody>
                  <tr><th>주소</th><td>{venue.address}</td></tr>
                  <tr><th>운영</th><td>{venue.hours}</td></tr>
                  <tr><th>교통</th><td>{venue.station}</td></tr>
                  <tr><th>지도</th><td><a href={venue.map_url} target="_blank" rel="noopener noreferrer">지도 보기 →</a></td></tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className="detail-section">
            <div className="container narrow">
              <h2>방문 팁</h2>
              <ul className="checklist">
                {gc.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </section>
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
        </>
      )}

      {/* 기본 정보 (항상 표시) */}
      <section className="detail-section">
        <div className="container narrow">
          <h2>찾아가는 길</h2>
          <p>{venue.address}</p>
          <p style={{ marginTop: '0.5rem' }}>{venue.station}</p>
          <p style={{ marginTop: '0.5rem' }}>
            <a href={venue.map_url} target="_blank" rel="noopener noreferrer">
              네이버 지도에서 보기 →
            </a>
          </p>
          <div style={{ marginTop: '1rem' }}>
            {venue.card_tags.map(t => (
              <span key={t} className="venue-card-tag" style={{ marginRight: '0.4rem', display: 'inline-block', marginBottom: '0.25rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 관련 */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <h2>비슷한 곳</h2>
            <div className="venue-grid" style={{ marginTop: '1rem' }}>
              {related.map(v => <VenueCard key={v.slug} venue={v} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
