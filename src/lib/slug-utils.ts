/**
 * slug-utils.ts
 * URL path deduplication guard + canonical builder
 */

const SITE = 'https://informationa.pages.dev';

/**
 * Normalize a slug: lowercase, trim, remove duplicate tokens.
 * "seoul-gangnam-gangnam-club" → "seoul-gangnam-club"
 */
export function normalizeSlug(raw: string): string {
  const tokens = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-');

  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const t of tokens) {
    if (!t) continue;
    if (!seen.has(t)) {
      seen.add(t);
      deduped.push(t);
    }
  }
  return deduped.join('-');
}

/**
 * Build a canonical URL from path segments.
 * Ensures trailing slash, absolute URL, no duplicate segments.
 */
export function buildCanonical(
  siteUrl: string = SITE,
  ...segments: string[]
): string {
  const base = siteUrl.replace(/\/$/, '');
  const path = segments
    .map(s => s.replace(/^\/|\/$/g, ''))
    .filter(Boolean)
    .join('/');
  return path ? `${base}/${path}/` : `${base}/`;
}

/**
 * Deduplicate path segments (e.g., /club/seoul/seoul/ → /club/seoul/)
 */
export function dedupePathSegments(urlPath: string): string {
  const segments = urlPath.split('/').filter(Boolean);
  const deduped: string[] = [];
  for (const seg of segments) {
    if (deduped.length === 0 || deduped[deduped.length - 1] !== seg) {
      deduped.push(seg);
    }
  }
  return '/' + deduped.join('/') + '/';
}

/**
 * Deduplicate venue URL path params.
 * Rule 1: Strip region prefix from district (busanjin→jin when region=busan)
 * Rule 2: Strip cat token from hyphenated slug (sky-lounge→sky when cat=lounge)
 */
export function dedupeVenuePathParams(
  cat_slug: string,
  region_slug: string,
  district_slug: string,
  slug: string
): { district: string; slug: string } {
  let d = district_slug;
  if (d.startsWith(region_slug) && d.length > region_slug.length) {
    d = d.slice(region_slug.length);
  }

  let s = slug;
  const tokens = s.split('-');
  if (tokens.includes(cat_slug) && tokens.length > 1) {
    s = tokens.filter(t => t !== cat_slug).join('-');
  }

  return { district: d, slug: s };
}

/**
 * Build a venue detail URL path with deduplication applied.
 * Returns detail_page if set, otherwise deduped dynamic path.
 */
export function venueDetailPath(v: {
  cat_slug: string;
  region_slug: string;
  district_slug: string;
  slug: string;
  detail_page?: string | null;
}): string {
  if (v.detail_page) return v.detail_page;
  const dd = dedupeVenuePathParams(v.cat_slug, v.region_slug, v.district_slug, v.slug);
  return `/${v.cat_slug}/${v.region_slug}/${dd.district}/${dd.slug}/`;
}
