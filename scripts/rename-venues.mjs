#!/usr/bin/env node
/**
 * rename-venues.mjs
 * Renames English-named club/lounge venues to Korean names,
 * updates image_alt and map_url fields accordingly,
 * and adds the new venue.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const VENUES_PATH = new URL('../src/data/venues.json', import.meta.url).pathname;

// ── Name mappings ──────────────────────────────────────────────────────
const CLUB_MAP = {
  "Club RACE":    { korean: "강남레이스클럽",  mapQuery: "강남레이스클럽" },
  "Octagon":      { korean: "옥타곤",          mapQuery: "옥타곤 강남" },
  "Club ARTE":    { korean: "클럽아르테",      mapQuery: "클럽아르테 강남" },
  "Club MUIN":    { korean: "클럽무인",        mapQuery: "클럽무인 강남" },
  "Club Sound":   { korean: "강남사운드클럽",  mapQuery: "강남사운드클럽" },
  "Club Face":    { korean: "클럽페이스",      mapQuery: "클럽페이스 강남" },
  "Jack Livin":   { korean: "잭리빈",          mapQuery: "잭리빈 강남" },
  "B1":           { korean: "홍대비원",        mapQuery: "홍대비원 클럽" },
  "Club LASER":   { korean: "클럽레이저",      mapQuery: "클럽레이저 홍대" },
  "Club AURA":    { korean: "클럽아우라",      mapQuery: "클럽아우라 홍대" },
  "SABOTAGE":     { korean: "사보타지",        mapQuery: "사보타지 홍대" },
  "Club Bermuda": { korean: "클럽버뮤다",      mapQuery: "클럽버뮤다 홍대" },
  "Club Purple":  { korean: "클럽퍼플",        mapQuery: "클럽퍼플 홍대" },
  "Club Ocean":   { korean: "클럽오션",        mapQuery: "클럽오션 홍대" },
  "Club FF":      { korean: "클럽에프에프",    mapQuery: "클럽에프에프 홍대" },
  "Faust":        { korean: "파우스트",        mapQuery: "파우스트 이태원" },
  "Cakeshop":     { korean: "케이크샵",        mapQuery: "케이크샵 이태원" },
  "Volnost":      { korean: "볼노스트",        mapQuery: "볼노스트 이태원" },
  "Club 82":      { korean: "클럽82",          mapQuery: "클럽82 청담" },
  "Club AZIT":    { korean: "클럽아지트",      mapQuery: "클럽아지트 서면" },
  "GRID":         { korean: "그리드",          mapQuery: "그리드 클럽 서면" },
  "Groove":       { korean: "그루브",          mapQuery: "그루브 클럽 서면" },
  "Billie Jean":  { korean: "빌리진",          mapQuery: "빌리진 해운대" },
  "MELT BUSAN":   { korean: "멜트부산",        mapQuery: "멜트부산 해운대" },
  "BaBamBa":      { korean: "바밤바",          mapQuery: "바밤바 대구 클럽" },
  "All Air":      { korean: "올에어",          mapQuery: "올에어 대전 클럽" },
  "Club Curtain": { korean: "클럽커튼",        mapQuery: "클럽커튼 제주" },
  "Monkey Beach": { korean: "몽키비치",        mapQuery: "몽키비치 제주 중문" },
};

const LOUNGE_MAP = {
  "CODE Lounge":  { korean: "코드라운지",   mapQuery: "코드라운지 압구정" },
  "HYPE Seoul":   { korean: "하이프서울",   mapQuery: "하이프서울 압구정" },
  "Intro Lounge": { korean: "인트로라운지", mapQuery: "인트로라운지 압구정" },
  "DM Lounge":    { korean: "DM라운지",     mapQuery: "DM라운지 압구정" },
  "Color Lounge": { korean: "컬러라운지",   mapQuery: "컬러라운지 압구정" },
};

// Merge both maps
const NAME_MAP = { ...CLUB_MAP, ...LOUNGE_MAP };

// ── New venue to insert ────────────────────────────────────────────────
const NEW_VENUE = {
  "name": "이태원와이키키유토피아클럽",
  "category": "클럽",
  "cat_slug": "club",
  "region": "서울",
  "region_slug": "seoul",
  "district": "용산구",
  "district_slug": "yongsan",
  "slug": "waikiki-utopia",
  "address": "서울 용산구 이태원동 일대",
  "phone": "",
  "hours": "금·토 22:00~06:00",
  "station": "이태원역 도보 5분",
  "thumbnail": "/images/girl-model-party.png",
  "image_alt": "이태원와이키키유토피아클럽 서울 용산 클럽 썸네일",
  "badge": null,
  "tags": ["이태원", "EDM", "파티"],
  "map_url": "https://map.naver.com/v5/search/이태원%20와이키키유토피아클럽",
  "card_hook": "이태원 한복판, 하와이 무드와 유토피아 컨셉이 결합된 파티 공간. 이국적인 인테리어 속에서 밤이 시작된다.",
  "card_value": "금·토 22시 오픈. 이태원역 도보 5분.",
  "card_tags": ["이태원", "파티", "이국적"],
  "keywords": ["와이키키유토피아", "이태원클럽", "와이키키클럽"],
  "source_urls": []
};

// ── Main logic ─────────────────────────────────────────────────────────
const raw = readFileSync(VENUES_PATH, 'utf-8');
const venues = JSON.parse(raw);

let renamedCount = 0;

for (const venue of venues) {
  const mapping = NAME_MAP[venue.name];
  if (!mapping) continue;               // skip Korean-named venues

  const oldName = venue.name;
  const newName = mapping.korean;

  // 1. Rename
  venue.name = newName;

  // 2. Update image_alt -- replace the old English name with the Korean name
  if (venue.image_alt) {
    venue.image_alt = venue.image_alt.replace(oldName, newName);
  }

  // 3. Update map_url
  venue.map_url =
    'https://map.naver.com/v5/search/' + encodeURIComponent(mapping.mapQuery);

  renamedCount++;
  console.log(`  OK  ${oldName}  ->  ${newName}`);
}

console.log(`\nRenamed ${renamedCount} venues.\n`);

// ── Insert new venue after Monkey Beach (last club before nights) ──────
// After renaming, Monkey Beach is now 몽키비치
const insertIdx = venues.findIndex(v => v.slug === 'monkey-beach');
if (insertIdx === -1) {
  console.error('ERROR: Could not find Monkey Beach / monkey-beach slug.');
  process.exit(1);
}

venues.splice(insertIdx + 1, 0, NEW_VENUE);

// Check for duplicates (in case script is run twice)
const dupes = venues.filter(v => v.name === NEW_VENUE.name);
if (dupes.length > 1) {
  console.log('New venue already existed -- removing duplicate.');
  let seen = false;
  for (let i = venues.length - 1; i >= 0; i--) {
    if (venues[i].name === NEW_VENUE.name) {
      if (seen) venues.splice(i, 1);
      else seen = true;
    }
  }
}

console.log(`Inserted new venue: ${NEW_VENUE.name} (after index ${insertIdx})`);

// ── Write back ─────────────────────────────────────────────────────────
writeFileSync(VENUES_PATH, JSON.stringify(venues, null, 2) + '\n', 'utf-8');
console.log(`\nWrote ${venues.length} venues to ${VENUES_PATH}`);

// ── Verification ───────────────────────────────────────────────────────
console.log('\n-- Verification samples --');
const verify = JSON.parse(readFileSync(VENUES_PATH, 'utf-8'));
const samples = [
  '강남레이스클럽', '옥타곤', '홍대비원', '코드라운지',
  '이태원와이키키유토피아클럽', '강남어게인', '수유샴푸나이트'
];
for (const sampleName of samples) {
  const v = verify.find(x => x.name === sampleName);
  if (v) {
    console.log(`\n  [${v.name}]`);
    console.log(`    image_alt : ${v.image_alt}`);
    console.log(`    map_url   : ${v.map_url}`);
  } else {
    console.log(`\n  [${sampleName}] -- NOT FOUND`);
  }
}

// Quick JSON validity check
try {
  JSON.parse(readFileSync(VENUES_PATH, 'utf-8'));
  console.log('\nJSON validity: PASS');
} catch (e) {
  console.error('\nJSON validity: FAIL', e.message);
  process.exit(1);
}

console.log('\nDone.');
