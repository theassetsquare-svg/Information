import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('hoppa');
const venues = getVenuesByCategory('hoppa');

export const metadata: Metadata = {
  title: cat.title,
  description: cat.description,
  alternates: { canonical: SITE_URL + '/hoppas/' },
  openGraph: {
    title: cat.title, description: cat.description,
    url: SITE_URL + '/hoppas/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/hoppas.png', width: 1200, height: 630 }],
  },
};

const regions = [...new Set(venues.map(v => v.region))];

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span> 호빠
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '600px', marginBottom: '1rem' }}>{cat.intro}</p>
        <p style={{ maxWidth: '600px', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {year}년 기준 {venues.length}곳을 정리했다.
        </p>

        {regions.map(region => {
          const rv = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {region} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rv.length}곳</span>
              </h2>
              <div className="venue-grid">
                {rv.map(v => <VenueCard key={v.slug} venue={v} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
