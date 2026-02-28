/**
 * Content Similarity Analysis for Venue Detail Pages
 *
 * Extracts visible text from HTML pages, computes Korean 2-gram (bigram)
 * Jaccard similarity between all page pairs, and reports statistics.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const DIST_DIR = '/home/user/sunwook/dist';

// ── 1. Find all venue detail page HTML files ──────────────────────────────
function findVenuePages(baseDir) {
  const pages = [];
  const categories = ['club', 'lounge', 'night'];

  function walk(dir, depth) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch { return; }
    for (const entry of entries) {
      const full = join(dir, entry);
      let stat;
      try { stat = statSync(full); } catch { continue; }
      if (stat.isDirectory()) {
        walk(full, depth + 1);
      } else if (entry === 'index.html' && depth >= 4) {
        // e.g. dist/club/seoul/gangnam/octagon/index.html  (depth from dist = 4+)
        pages.push(full);
      }
    }
  }

  for (const cat of categories) {
    const catDir = join(baseDir, cat);
    walk(catDir, 1);
  }
  return pages;
}

// ── 2. Extract visible text from HTML ─────────────────────────────────────
function extractVisibleText(html) {
  // Remove script tags and their content
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove style tags and their content
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#10003;/g, '')
    .replace(/&#\d+;/g, '');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// ── 3. Extract Korean bigrams from text ───────────────────────────────────
function extractKoreanBigrams(text) {
  // Keep only Korean characters (Hangul syllables + Jamo)
  const korean = text.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g, '');
  const bigrams = new Set();
  for (let i = 0; i < korean.length - 1; i++) {
    bigrams.add(korean[i] + korean[i + 1]);
  }
  return bigrams;
}

// ── 4. Jaccard similarity ─────────────────────────────────────────────────
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return (intersection / union) * 100;
}

// ── 5. Friendly label for a page path ─────────────────────────────────────
function pageLabel(filePath) {
  // e.g. /home/user/sunwook/dist/club/seoul/gangnam/octagon/index.html
  //   → club/seoul/gangnam/octagon
  const rel = relative(DIST_DIR, filePath);
  return rel.replace(/\/index\.html$/, '');
}

// ── Main ──────────────────────────────────────────────────────────────────
const pages = findVenuePages(DIST_DIR);
console.log(`Found ${pages.length} venue detail pages\n`);

// Extract text and bigrams for each page
const pageData = pages.map(p => {
  const html = readFileSync(p, 'utf-8');
  const text = extractVisibleText(html);
  const bigrams = extractKoreanBigrams(text);
  return { path: p, label: pageLabel(p), text, bigrams, charCount: text.length, bigramCount: bigrams.size };
});

// Print per-page stats
console.log('── Per-page stats ──');
console.log(`${'Page'.padEnd(50)} | Chars  | Bigrams`);
console.log('-'.repeat(80));
for (const pd of pageData.sort((a, b) => a.label.localeCompare(b.label))) {
  console.log(`${pd.label.padEnd(50)} | ${String(pd.charCount).padStart(6)} | ${String(pd.bigramCount).padStart(7)}`);
}

// Compute pairwise similarities
const pairs = [];
for (let i = 0; i < pageData.length; i++) {
  for (let j = i + 1; j < pageData.length; j++) {
    const sim = jaccardSimilarity(pageData[i].bigrams, pageData[j].bigrams);
    pairs.push({
      a: pageData[i].label,
      b: pageData[j].label,
      similarity: sim
    });
  }
}

console.log(`\n── Pairwise comparison: ${pairs.length} pairs total ──\n`);

// Sort by similarity descending
pairs.sort((a, b) => b.similarity - a.similarity);

// Average similarity
const avgSim = pairs.reduce((sum, p) => sum + p.similarity, 0) / pairs.length;
console.log(`Average similarity across all pairs: ${avgSim.toFixed(2)}%\n`);

// Top 20 most similar pairs
console.log('── Top 20 most similar page pairs ──');
console.log(`${'Rank'.padStart(4)} | ${'Page A'.padEnd(40)} | ${'Page B'.padEnd(40)} | Sim %`);
console.log('-'.repeat(135));
for (let i = 0; i < Math.min(20, pairs.length); i++) {
  const p = pairs[i];
  console.log(`${String(i + 1).padStart(4)} | ${p.a.padEnd(40)} | ${p.b.padEnd(40)} | ${p.similarity.toFixed(2)}%`);
}

// Bottom 10 least similar
console.log('\n── Bottom 10 least similar page pairs ──');
console.log(`${'Rank'.padStart(4)} | ${'Page A'.padEnd(40)} | ${'Page B'.padEnd(40)} | Sim %`);
console.log('-'.repeat(135));
for (let i = pairs.length - 10; i < pairs.length; i++) {
  const p = pairs[i];
  console.log(`${String(pairs.length - i).padStart(4)} | ${p.a.padEnd(40)} | ${p.b.padEnd(40)} | ${p.similarity.toFixed(2)}%`);
}

// Distribution
const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
console.log('\n── Similarity distribution ──');
console.log(`${'Range'.padEnd(20)} | ${'Count'.padStart(6)} | ${'Pct'.padStart(7)} | Bar`);
console.log('-'.repeat(80));

for (let t = 0; t < thresholds.length; t++) {
  const lo = thresholds[t];
  const hi = t === 0 ? 100 : thresholds[t - 1];
  const count = pairs.filter(p => p.similarity >= lo && p.similarity < hi).length;
  const pct = (count / pairs.length * 100).toFixed(1);
  const bar = '#'.repeat(Math.round(count / pairs.length * 50));
  console.log(`${`${lo}% – ${hi}%`.padEnd(20)} | ${String(count).padStart(6)} | ${pct.padStart(6)}% | ${bar}`);
}

// Also report how many pairs exceed key thresholds
console.log('\n── Cumulative threshold counts ──');
for (const threshold of [80, 60, 40, 20]) {
  const count = pairs.filter(p => p.similarity >= threshold).length;
  console.log(`  Pairs >= ${threshold}%: ${count} (${(count / pairs.length * 100).toFixed(1)}%)`);
}

// Category-level analysis
console.log('\n── Average similarity by category pairing ──');
const catPairs = {};
for (const p of pairs) {
  const catA = p.a.split('/')[0];
  const catB = p.b.split('/')[0];
  const key = [catA, catB].sort().join(' × ');
  if (!catPairs[key]) catPairs[key] = { sum: 0, count: 0 };
  catPairs[key].sum += p.similarity;
  catPairs[key].count++;
}
for (const [key, val] of Object.entries(catPairs).sort((a, b) => b[1].sum / b[1].count - a[1].sum / a[1].count)) {
  console.log(`  ${key.padEnd(25)} avg: ${(val.sum / val.count).toFixed(2)}%  (${val.count} pairs)`);
}
