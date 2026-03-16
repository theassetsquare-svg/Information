import venuesData from '../data/venues.json';

export interface Venue {
  name: string;
  category: string;
  cat_slug: string;
  region: string;
  region_slug: string;
  district: string;
  district_slug: string;
  slug: string;
  address: string;
  phone: string;
  hours: string;
  station: string;
  thumbnail: string;
  image_alt: string;
  badge: string | null;
  tags: string[];
  map_url: string;
  card_hook: string;
  card_value: string;
  card_tags: string[];
  keywords: string[];
  source_urls: string[];
  nickname: string;
  nickname_phone: string;
}

const venues: Venue[] = venuesData as Venue[];

export function getAllVenues(): Venue[] {
  return venues;
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find(v => v.slug === slug);
}

export function getVenuesByCategory(catSlug: string): Venue[] {
  return venues.filter(v => v.cat_slug === catSlug);
}

export function getCategories(): { slug: string; name: string; path: string; count: number }[] {
  const cats = [
    { slug: 'club', name: '클럽', path: '/clubs/' },
    { slug: 'night', name: '나이트', path: '/nights/' },
    { slug: 'lounge', name: '라운지', path: '/lounges/' },
    { slug: 'room', name: '룸', path: '/rooms/' },
    { slug: 'yojeong', name: '요정', path: '/yojeongs/' },
    { slug: 'hoppa', name: '호빠', path: '/hoppas/' },
  ];
  return cats.map(c => ({
    ...c,
    count: venues.filter(v => v.cat_slug === c.slug).length,
  }));
}

export function getRelatedVenues(venue: Venue, limit = 4): Venue[] {
  const sameCat = venues.filter(v => v.cat_slug === venue.cat_slug && v.slug !== venue.slug);
  const sameRegion = sameCat.filter(v => v.region === venue.region);
  const others = sameCat.filter(v => v.region !== venue.region);
  return [...sameRegion, ...others].slice(0, limit);
}

export const SITE_NAME = '골드나잇 가이드';
export const SITE_URL = 'https://informationa.pages.dev';
export const MAIN_SITE_URL = 'https://ilsanroom.pages.dev';

export const CAT_SLUG_TO_LABEL: Record<string, string> = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};
