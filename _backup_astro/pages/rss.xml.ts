import type { APIRoute } from 'astro';
import venues from '../data/venues.json';
import { venueDetailPath } from '../lib/slug-utils';

const SITE = (import.meta.env.SITE ?? 'https://informationa.pages.dev').replace(/\/$/, '');
const NOW = new Date().toUTCString();

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: APIRoute = () => {
  const items = (venues as any[]).map(v => {
    const url = `${SITE}${venueDetailPath(v)}`;
    const catKo = v.category as string;
    const desc = `${v.name} — ${v.region} ${v.district} ${catKo}. ${v.card_value || ''}`.trim();
    return `    <item>
      <title>${escXml(v.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escXml(desc)}</description>
      <pubDate>${NOW}</pubDate>
      <category>${escXml(catKo)}</category>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>클럽 헌팅·나이트 부킹·라운지 만남 — 장소가 결과를 바꾼다</title>
    <link>${SITE}/</link>
    <description>괜찮은 사람 만나려면 어디로 가야 할까? 전국 클럽·나이트·라운지 이성 비율·분위기·타이밍 현장 비교</description>
    <language>ko</language>
    <lastBuildDate>${NOW}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
