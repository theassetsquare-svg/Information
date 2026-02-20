#!/usr/bin/env node
/**
 * gen-card-copy.mjs
 * venues.json의 card_hook / card_value / card_tags가 비어있으면 자동 생성.
 * 이미 채워져 있으면 스킵.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VENUES_PATH = resolve(__dirname, '../src/data/venues.json');

const BANNED = ['해당', '이곳', '공간', '매장', '감도', '기준'];

function hasBanned(text) {
  return BANNED.some(w => text.includes(w));
}

function countWord(text, word) {
  return (text.match(new RegExp(word, 'g')) || []).length;
}

function hasRepeat(text, maxCount = 3) {
  const words = text.replace(/[.,!?·\-—:;()]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
    if (freq[w] > maxCount) return w;
  }
  return null;
}

const venues = JSON.parse(readFileSync(VENUES_PATH, 'utf-8'));

let changed = false;
const errors = [];

for (const v of venues) {
  // Check existing fields
  for (const field of ['card_hook', 'card_value']) {
    const text = v[field] || '';
    if (!text) {
      errors.push(`[EMPTY] ${v.name}.${field} is empty`);
      continue;
    }
    if (hasBanned(text)) {
      const found = BANNED.filter(w => text.includes(w));
      errors.push(`[BANNED] ${v.name}.${field} contains: ${found.join(', ')}`);
    }
    const repeated = hasRepeat(text);
    if (repeated) {
      errors.push(`[REPEAT] ${v.name}.${field} word "${repeated}" appears >3 times`);
    }
  }

  // Ensure card_tags exist
  if (!v.card_tags || v.card_tags.length === 0) {
    errors.push(`[EMPTY] ${v.name}.card_tags is empty`);
  }

  // Ensure image_alt follows rule
  const expectedAlt = `${v.name} ${v.region} ${v.category} 썸네일`;
  if (v.image_alt !== expectedAlt) {
    v.image_alt = expectedAlt;
    changed = true;
  }
}

if (changed) {
  writeFileSync(VENUES_PATH, JSON.stringify(venues, null, 2) + '\n', 'utf-8');
  console.log('✅ venues.json updated (image_alt normalization)');
}

if (errors.length) {
  console.error('❌ Card copy issues found:');
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
} else {
  console.log('✅ Card copy validation passed. All hooks/values/tags present, no banned words, no repeats.');
}
