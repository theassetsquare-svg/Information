import { MetadataRoute } from 'next';
import { getAllVenues, SITE_URL } from '../lib/venues';

export default function sitemap(): MetadataRoute.Sitemap {
  const venues = getAllVenues();
  const now = new Date().toISOString();

  const staticPages = [
    { url: SITE_URL + '/', lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: SITE_URL + '/clubs/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/nights/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: SITE_URL + '/lounges/', lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
  ];

  const venuePages = venues.map(v => ({
    url: `${SITE_URL}/${v.cat_slug}/${v.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...venuePages];
}
