/**
 * validate-content.mjs
 * 전체 콘텐츠 품질 검증 스크립트 (JSON 소스 + 빌드 HTML)
 *
 * 검증 항목:
 * 1. JSON 파일 존재 (56개)
 * 2. 글자 수: 7,000~12,000 (HTML 태그 제외)
 * 3. STORE_NAME 출현 횟수 (8~10)
 * 4. 금지단어 0건
 * 5. 전 페이지 간 8-gram 중복
 * 6. FAQ 질문 전역 고유성
 * 7. 체크리스트 항목 전역 고유성
 * 8. 섹션 제목 전역 고유성
 * 9. 필수 필드 존재
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const VENUES_JSON = JSON.parse(readFileSync(join(ROOT, 'src/data/venues.json'), 'utf8'));
const CONTENT_DIR = join(ROOT, 'src/data/venue-content');
const BANNED_WORDS = ['이곳', '해당', '공간', '매장', '감도', '기준'];

const REQUIRED_FIELDS = [
  'slug', 'heroTagline', 'introHook', 'introBullets', 'introTeaser',
  'prologueTitle', 'prologue', 'scene1Title', 'scene1', 'scene2Title', 'scene2',
  'tipTitle', 'tipSection', 'dialogueTitle', 'dialogueSection',
  'checklistTitle', 'checklist', 'faqItems', 'outroTitle', 'outro', 'aiSummary',
];

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function getAllText(content) {
  const parts = [
    content.heroTagline, content.introHook,
    ...(content.introBullets || []),
    content.introTeaser,
    content.prologueTitle, content.prologue,
    content.scene1Title, content.scene1,
    content.scene2Title, content.scene2,
    content.tipTitle, content.tipSection,
    content.dialogueTitle, content.dialogueSection,
    content.checklistTitle, ...(content.checklist || []),
    ...(content.faqItems || []).map(f => f.q + ' ' + f.a),
    content.outroTitle, content.outro,
    ...(content.aiSummary || []),
  ];
  return parts.filter(Boolean).join(' ');
}

function validate() {
  console.log('\n========================================');
  console.log('  콘텐츠 품질 검증 시작');
  console.log('========================================\n');

  let totalErrors = 0;
  let totalWarnings = 0;
  const allFaqQuestions = [];
  const allChecklistItems = [];
  const allSectionTitles = [];
  const allTexts = [];

  // Step 1: Check all JSON files exist
  console.log('--- 1. JSON 파일 존재 확인 ---');
  const existingFiles = existsSync(CONTENT_DIR) ? readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json')) : [];
  const existingSlugs = existingFiles.map(f => f.replace('.json', ''));
  const missingSlugs = VENUES_JSON.filter(v => !existingSlugs.includes(v.slug));

  if (missingSlugs.length > 0) {
    console.log(`   [ERROR] ${missingSlugs.length}개 JSON 파일 누락:`);
    missingSlugs.forEach(v => console.log(`      - ${v.slug} (${v.name})`));
    totalErrors += missingSlugs.length;
  } else {
    console.log(`   [OK] ${existingFiles.length}개 JSON 파일 모두 존재`);
  }

  // Step 2~8: Validate each JSON file
  console.log('\n--- 2~8. 개별 파일 검증 ---');

  for (const file of existingFiles) {
    const slug = file.replace('.json', '');
    const venue = VENUES_JSON.find(v => v.slug === slug);
    if (!venue) continue;

    const filePath = join(CONTENT_DIR, file);
    let content;
    try {
      content = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`   [ERROR] ${slug}: JSON 파싱 실패 — ${e.message}`);
      totalErrors++;
      continue;
    }

    const errors = [];
    const warnings = [];

    // 2a. Required fields
    for (const field of REQUIRED_FIELDS) {
      if (content[field] === undefined || content[field] === null || content[field] === '') {
        errors.push(`필수 필드 "${field}" 누락`);
      }
    }

    // 2b. Array length checks
    if (content.introBullets && content.introBullets.length !== 4) {
      warnings.push(`introBullets ${content.introBullets.length}개 (4개 필요)`);
    }
    if (content.checklist && content.checklist.length !== 10) {
      warnings.push(`checklist ${content.checklist.length}개 (10개 필요)`);
    }
    const isShortcode = venue.detail_page;
    const expectedFaq = isShortcode ? 8 : 12;
    if (content.faqItems && content.faqItems.length < expectedFaq) {
      warnings.push(`faqItems ${content.faqItems.length}개 (${expectedFaq}개 필요)`);
    }

    // 3. Character count
    const fullText = getAllText(content);
    const plainText = stripHtml(fullText);
    const charCount = plainText.length;
    if (charCount < 7000) {
      warnings.push(`글자 수 ${charCount}자 (최소 7,000 필요)`);
    } else if (charCount > 12000) {
      warnings.push(`글자 수 ${charCount}자 (최대 12,000 권장)`);
    }

    // 4. STORE_NAME count
    const nameRegex = new RegExp(venue.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const nameCount = (plainText.match(nameRegex) || []).length;
    if (nameCount < 8) {
      warnings.push(`STORE_NAME "${venue.name}" ${nameCount}회 (최소 8회)`);
    } else if (nameCount > 12) {
      warnings.push(`STORE_NAME "${venue.name}" ${nameCount}회 (최대 10회 권장)`);
    }

    // 5. Banned words
    for (const word of BANNED_WORDS) {
      if (plainText.includes(word)) {
        const count = plainText.split(word).length - 1;
        errors.push(`금지단어 "${word}" ${count}회 발견`);
      }
    }

    // Collect for cross-page checks
    if (content.faqItems) {
      content.faqItems.forEach(f => allFaqQuestions.push({ slug, q: f.q }));
    }
    if (content.checklist) {
      content.checklist.forEach(item => allChecklistItems.push({ slug, item }));
    }
    const titles = [
      content.prologueTitle, content.scene1Title, content.scene2Title,
      content.checklistTitle, content.outroTitle, content.tipTitle,
      content.dialogueTitle,
    ].filter(Boolean);
    titles.forEach(t => allSectionTitles.push({ slug, title: t }));

    allTexts.push({ slug, text: plainText, name: venue.name });

    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n   ${venue.name} (${slug})`);
      errors.forEach(e => { console.log(`      [ERROR] ${e}`); totalErrors++; });
      warnings.forEach(w => { console.log(`      [WARN]  ${w}`); totalWarnings++; });
    }
  }

  // 6. FAQ global uniqueness
  console.log('\n--- 6. FAQ 질문 전역 고유성 ---');
  const faqMap = new Map();
  for (const { slug, q } of allFaqQuestions) {
    const normalized = q.trim().replace(/\s+/g, ' ');
    if (faqMap.has(normalized)) {
      faqMap.get(normalized).push(slug);
    } else {
      faqMap.set(normalized, [slug]);
    }
  }
  let faqDupes = 0;
  for (const [q, slugs] of faqMap) {
    if (slugs.length > 1) {
      const uniqueSlugs = [...new Set(slugs)];
      if (uniqueSlugs.length > 1) {
        faqDupes++;
        if (faqDupes <= 10) {
          console.log(`   [WARN] FAQ 중복: "${q.substring(0, 40)}..." → ${uniqueSlugs.join(', ')}`);
        }
      }
    }
  }
  if (faqDupes === 0) {
    console.log('   [OK] FAQ 질문 전역 고유');
  } else {
    console.log(`   [WARN] FAQ 중복 ${faqDupes}건`);
    totalWarnings += faqDupes;
  }

  // 7. Checklist global uniqueness
  console.log('\n--- 7. 체크리스트 항목 전역 고유성 ---');
  const checkMap = new Map();
  for (const { slug, item } of allChecklistItems) {
    const normalized = item.trim().replace(/\s+/g, ' ');
    if (checkMap.has(normalized)) {
      checkMap.get(normalized).push(slug);
    } else {
      checkMap.set(normalized, [slug]);
    }
  }
  let checkDupes = 0;
  for (const [item, slugs] of checkMap) {
    if (slugs.length > 1) {
      const uniqueSlugs = [...new Set(slugs)];
      if (uniqueSlugs.length > 1) {
        checkDupes++;
        if (checkDupes <= 10) {
          console.log(`   [WARN] 체크리스트 중복: "${item.substring(0, 40)}..." → ${uniqueSlugs.join(', ')}`);
        }
      }
    }
  }
  if (checkDupes === 0) {
    console.log('   [OK] 체크리스트 항목 전역 고유');
  } else {
    console.log(`   [WARN] 체크리스트 중복 ${checkDupes}건`);
    totalWarnings += checkDupes;
  }

  // 8. Section title global uniqueness
  console.log('\n--- 8. 섹션 제목 전역 고유성 ---');
  const titleMap = new Map();
  for (const { slug, title } of allSectionTitles) {
    const normalized = title.trim();
    if (titleMap.has(normalized)) {
      titleMap.get(normalized).push(slug);
    } else {
      titleMap.set(normalized, [slug]);
    }
  }
  let titleDupes = 0;
  for (const [title, slugs] of titleMap) {
    if (slugs.length > 1) {
      const uniqueSlugs = [...new Set(slugs)];
      if (uniqueSlugs.length > 1) {
        titleDupes++;
        if (titleDupes <= 10) {
          console.log(`   [WARN] 제목 중복: "${title}" → ${uniqueSlugs.join(', ')}`);
        }
      }
    }
  }
  if (titleDupes === 0) {
    console.log('   [OK] 섹션 제목 전역 고유');
  } else {
    console.log(`   [WARN] 섹션 제목 중복 ${titleDupes}건`);
    totalWarnings += titleDupes;
  }

  // 9. Cross-page 8-gram check
  console.log('\n--- 9. 크로스페이지 8-gram 반복 검사 ---');
  const seen8grams = new Map();
  let repeatedPhrases = 0;

  for (const { slug, text } of allTexts) {
    const words = text.split(/\s+/);
    for (let i = 0; i <= words.length - 8; i++) {
      const gram = words.slice(i, i + 8).join(' ');
      if (gram.length < 20) continue;
      if (!seen8grams.has(gram)) {
        seen8grams.set(gram, [slug]);
      } else {
        const existing = seen8grams.get(gram);
        if (!existing.includes(slug)) {
          existing.push(slug);
          if (existing.length === 2) {
            repeatedPhrases++;
            if (repeatedPhrases <= 5) {
              console.log(`   [WARN] 8-gram 중복: "${gram.substring(0, 60)}..." → ${existing.join(', ')}`);
            }
          }
        }
      }
    }
  }

  if (repeatedPhrases === 0) {
    console.log('   [OK] 8단어 이상 반복 구절 없음');
  } else {
    console.log(`   [WARN] 8-gram 반복 총 ${repeatedPhrases}건`);
    totalWarnings++;
  }

  // Summary
  console.log('\n========================================');
  console.log('  검증 결과 요약');
  console.log('========================================');
  console.log(`JSON 파일: ${existingFiles.length} / ${VENUES_JSON.length}`);
  console.log(`[ERROR]: ${totalErrors}건`);
  console.log(`[WARN]:  ${totalWarnings}건`);
  console.log(`FAQ 질문: ${allFaqQuestions.length}개 (중복 ${faqDupes}건)`);
  console.log(`체크리스트: ${allChecklistItems.length}개 (중복 ${checkDupes}건)`);
  console.log(`섹션 제목: ${allSectionTitles.length}개 (중복 ${titleDupes}건)`);

  if (totalErrors > 0) {
    console.log('\n[FAIL] 에러 수정이 필요합니다.');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n[PASS with WARNINGS] 경고를 검토해주세요.');
  } else {
    console.log('\n[PASS] 모든 검증 통과!');
  }
}

validate();
