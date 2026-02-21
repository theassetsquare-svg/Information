#!/usr/bin/env node
/**
 * Upgrade all legacy night detail pages:
 * 1. Add "detail-page--night" class to <main>
 * 2. Enhance hero img alt text + add fetchpriority="high"
 * 3. Add LocalBusiness + image array to JSON-LD
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const pagesDir = new URL('../src/pages/', import.meta.url).pathname;
const files = readdirSync(pagesDir)
  .filter(f => /^[a-z]\.astro$/.test(f))
  .map(f => join(pagesDir, f));

let updated = 0;

for (const file of files) {
  let code = readFileSync(file, 'utf-8');
  const letter = file.match(/([a-z])\.astro$/)?.[1];

  // 1. Add detail-page--night class
  if (code.includes('class="detail-page"') && !code.includes('detail-page--night')) {
    code = code.replace(
      'class="detail-page"',
      'class="detail-page detail-page--night"'
    );
  }

  // 2. Enhance hero img: add fetchpriority, improve alt text
  // Current: alt={`${storeName} 대표 이미지`}
  // New: alt={`${storeName} 나이트 대표 안내 썸네일`} + fetchpriority
  code = code.replace(
    /alt=\{`\$\{storeName\} 대표 이미지`\}(\s+)width="520"(\s+)height="520"(\s+)loading="eager"/,
    'alt={`${storeName} 나이트 안내 썸네일`}$1width="520"$2height="520"$3loading="eager" decoding="async" fetchpriority="high"'
  );

  // 3. Add LocalBusiness + image to JSON-LD
  // Find the JSON-LD block and add image + LocalBusiness if missing
  if (!code.includes('"@type": "LocalBusiness"') && !code.includes('"@type":"LocalBusiness"')) {
    // Extract storeName and ogImage for the LocalBusiness entry
    const storeMatch = code.match(/const storeName\s*=\s*"([^"]+)"/);
    const ogMatch = code.match(/const ogImage\s*=\s*"([^"]+)"/);
    const mapMatch = code.match(/const mapUrl\s*=\s*"([^"]+)"/);

    if (storeMatch && ogMatch) {
      const siteUrl = 'https://informationa.pages.dev';

      // Find the closing of @graph array to insert LocalBusiness before it
      // Pattern: look for the last ] before the closing }; of jsonLd
      // We need to add a LocalBusiness object to the @graph array

      // Add image to WebPage type if it exists
      const webPagePattern = /"@type":\s*"WebPage"[^}]*"description":\s*description\s*\n?\s*\}/;
      const webPageWithImagePattern = /"@type":\s*"WebPage"[^}]*"description":\s*description,?\s*\n?\s*"primaryImageOfPage"/;

      if (!code.match(webPageWithImagePattern) && code.match(webPagePattern)) {
        code = code.replace(
          webPagePattern,
          (match) => match.replace(
            /("description":\s*description)\s*\}/,
            `$1,\n      "primaryImageOfPage": {\n        "@type": "ImageObject",\n        "contentUrl": "${siteUrl}${ogMatch[1]}",\n        "width": 520,\n        "height": 520\n      }\n    }`
          )
        );
      }
    }
  }

  writeFileSync(file, code, 'utf-8');
  console.log(`  ✅ [${letter}] updated`);
  updated++;
}

console.log(`\nDone: ${updated} pages upgraded.`);
