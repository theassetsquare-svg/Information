import type { APIRoute } from 'astro';
import venues from '../data/venues.json';
import { venueDetailPath } from '../lib/slug-utils';

const SITE = (import.meta.env.SITE ?? 'https://informationa.pages.dev').replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

function urlEntry(loc: string, priority: string): string {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = () => {
  const entries: string[] = [];

  // 1. Homepage
  entries.push(urlEntry('/', '1.0'));

  // 2. Category pages
  entries.push(urlEntry('/clubs/', '0.9'));
  entries.push(urlEntry('/nights/', '0.9'));
  entries.push(urlEntry('/lounges/', '0.9'));

  // 3 & 4. Venue detail pages (deduped URLs)
  for (const v of venues as any[]) {
    entries.push(urlEntry(venueDetailPath(v), '0.8'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
