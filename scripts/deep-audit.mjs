#!/usr/bin/env node
/**
 * deep-audit.mjs — Comprehensive content audit for all built HTML pages
 *
 * Checks:
 *  1. Repeated words (>15 per page, excluding Korean particles)
 *  2. 8-word phrase dedup across pages (body content only, excluding shared boilerplate)
 *  3. FAQ intro dedup (first 15 chars of FAQ questions)
 *  4. Store name count on venue detail pages (target 8-10)
 *  5. Banned words (해당, 이곳, 공간, 매장, 감도, 기준)
 *  6. AI-pattern detection (또한, 특히, 다양한, 뿐만 아니라, consecutive 습니다/입니다)
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

/* ────────────────────────────────────────────── */
/* Config                                         */
/* ────────────────────────────────────────────── */
const DIST = join(process.cwd(), "dist");
const VENUES_JSON = join(process.cwd(), "src", "data", "venues.json");

const BANNED_WORDS = ["해당", "이곳", "공간", "매장", "감도", "기준"];

// Korean particles to exclude from repeated-word check
const PARTICLES = new Set([
  "은", "는", "이", "가", "을", "를", "의", "에", "에서",
  "도", "로", "으로", "와", "과", "하고", "나", "또는", "그리고",
]);

const REPEAT_THRESHOLD = 15;
const STORE_NAME_MIN = 8;
const STORE_NAME_MAX = 10;

// Listing / category pages — excluded from repeated-word check because
// they naturally repeat category words like 클럽, 나이트, 라운지, etc.
const LISTING_PAGES = new Set([
  "index.html",
  "clubs/index.html",
  "lounges/index.html",
  "nights/index.html",
]);

/* ────────────────────────────────────────────── */
/* Helpers                                        */
/* ────────────────────────────────────────────── */

/** Recursively find all index.html files under dir */
function findIndexHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...findIndexHtmlFiles(full));
    } else if (entry === "index.html") {
      results.push(full);
    }
  }
  return results;
}

/** Strip HTML tags & decode common entities, return visible text */
function stripHtml(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#10003;/g, "");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

/** Extract body visible text */
function extractBodyText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return stripHtml(html);
  return stripHtml(bodyMatch[1]);
}

/**
 * Extract MAIN content text — strips header, footer, nav, trust-block,
 * and other shared boilerplate. Used for phrase dedup (Check 2).
 */
function extractMainContentText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return stripHtml(html);
  let body = bodyMatch[1];
  // Remove header
  body = body.replace(/<header[\s\S]*?<\/header>/gi, " ");
  // Remove footer
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, " ");
  // Remove nav
  body = body.replace(/<nav[\s\S]*?<\/nav>/gi, " ");
  // Remove trust-block
  body = body.replace(/<div\s+class="trust-block"[\s\S]*?<\/div>/gi, " ");
  // Remove skip-link
  body = body.replace(/<a\s+class="skip-link"[\s\S]*?<\/a>/gi, " ");
  // Remove reading-progress
  body = body.replace(/<div\s+class="reading-progress"[\s\S]*?<\/div>/gi, " ");
  // Remove detail-related (shared "related venues" section)
  body = body.replace(/<div\s+class="detail-related"[\s\S]*?<\/div>/gi, " ");
  // Remove JSON-LD
  body = body.replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, " ");
  return stripHtml(body);
}

/** Tokenize Korean+English text into words */
function tokenize(text) {
  return text.match(/[\uAC00-\uD7AF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]+|[a-zA-Z0-9]+/g) || [];
}

/** Extract FAQ questions from HTML */
function extractFaqQuestions(html) {
  const questions = [];
  let m;
  // Match <summary> content
  const summaryRe = /<summary[^>]*>([\s\S]*?)<\/summary>/gi;
  while ((m = summaryRe.exec(html)) !== null) {
    const clean = m[1].replace(/<[^>]+>/g, "").trim();
    if (clean) questions.push(clean);
  }
  // Match faq__q class content
  const faqQRe = /<p\s+class="faq__q"[^>]*>([\s\S]*?)<\/p>/gi;
  while ((m = faqQRe.exec(html)) !== null) {
    const clean = m[1].replace(/<[^>]+>/g, "").trim();
    if (clean) questions.push(clean);
  }
  // Match <h3> containing ?
  const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  while ((m = h3Re.exec(html)) !== null) {
    const clean = m[1].replace(/<[^>]+>/g, "").trim();
    if (clean.includes("?") || clean.includes("\uFF1F")) questions.push(clean);
  }
  return [...new Set(questions)];
}

