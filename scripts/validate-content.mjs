/**
 * validate-content.mjs
 * 상세페이지 컨텐츠 품질 검증 스크립트
 *
 * 검증 항목:
 * 1. 금지 단어 존재 여부
 * 2. STORE_NAME 출현 횟수 (8~10회)
 * 3. FAQ 질문 시작 토큰 중복 (2회 이하)
 * 4. 페이지 간 8단어 이상 반복 구절 감지
 * 5. Intro 존재 여부
 * 6. reading time 라벨 존재 여부
 * 7. og:image 확인
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
const BANNED_WORDS = ['이곳', '해당', '공간', '매장', '감도', '기준'];
const VENUES_JSON = JSON.parse(readFileSync(join(process.cwd(), 'src/data/venues.json'), 'utf8'));

// Get all detail page HTML files
function getDetailPages() {
  const pages = [];
  const categories = ['club', 'night', 'lounge'];

  for (const cat of categories) {
    const catDir = join(DIST, cat);
    if (!existsSync(catDir)) continue;

    for (const region of readdirSync(catDir)) {
      const regionDir = join(catDir, region);
      if (!existsSync(regionDir)) continue;
      try {
        for (const district of readdirSync(regionDir)) {
          const districtDir = join(regionDir, district);
          if (!existsSync(districtDir)) continue;
          try {
            for (const slug of readdirSync(districtDir)) {
              const htmlPath = join(districtDir, slug, 'index.html');
              if (existsSync(htmlPath)) {
                const venue = VENUES_JSON.find(v => v.slug === slug && v.cat_slug === cat && !v.detail_page);
                if (venue) {
                  pages.push({ path: htmlPath, venue, slug });
                }
              }
            }
          } catch {}
        }
      } catch {}
    }
  }
  return pages;
}

function stripHtml(html) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
             .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]*>/g, ' ')
             .replace(/&[a-z]+;/gi, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

function validate() {
  const pages = getDetailPages();
  console.log(`\n=== 상세페이지 컨텐츠 검증 ===`);
  console.log(`검증 대상: ${pages.length}개 페이지\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const allTexts = [];

  for (const page of pages) {
    const html = readFileSync(page.path, 'utf8');
    const text = stripHtml(html);
    const errors = [];
    const warnings = [];
    const name = page.venue.name;

    allTexts.push({ slug: page.slug, text, name });

    // 1. Banned words check
    for (const word of BANNED_WORDS) {
      // Check in main content only (exclude navigation, headers, etc.)
      const mainContent = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
      const mainText = stripHtml(mainContent);
      if (mainText.includes(word)) {
        const count = mainText.split(word).length - 1;
        errors.push(`금지단어 "${word}" ${count}회 발견`);
      }
    }

    // 2. STORE_NAME count (8~10) — within <main> only
    const mainContent = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
    const mainText = stripHtml(mainContent);
    const nameRegex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const nameCount = (mainText.match(nameRegex) || []).length;
    if (nameCount < 8) {
      warnings.push(`STORE_NAME "${name}" ${nameCount}회 (최소 8회 필요)`);
    } else if (nameCount > 10) {
      warnings.push(`STORE_NAME "${name}" ${nameCount}회 (최대 10회 권장)`);
    }

    // 3. FAQ starting token check
    const faqSection = html.match(/<section[^>]*id="faq-section"[^>]*>([\s\S]*?)<\/section>/i)?.[1] || '';
    const faqQuestions = [...faqSection.matchAll(/<p\s+class="faq__q"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => stripHtml(m[1]).trim());
    const startTokens = {};
    for (const q of faqQuestions) {
      const firstWord = q.split(/\s+/)[0];
      startTokens[firstWord] = (startTokens[firstWord] || 0) + 1;
    }
    for (const [token, count] of Object.entries(startTokens)) {
      if (count > 2) {
        warnings.push(`FAQ 시작 토큰 "${token}" ${count}회 반복 (최대 2회)`);
      }
    }

    // 4. Intro exists
    if (!html.includes('value-intro') && !html.includes('이 페이지에서 얻는 것')) {
      errors.push('Value Hook Intro 미존재');
    }

    // 5. Reading time label
    if (!html.includes('예상 읽기 시간')) {
      errors.push('읽기 시간 라벨 미존재');
    }

    // 6. og:image check
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (!ogImageMatch) {
      errors.push('og:image 메타태그 미존재');
    } else if (!ogImageMatch[1].startsWith('http')) {
      warnings.push(`og:image가 절대 URL이 아님: ${ogImageMatch[1]}`);
    }

    // Print results for this page
    if (errors.length > 0 || warnings.length > 0) {
      console.log(`📄 ${name} (${page.slug})`);
      for (const e of errors) { console.log(`   ❌ ${e}`); totalErrors++; }
      for (const w of warnings) { console.log(`   ⚠️  ${w}`); totalWarnings++; }
      console.log('');
    }
  }

  // 7. Cross-page repeated phrases (8+ words)
  console.log(`--- 크로스페이지 반복 구절 검사 ---`);
  let repeatedPhrases = 0;
  const seen8grams = new Map();

  for (const { slug, text } of allTexts) {
    const words = text.split(/\s+/);
    for (let i = 0; i <= words.length - 8; i++) {
      const gram = words.slice(i, i + 8).join(' ');
      if (gram.length < 20) continue; // Skip very short word sequences
      if (!seen8grams.has(gram)) {
        seen8grams.set(gram, [slug]);
      } else {
        const existing = seen8grams.get(gram);
        if (!existing.includes(slug)) {
          existing.push(slug);
          if (existing.length === 2) {
            repeatedPhrases++;
          }
        }
      }
    }
  }

  if (repeatedPhrases > 0) {
    console.log(`   ⚠️  ${repeatedPhrases}개의 8-gram 반복 구절 감지 (공통 템플릿 구문 포함)`);
    totalWarnings += repeatedPhrases > 10 ? 1 : 0;
  } else {
    console.log(`   ✅ 8단어 이상 반복 구절 없음`);
  }

  // Summary
  console.log(`\n=== 검증 결과 ===`);
  console.log(`총 페이지: ${pages.length}`);
  console.log(`❌ 에러: ${totalErrors}`);
  console.log(`⚠️  경고: ${totalWarnings}`);

  if (totalErrors === 0) {
    console.log(`\n✅ 검증 통과! 배포 가능합니다.`);
    // Print sample pages for manual verification
    console.log(`\n--- 샘플 페이지 상세 검증 (3개) ---`);
    const samplePages = pages.slice(0, 3);
    for (const page of samplePages) {
      const html = readFileSync(page.path, 'utf8');
      const text = stripHtml(html);
      const name = page.venue.name;
      const nameCount = (text.match(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const hasIntro = html.includes('value-intro');
      const hasReadingTime = html.includes('예상 읽기 시간');
      const hasOgImage = /<meta\s+property="og:image"\s+content="https?:\/\//i.test(html);
      const charCount = text.length;

      console.log(`\n📄 ${name} (${page.slug})`);
      console.log(`   Intro 존재: ${hasIntro ? '✅' : '❌'}`);
      console.log(`   읽기 시간 라벨: ${hasReadingTime ? '✅' : '❌'}`);
      console.log(`   og:image 절대 URL: ${hasOgImage ? '✅' : '❌'}`);
      console.log(`   STORE_NAME 횟수: ${nameCount}회`);
      console.log(`   총 문자 수: ${charCount}자`);
    }
  } else {
    console.log(`\n❌ 검증 실패. 에러를 수정해 주세요.`);
    process.exit(1);
  }
}

validate();
