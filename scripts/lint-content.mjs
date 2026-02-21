#!/usr/bin/env npx tsx
/**
 * lint-content — Phase 7 automated content validation
 * Checks every detail-page venue for:
 *   1. Banned words: 해당, 이곳, 공간, 매장, 감도, 기준
 *   2. 8-word repeated phrases
 *   3. FAQ opener diversity (no duplicate first-word pattern)
 *   4. STORE_NAME mention count (target: 8–10)
 *   5. AI Summary present (6–10 bullets)
 *   6. Quick Plan present
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { generateAllContent, nameHash } from '../src/lib/venue-content.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const venues = JSON.parse(readFileSync(join(__dirname, '../src/data/venues.json'), 'utf-8'));

// Only venues that generate detail pages (no custom detail_page)
const detailVenues = venues.filter(v => !v.detail_page);

const BANNED = ['해당', '이곳', '공간', '매장', '감도', '기준'];
let totalFails = 0;
let totalPass = 0;
const failures = [];

for (let i = 0; i < detailVenues.length; i++) {
  const v = detailVenues[i];
  const idx = venues.findIndex(x => x.slug === v.slug);
  const content = generateAllContent(v, idx);
  const errors = [];

  // ── Gather all text ──
  const stripHtml = s => (s || '').replace(/<[^>]*>/g, '');

  const allTextParts = [
    ...content.aiSummary,
    content.introHook,
    ...content.introBullets,
    content.introTeaser,
    content.prologue,
    content.scene1Title,
    content.scene1,
    content.scene2,
    ...content.checklist,
    ...content.faqItems.map(f => f.q + ' ' + f.a),
    content.outro,
    content.tipSection,
    content.dialogueSection,
    ...content.quickPlan.decisionTable.map(r => r.label + ' ' + r.optionA + ' ' + r.optionB),
    ...content.quickPlan.scenarios.map(s => s.title + ' ' + s.desc),
    content.quickPlan.costNote,
  ];
  const plainText = allTextParts.map(stripHtml).join(' ');

  // ── 1. Banned words ──
  for (const word of BANNED) {
    const regex = new RegExp(word, 'g');
    const matches = plainText.match(regex);
    if (matches) {
      errors.push(`BANNED "${word}" x${matches.length}`);
    }
  }

  // ── 2. 8-word repeated phrases ──
  const words = plainText.replace(/[.,!?·…\-–—""''「」『』\(\)]/g, ' ').split(/\s+/).filter(Boolean);
  const phraseMap = new Map();
  for (let w = 0; w + 7 < words.length; w++) {
    const phrase = words.slice(w, w + 8).join(' ');
    phraseMap.set(phrase, (phraseMap.get(phrase) || 0) + 1);
  }
  for (const [phrase, count] of phraseMap) {
    if (count > 1) {
      errors.push(`REPEAT (8-word): "${phrase.slice(0, 40)}..." x${count}`);
    }
  }

  // ── 3. FAQ opener diversity ──
  const openerSet = new Set();
  let openerDupes = 0;
  for (const faq of content.faqItems) {
    // First 2 characters of the question as opener key
    const opener = faq.q.replace(/^[Q\d.:?\s]+/, '').slice(0, 2);
    if (openerSet.has(opener)) {
      openerDupes++;
    }
    openerSet.add(opener);
  }
  if (openerDupes > 2) {
    errors.push(`FAQ_OPENER_DIVERSITY: ${openerDupes} duplicate openers`);
  }

  // ── 4. STORE_NAME count ──
  const nameRegex = new RegExp(v.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const nameMatches = plainText.match(nameRegex);
  const nameCount = nameMatches ? nameMatches.length : 0;
  if (nameCount < 8) {
    errors.push(`STORE_NAME count=${nameCount} (min 8)`);
  } else if (nameCount > 10) {
    errors.push(`STORE_NAME count=${nameCount} (max 10)`);
  }

  // ── 5. AI Summary check ──
  if (!content.aiSummary || content.aiSummary.length < 6) {
    errors.push(`AI_SUMMARY: only ${content.aiSummary?.length || 0} bullets (need 6-10)`);
  } else if (content.aiSummary.length > 10) {
    errors.push(`AI_SUMMARY: ${content.aiSummary.length} bullets (max 10)`);
  }

  // ── 6. Quick Plan check ──
  if (!content.quickPlan) {
    errors.push('QUICK_PLAN: missing');
  } else {
    if (!content.quickPlan.decisionTable || content.quickPlan.decisionTable.length < 3) {
      errors.push(`QUICK_PLAN: decision table has ${content.quickPlan.decisionTable?.length || 0} rows (need ≥3)`);
    }
    if (!content.quickPlan.scenarios || content.quickPlan.scenarios.length !== 3) {
      errors.push(`QUICK_PLAN: ${content.quickPlan.scenarios?.length || 0} scenarios (need 3)`);
    }
  }

  // ── 7. FAQ count ──
  if (content.faqItems.length < 10) {
    errors.push(`FAQ_COUNT: ${content.faqItems.length} (need 10-14)`);
  } else if (content.faqItems.length > 14) {
    errors.push(`FAQ_COUNT: ${content.faqItems.length} (max 14)`);
  }

  // ── Report ──
  if (errors.length > 0) {
    totalFails++;
    failures.push({ name: v.name, slug: v.slug, errors });
  } else {
    totalPass++;
  }
}

// ── Summary ──
console.log('\n═══════════════════════════════════════');
console.log('  CONTENT LINT — Phase 7 Validation');
console.log('═══════════════════════════════════════\n');

if (failures.length > 0) {
  for (const f of failures) {
    console.log(`FAIL  ${f.name} (${f.slug})`);
    for (const e of f.errors) {
      console.log(`  ✗ ${e}`);
    }
  }
  console.log('');
}

console.log(`Total: ${detailVenues.length} venues | ${totalPass} PASS | ${totalFails} FAIL`);

if (totalFails > 0) {
  console.log('\n⚠ Some venues failed lint checks. Review errors above.');
  process.exit(1);
} else {
  console.log('\n✓ All venues passed lint checks.');
  process.exit(0);
}
