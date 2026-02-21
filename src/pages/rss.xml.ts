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
    <title>전국 클럽·나이트·라운지 디렉토리</title>
    <link>${SITE}/</link>
    <description>서울 강남 클럽, 홍대 클럽, 나이트클럽, 라운지바를 현장 확인 토대로 비교하는 2026 나이트라이프 가이드</description>
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
