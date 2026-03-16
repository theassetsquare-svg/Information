import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import VenueCard from '../../components/VenueCard';

const cat = getCategoryContent('club');
const venues = getVenuesByCategory('club');

export const metadata: Metadata = {
  title: cat.title,
  description: cat.description,
  alternates: { canonical: SITE_URL + '/clubs/' },
  openGraph: {
    title: cat.title, description: cat.description,
    url: SITE_URL + '/clubs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/images/og-thumb.jpg', width: 1200, height: 630 }],
  },
};

/* 지역별 그룹핑으로 키워드 분산 */
const regions = [...new Set(venues.map(v => v.region))];

export default function ClubsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>›</span> 클럽
        </div>
        <h1 style={{ marginTop: '1rem' }}>{cat.heading}</h1>
        <p style={{ maxWidth: '600px', marginBottom: '2rem' }}>{cat.intro}</p>

        {regions.map(region => {
          const regionVenues = venues.filter(v => v.region === region);
          return (
            <div key={region} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {region} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{regionVenues.length}곳</span>
              </h2>
              <div className="venue-grid">
                {regionVenues.map(v => <VenueCard key={v.slug} venue={v} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
