#!/usr/bin/env node
/**
 * Full site audit — banned words, phone numbers, target="_blank", og:image, etc.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://informationa.pages.dev';
const BANNED = ['해당', '이곳', '공간', '매장', '감도', '기준'];
const PHONE_RE = /\b0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g;

function findHtml(dir, list = []) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) findHtml(p, list);
    else if (f.name === 'index.html') list.push(p);
  }
  return list;
}

function stripTags(html) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
             .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/&[a-z]+;/gi, ' ')
             .replace(/\s+/g, ' ').trim();
}

const files = findHtml(DIST);
const issues = [];
let totalIssues = 0;

for (const file of files) {
  const rel = file.replace(DIST, '/').replace('/index.html', '/') || '/';
  const html = readFileSync(file, 'utf-8');
  const text = stripTags(html);
  const pageIssues = [];

  // 1. Banned words
  for (const w of BANNED) {
    // Check in text content only (not in CSS/JS)
    const textCount = (text.match(new RegExp(w, 'g')) || []).length;
    if (textCount > 0) {
      pageIssues.push(`BANNED_WORD: "${w}" x${textCount}`);
    }
  }

  // 2. Phone numbers in visible text
  const phones = text.match(PHONE_RE) || [];
  if (phones.length > 0) {
    pageIssues.push(`PHONE: ${phones.join(', ')}`);
  }

  // 3. OG image check (detail pages only)
  if (rel !== '/' && !rel.endsWith('s/')) {
    const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (!ogMatch) {
      pageIssues.push('OG_IMAGE: missing');
    } else if (!ogMatch[1].startsWith('http')) {
      pageIssues.push(`OG_IMAGE: not absolute URL (${ogMatch[1]})`);
    }
  }

  // 4. Links missing target="_blank" (cards and CTAs only, not all links)
  // Check <a> with class="btn" or inside venue-grid/related
  const btnLinks = html.match(/<a[^>]*class="[^"]*btn[^"]*"[^>]*>/g) || [];
  for (const link of btnLinks) {
    if (!link.includes('target="_blank"') && !link.includes('href="#')) {
      const href = link.match(/href="([^"]+)"/)?.[1] || '';
      if (href && !href.startsWith('#')) {
        pageIssues.push(`NO_BLANK: btn link ${href.slice(0,40)}`);
      }
    }
  }

  // 5. Map button check (detail pages)
  if (rel !== '/' && !rel.endsWith('s/')) {
    if (!html.includes('지도에서 보기') && !html.includes('지도에서 위치')) {
      pageIssues.push('MAP_BUTTON: missing');
    }
  }

  // 6. URL duplicate token check
  const parts = rel.split('/').filter(Boolean);
  const dupes = parts.filter((p, i) => parts.indexOf(p) !== i);
  if (dupes.length > 0) {
    pageIssues.push(`URL_DUPE: ${dupes.join(',')}`);
  }

  // 7. JSON-LD check (detail pages)
  if (rel !== '/' && !rel.endsWith('s/')) {
    if (!html.includes('application/ld+json')) {
      pageIssues.push('JSONLD: missing');
    }
  }

  if (pageIssues.length > 0) {
    issues.push({ url: rel, problems: pageIssues });
    totalIssues += pageIssues.length;
  }
}

console.log(`\n=== FULL AUDIT REPORT ===`);
console.log(`Pages scanned: ${files.length}`);
console.log(`Pages with issues: ${issues.length}`);
console.log(`Total issues: ${totalIssues}\n`);

for (const { url, problems } of issues) {
  console.log(`[${url}]`);
  for (const p of problems) console.log(`  ❌ ${p}`);
}

if (totalIssues === 0) {
  console.log('✅ ALL CHECKS PASSED');
}
