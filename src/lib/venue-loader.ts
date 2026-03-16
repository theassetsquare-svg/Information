/* 기존 venue-content JSON을 로드하는 헬퍼 */

export interface VenueContent {
  slug: string;
  heroTagline: string;
  introHook: string;
  introBullets: string[];
  introTeaser: string;
  prologueTitle: string;
  prologue: string;
  scene1Title: string;
  scene1: string;
  scene2Title: string;
  scene2: string;
  tipTitle: string;
  tipSection: string;
  dialogueTitle: string;
  dialogueSection: string;
  checklistTitle: string;
  checklist: string[];
  faqItems: { q: string; a: string }[];
  outroTitle: string;
  outro: string;
  aiSummary: string[];
  quickPlan: {
    decisionTable: { label: string; optionA: string; optionB: string }[];
    scenarios: { title: string; desc: string }[];
    costNote: string;
  };
}

const contentCache: Record<string, VenueContent | null> = {};

export function loadVenueContent(slug: string): VenueContent | null {
  if (slug in contentCache) return contentCache[slug];

  try {
    // Dynamic require at build time
    const content = require(`../data/venue-content/${slug}.json`) as VenueContent;
    contentCache[slug] = content;
    return content;
  } catch {
    contentCache[slug] = null;
    return null;
  }
}

/* HTML 태그 제거 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
