/**
 * venue-content-types.ts
 * 업장별 고유 콘텐츠 JSON 스키마
 */

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
  detail_page?: string | null;
}

export interface VenueUniqueContent {
  slug: string;

  /* Hero / Intro */
  heroTagline: string;
  introHook: string;
  introBullets: string[];
  introTeaser: string;

  /* Main body sections — titles + HTML */
  prologueTitle: string;
  prologue: string;
  scene1Title: string;
  scene1: string;
  scene2Title: string;
  scene2: string;

  /* Extra body sections */
  tipTitle: string;
  tipSection: string;
  dialogueTitle: string;
  dialogueSection: string;

  /* Structured content */
  checklistTitle: string;
  checklist: string[];
  faqItems: { q: string; a: string }[];

  /* Closing */
  outroTitle: string;
  outro: string;

  /* AI Summary bullets */
  aiSummary: string[];

  /* Quick Plan (optional for shortcode pages) */
  quickPlan?: {
    decisionTable: { label: string; optionA: string; optionB: string }[];
    scenarios: { title: string; desc: string }[];
    costNote: string;
  };
}

export interface GeneratedContent {
  aiSummary: string[];
  introHook: string;
  introBullets: string[];
  introTeaser: string;
  prologue: string;
  prologueTitle: string;
  scene1Title: string;
  scene1: string;
  scene2Title: string;
  scene2: string;
  checklist: string[];
  checklistTitle: string;
  faqItems: { q: string; a: string }[];
  outro: string;
  outroTitle: string;
  tipSection: string;
  tipTitle: string;
  dialogueSection: string;
  dialogueTitle: string;
  heroTagline: string;
  quickPlan: {
    decisionTable: { label: string; optionA: string; optionB: string }[];
    scenarios: { title: string; desc: string }[];
    costNote: string;
  };
  readingTimeMin: number;
  totalChars: number;
}
