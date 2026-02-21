#!/usr/bin/env node
/**
 * Search index verification — asserts store_name queries return ≥ 1 result.
 * Mirrors the client-side search logic from index.astro.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const venues = JSON.parse(readFileSync(join(__dirname, '../src/data/venues.json'), 'utf-8'));

// ── Normalize (same as client) ──
function norm(s) { return (s || '').trim().toLowerCase().replace(/\s+/g, ''); }

// ── Build index (same as client) ──
const searchIndex = venues.map(v => {
  const tokens = [v.name, v.region, v.district, v.category];
  if (v.keywords) tokens.push(...v.keywords);
  if (v.tags) tokens.push(...v.tags);
  if (v.card_tags) tokens.push(...v.card_tags);
  return {
    venue: v,
    raw: tokens.join(' ').toLowerCase(),
    norm: tokens.map(norm).join(' ')
  };
});

function searchVenues(query) {
  const q = query.trim().toLowerCase();
  const qNorm = norm(query);
  if (!q) return [];
  const exact = [], partial = [];
  for (const entry of searchIndex) {
    const v = entry.venue;
    const nameLower = v.name.toLowerCase();
    const nameNorm = norm(v.name);
    if (nameLower === q || nameNorm === qNorm) {
      exact.push(v);
    } else if (nameLower.indexOf(q) !== -1 || nameNorm.indexOf(qNorm) !== -1) {
      partial.unshift(v);
    } else if (entry.raw.indexOf(q) !== -1 || entry.norm.indexOf(qNorm) !== -1) {
      partial.push(v);
    }
  }
  return exact.concat(partial);
}

// ── Test cases ──
let pass = 0, fail = 0;

function assert(query, expectName) {
  const results = searchVenues(query);
  const found = results.length > 0;
  const nameMatch = expectName ? results.some(r => r.name === expectName) : true;
  if (found && nameMatch) {
    pass++;
  } else {
    fail++;
    console.error(`FAIL: "${query}" → ${results.length} results${expectName ? `, expected "${expectName}" but got [${results.map(r=>r.name).join(', ')}]` : ''}`);
  }
}

// 1. Exact store names
assert('Octagon', 'Octagon');
assert('Club RACE', 'Club RACE');
assert('Faust', 'Faust');
assert('SABOTAGE', 'SABOTAGE');
assert('B1', 'B1');

// 2. Lowercase / mixed case
assert('octagon', 'Octagon');
assert('club race', 'Club RACE');
assert('faust', 'Faust');

// 3. No-space variants
assert('clubrace', 'Club RACE');
assert('clubarte', 'Club ARTE');

// 4. Korean keyword aliases
assert('옥타곤', 'Octagon');
assert('클럽레이스', 'Club RACE');

// 5. Region search
assert('서울');
assert('부산');
assert('대구');
assert('제주');

// 6. Category search
assert('클럽');
assert('나이트');
assert('라운지');

// 7. Tag search
assert('EDM');
assert('테크노');
assert('힙합');

// 8. All 59 venues searchable by exact name
let allNamesPass = 0;
for (const v of venues) {
  const r = searchVenues(v.name);
  if (r.length > 0 && r[0].name === v.name) {
    allNamesPass++;
  } else {
    fail++;
    console.error(`FAIL: Exact name "${v.name}" not found as first result`);
  }
}

console.log(`\n── Search Test Results ──`);
console.log(`Named tests: ${pass} passed`);
console.log(`All-names:   ${allNamesPass}/${venues.length} passed`);
console.log(`Failures:    ${fail}`);

if (fail > 0) {
  process.exit(1);
} else {
  console.log('\n✓ ALL SEARCH TESTS PASSED');
}
