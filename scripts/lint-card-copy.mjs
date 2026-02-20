#!/usr/bin/env node
/**
 * lint-card-copy.mjs
 * Scans venues.json for banned words and excessive repetition.
 * Exit 1 on any failure.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VENUES_PATH = resolve(__dirname, '../src/data/venues.json');

const BANNED = ['해당', '이곳', '공간', '매장', '감도', '기준'];
const MAX_REPEAT = 3;

const venues = JSON.parse(readFileSync(VENUES_PATH, 'utf-8'));
const errors = [];

for (const v of venues) {
  const texts = {
    card_hook: v.card_hook || '',
    card_value: v.card_value || '',
    card_tags: (v.card_tags || []).join(' ')
  };

  for (const [field, text] of Object.entries(texts)) {
    if (!text) {
      errors.push(`[EMPTY] ${v.name}.${field}`);
      continue;
    }

    // Banned word check
    for (const banned of BANNED) {
      if (text.includes(banned)) {
        errors.push(`[BANNED] ${v.name}.${field} => "${banned}"`);
      }
    }

    // Repetition check (for hook and value only)
    if (field === 'card_tags') continue;
    const words = text.replace(/[.,!?·\-—:;()"']/g, ' ').split(/\s+/).filter(w => w.length >= 2);
    const freq = {};
    for (const w of words) {
      freq[w] = (freq[w] || 0) + 1;
    }
    for (const [word, count] of Object.entries(freq)) {
      if (count > MAX_REPEAT) {
        errors.push(`[REPEAT] ${v.name}.${field} => "${word}" x${count}`);
      }
    }
  }

  // Store name position check (if name appears in hook/value, must be at start)
  for (const field of ['card_hook', 'card_value']) {
    const text = v[field] || '';
    if (text.includes(v.name) && !text.startsWith(v.name)) {
      errors.push(`[NAME_POS] ${v.name}.${field} => store name not at sentence start`);
    }
  }
}

if (errors.length) {
  console.error(`❌ Lint failed with ${errors.length} issue(s):`);
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
} else {
  console.log(`✅ Lint passed: ${venues.length} venues, 0 issues.`);
}
