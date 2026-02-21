#!/usr/bin/env node
/**
 * 클럽 이름을 "[지역]+[이름]+클럽" 형식으로 일괄 변경
 */
import { readFileSync, writeFileSync } from 'fs';

const FILE = new URL('../src/data/venues.json', import.meta.url).pathname;
const venues = JSON.parse(readFileSync(FILE, 'utf-8'));

// 이름 매핑: 현재이름 → 새이름
const renameMap = {
  '옥타곤': '강남옥타곤클럽',
  '클럽아르테': '강남아르테클럽',
  '클럽무인': '강남무인클럽',
  '클럽페이스': '강남페이스클럽',
  '잭리빈': '강남잭리빈클럽',
  '강남어게인': '강남어게인클럽',
  '홍대비원': '홍대비원클럽',
  '클럽레이저': '홍대레이저클럽',
  '클럽아우라': '홍대아우라클럽',
  '사보타지': '홍대사보타지클럽',
  '클럽버뮤다': '홍대버뮤다클럽',
  '클럽퍼플': '홍대퍼플클럽',
  '클럽오션': '홍대오션클럽',
  '클럽에프에프': '홍대에프에프클럽',
  '파우스트': '이태원파우스트클럽',
  '케이크샵': '이태원케이크샵클럽',
  '볼노스트': '이태원볼노스트클럽',
  '클럽82': '청담82클럽',
  '클럽아지트': '서면아지트클럽',
  '그리드': '서면그리드클럽',
  '그루브': '서면그루브클럽',
  '빌리진': '해운대빌리진클럽',
  '멜트부산': '해운대멜트클럽',
  '바밤바': '대구바밤바클럽',
  '올에어': '대전올에어클럽',
  '클럽커튼': '제주커튼클럽',
  '몽키비치': '제주몽키비치클럽',
};

let changed = 0;
for (const v of venues) {
  if (v.category !== '클럽') continue;
  const oldName = v.name;
  const newName = renameMap[oldName];
  if (!newName) {
    console.log(`  ✓ SKIP (already correct): ${oldName}`);
    continue;
  }

  // Update name
  v.name = newName;

  // Update image_alt: replace old name with new name
  if (v.image_alt) {
    v.image_alt = v.image_alt.replace(oldName, newName);
  }

  // Update map_url: encode new name for Naver Maps
  const encodedName = encodeURIComponent(newName);
  // Find region info for map_url
  const regionInfo = v.station?.match(/(강남|홍대|이태원|청담|서면|해운대|대구|대전|제주|신사|삼성|압구정)/)?.[1] || '';
  v.map_url = `https://map.naver.com/v5/search/${encodedName}`;

  // Update keywords if they reference old name
  if (v.keywords) {
    v.keywords = v.keywords.map(k => k === oldName ? newName : k);
  }

  console.log(`  ✅ ${oldName} → ${newName}`);
  changed++;
}

writeFileSync(FILE, JSON.stringify(venues, null, 2) + '\n', 'utf-8');
console.log(`\nDone: ${changed} clubs renamed.`);