/** Split text into sentences */
function splitSentences(text) {
  return text.split(/(?<=[.!?\u3002])\s+|(?<=[\uB2E4\uC694\uC8E0\uAE4C])\s+/).filter((s) => s.trim().length > 3);
}

/* ────────────────────────────────────────────── */
/* Load venues                                    */
/* ────────────────────────────────────────────── */
let venues = [];
try {
  venues = JSON.parse(readFileSync(VENUES_JSON, "utf8"));
} catch (e) {
  console.error("WARNING: Could not load venues.json:", e.message);
}

const venueBySlug = new Map();
for (const v of venues) {
  venueBySlug.set(v.slug, v.name);
}
// Build a secondary lookup: for slugs that contain hyphens, map full path -> name
// This handles cases like slug "sky-lounge" but dir named "sky"
const venueByPath = new Map();
for (const v of venues) {
  const { cat_slug, region_slug, district_slug, slug } = v;
  if (cat_slug && region_slug && district_slug && slug) {
    const path = `${cat_slug}/${region_slug}/${district_slug}/${slug}/index.html`;
    venueByPath.set(path, v.name);
  }
}

/** Extract venue name from <h1> tag as fallback */
function extractH1Name(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) return m[1].replace(/<[^>]+>/g, "").trim();
  return null;
}

// Map detail_page -> venue name  (e.g. "/y/" -> "수유샴푸나이트")
const detailPageToName = new Map();
for (const v of venues) {
  if (v.detail_page) {
    const dp = v.detail_page.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
    detailPageToName.set(dp, v.name);
  }
}

/* ────────────────────────────────────────────── */
/* Discover pages                                 */
/* ────────────────────────────────────────────── */
const allFiles = findIndexHtmlFiles(DIST).sort();
console.log(`\n========================================`);
console.log(`  DEEP CONTENT AUDIT`);
console.log(`  Pages found: ${allFiles.length}`);
console.log(`========================================\n`);

/* ────────────────────────────────────────────── */
/* Per-page data collection                       */
/* ────────────────────────────────────────────── */
const pageData = [];
const allPhrases = new Map();       // phrase -> Set<relPath>
const allFaqIntros = new Map();     // first15chars -> [{ question, relPath }]

let hasFail = false;
const issues = {
  repeatedWords: [],
  phraseDupes: [],
  faqIntroDupes: [],
  storeNameIssues: [],
  bannedWords: [],
  aiPatterns: [],
};

for (const file of allFiles) {
  const relPath = relative(DIST, file);
  const html = readFileSync(file, "utf8");
  const bodyText = extractBodyText(html);
  const mainText = extractMainContentText(html);
  const words = tokenize(bodyText);
  const faqQuestions = extractFaqQuestions(html);

  pageData.push({ path: file, relPath, bodyText, mainText, html, words, faqQuestions });

  /* ── 8-word sliding windows on MAIN content only ── */
  const koreanWords = mainText.match(/[\uAC00-\uD7AF\u3130-\u318F]+/g) || [];
  for (let i = 0; i <= koreanWords.length - 8; i++) {
    const phrase = koreanWords.slice(i, i + 8).join(" ");
    if (!allPhrases.has(phrase)) allPhrases.set(phrase, new Set());
    allPhrases.get(phrase).add(relPath);
  }

  /* ── FAQ intro collection ── */
  for (const q of faqQuestions) {
    const intro = q.slice(0, 15);
    if (!allFaqIntros.has(intro)) allFaqIntros.set(intro, []);
    allFaqIntros.get(intro).push({ question: q, relPath });
  }
}

/* ────────────────────────────────────────────── */
/* CHECK 1: Repeated words                        */
/* ────────────────────────────────────────────── */
console.log(`── CHECK 1: Repeated Words (>${REPEAT_THRESHOLD} per page, excluding listing pages) ──\n`);
for (const page of pageData) {
  // Skip listing/category index pages
  if (LISTING_PAGES.has(page.relPath)) continue;

  const freq = new Map();
  for (const w of page.words) {
    if (PARTICLES.has(w)) continue;
    if (w.length < 2) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const violations = [...freq.entries()]
    .filter(([, count]) => count > REPEAT_THRESHOLD)
    .sort((a, b) => b[1] - a[1]);

  if (violations.length > 0) {
    for (const [word, count] of violations) {
      issues.repeatedWords.push({ page: page.relPath, word, count });
      console.log(`  FAIL  ${page.relPath}  word="${word}" count=${count}`);
    }
  }
}
if (issues.repeatedWords.length === 0) {
  console.log("  PASS  No repeated words above threshold.");
} else {
  hasFail = true;
}

/* ────────────────────────────────────────────── */
/* CHECK 2: 8-word phrase dedup across pages      */
/* ────────────────────────────────────────────── */
console.log(`\n── CHECK 2: 8-Word Phrase Dedup Across Pages (excluding boilerplate) ──\n`);
for (const [phrase, pages] of allPhrases) {
  if (pages.size >= 2) {
    issues.phraseDupes.push({ phrase, pages: [...pages] });
  }
}
if (issues.phraseDupes.length === 0) {
  console.log("  PASS  No shared 8-word phrases found across different pages.");
} else {
  hasFail = true;
  const shown = issues.phraseDupes.slice(0, 40);
  for (const { phrase, pages } of shown) {
    console.log(`  FAIL  phrase="${phrase}"`);
    console.log(`        shared by: ${pages.slice(0, 5).join(", ")}${pages.length > 5 ? ` (+${pages.length - 5} more)` : ""}`);
  }
  if (issues.phraseDupes.length > 40) {
    console.log(`  ... and ${issues.phraseDupes.length - 40} more duplicated phrases`);
  }
  console.log(`\n  TOTAL duplicated 8-word phrases: ${issues.phraseDupes.length}`);
}

/* ────────────────────────────────────────────── */
/* CHECK 3: FAQ intro dedup                       */
/* ────────────────────────────────────────────── */
console.log(`\n── CHECK 3: FAQ Intro Dedup (first 15 chars) ──\n`);
for (const [intro, entries] of allFaqIntros) {
  const uniquePages = [...new Set(entries.map((e) => e.relPath))];
  if (uniquePages.length >= 2) {
    issues.faqIntroDupes.push({ intro, entries, uniquePages });
  }
}
if (issues.faqIntroDupes.length === 0) {
  console.log("  PASS  No duplicate FAQ question intros across pages.");
} else {
  hasFail = true;
  for (const { intro, uniquePages } of issues.faqIntroDupes) {
    console.log(`  FAIL  FAQ intro="${intro}..."  shared by ${uniquePages.length} pages:`);
    for (const p of uniquePages) {
      console.log(`        -> ${p}`);
    }
  }
  console.log(`\n  TOTAL duplicate FAQ intros: ${issues.faqIntroDupes.length}`);
}

/* ────────────────────────────────────────────── */
/* CHECK 4: Store name count on venue detail pages */
/* ────────────────────────────────────────────── */
console.log(`\n── CHECK 4: Store Name Count (target ${STORE_NAME_MIN}-${STORE_NAME_MAX}) ──\n`);

// Collect all venue detail pages
const detailPages = [];
for (const page of pageData) {
  const r = page.relPath;
  // Standard category detail pages
  if (r.startsWith("club/") || r.startsWith("lounge/") || r.startsWith("night/")) {
    detailPages.push(page);
  }
  // Single-letter detail pages
  if (detailPageToName.has(r)) {
    detailPages.push(page);
  }
}

for (const page of detailPages) {
  let venueName = null;

  if (detailPageToName.has(page.relPath)) {
    venueName = detailPageToName.get(page.relPath);
  } else if (venueByPath.has(page.relPath)) {
    venueName = venueByPath.get(page.relPath);
  } else {
    const parts = page.relPath.split("/");
    if (parts.length >= 4) {
      const slug = parts[parts.length - 2];
      venueName = venueBySlug.get(slug);
    }
  }

  // Fallback: extract venue name from <h1> on the page
  if (!venueName) {
    venueName = extractH1Name(page.html);
  }

  if (!venueName) continue;

  const nameRegex = new RegExp(venueName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  const matches = page.bodyText.match(nameRegex) || [];
  const count = matches.length;

  if (count < STORE_NAME_MIN || count > STORE_NAME_MAX) {
    issues.storeNameIssues.push({ page: page.relPath, venueName, count });
    const status = count < STORE_NAME_MIN ? "TOO FEW" : "TOO MANY";
    console.log(`  FAIL  ${page.relPath}  name="${venueName}" count=${count} (${status})`);
  } else {
    // Optional: show passing pages for transparency
    // console.log(`  OK    ${page.relPath}  name="${venueName}" count=${count}`);
  }
}
if (issues.storeNameIssues.length === 0) {
  console.log("  PASS  All venue pages have store name in 8-10 range.");
} else {
  hasFail = true;
}

/* ────────────────────────────────────────────── */
/* CHECK 5: Banned words                          */
/* ────────────────────────────────────────────── */
console.log(`\n── CHECK 5: Banned Words (${BANNED_WORDS.join(", ")}) ──\n`);
for (const page of pageData) {
  for (const bw of BANNED_WORDS) {
    const re = new RegExp(bw, "g");
    const matches = page.bodyText.match(re) || [];
    if (matches.length > 0) {
      issues.bannedWords.push({ page: page.relPath, word: bw, count: matches.length });
      console.log(`  FAIL  ${page.relPath}  banned="${bw}" count=${matches.length}`);
    }
  }
}
if (issues.bannedWords.length === 0) {
  console.log("  PASS  Zero occurrences of all banned words.");
} else {
  hasFail = true;
}

/* ────────────────────────────────────────────── */
/* CHECK 6: AI-pattern detection                  */
/* ────────────────────────────────────────────── */
console.log(`\n── CHECK 6: AI Writing Pattern Detection ──\n`);

for (const page of pageData) {
  const text = page.bodyText;
  const sentences = splitSentences(text);
  const pageIssues = [];

  /* 6a: Sentences starting with "또한" (more than 1) */
  const startDdohan = sentences.filter((s) => s.trimStart().startsWith("또한")).length;
  if (startDdohan > 1) {
    pageIssues.push(`"또한" sentence starts: ${startDdohan}`);
  }

  /* 6b: Sentences starting with "특히" (more than 1) */
  const startTeukhi = sentences.filter((s) => s.trimStart().startsWith("특히")).length;
  if (startTeukhi > 1) {
    pageIssues.push(`"특히" sentence starts: ${startTeukhi}`);
  }

  /* 6c: Sentences starting with "다양한" (more than 1) */
  const startDayanghan = sentences.filter((s) => s.trimStart().startsWith("다양한")).length;
  if (startDayanghan > 1) {
    pageIssues.push(`"다양한" sentence starts: ${startDayanghan}`);
  }

  /* 6d: Pattern "X뿐만 아니라 Y" */
  if (/뿐만\s*아니라/.test(text)) {
    pageIssues.push(`"뿐만 아니라" pattern detected`);
  }

  /* 6e: Three or more consecutive sentences ending with ~습니다 or ~입니다 */
  let consecutive = 0;
  let maxConsecutive = 0;
  for (const s of sentences) {
    const trimmed = s.trim();
    if (/(?:습니다|입니다)[.!?\s]*$/.test(trimmed)) {
      consecutive++;
      if (consecutive > maxConsecutive) maxConsecutive = consecutive;
    } else {
      consecutive = 0;
    }
  }
  if (maxConsecutive >= 3) {
    pageIssues.push(`${maxConsecutive} consecutive ~습니다/~입니다 sentences`);
  }

  if (pageIssues.length > 0) {
    issues.aiPatterns.push({ page: page.relPath, patterns: pageIssues });
    for (const pi of pageIssues) {
      console.log(`  FAIL  ${page.relPath}  ${pi}`);
    }
  }
}
if (issues.aiPatterns.length === 0) {
  console.log("  PASS  No AI writing patterns detected.");
} else {
  hasFail = true;
}

/* ────────────────────────────────────────────── */
/* SUMMARY                                        */
/* ────────────────────────────────────────────── */
console.log(`\n========================================`);
console.log(`  AUDIT SUMMARY`);
console.log(`========================================`);
console.log(`  Pages audited:          ${allFiles.length}`);
console.log(`  1. Repeated words:      ${issues.repeatedWords.length} violations`);
console.log(`  2. Phrase dupes:        ${issues.phraseDupes.length} shared phrases`);
console.log(`  3. FAQ intro dupes:     ${issues.faqIntroDupes.length} duplicates`);
console.log(`  4. Store name issues:   ${issues.storeNameIssues.length} out-of-range`);
console.log(`  5. Banned words:        ${issues.bannedWords.length} occurrences`);
console.log(`  6. AI patterns:         ${issues.aiPatterns.length} pages with issues`);
console.log(`  ────────────────────────────────────`);
console.log(`  RESULT: ${hasFail ? "FAIL" : "PASS"}`);
console.log(`========================================\n`);

process.exit(hasFail ? 1 : 0);
