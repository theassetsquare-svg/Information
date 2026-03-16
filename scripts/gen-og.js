#!/usr/bin/env node
/**
 * OG 이미지 생성 스크립트 — SVG 기반 1200x630 고유 썸네일
 * Usage: node scripts/gen-og.js
 */
const fs = require('fs');
const path = require('path');

const venues = require('../src/data/venues.json');
const outDir = path.join(__dirname, '..', 'public', 'og');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function makeSvg(title, subtitle, accent = '#D4AF37') {
  // Escape XML entities
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const t = esc(title);
  const s = esc(subtitle);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a1408"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
  <text x="600" y="260" text-anchor="middle" font-family="Georgia,serif" font-size="56" font-weight="700" fill="${accent}">${t}</text>
  <text x="600" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#F7E7CE">${s}</text>
  <text x="600" y="520" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#F7E7CE" opacity="0.6">GOLD NIGHT GUIDE</text>
  <line x1="480" y1="380" x2="720" y2="380" stroke="${accent}" stroke-width="1" opacity="0.5"/>
</svg>`;
}

// Home
fs.writeFileSync(path.join(outDir, 'home.png'), makeSvg('골드나잇 가이드', '전국 클럽·나이트·라운지'));

// Categories
fs.writeFileSync(path.join(outDir, 'clubs.png'), makeSvg('전국 클럽 가이드', '강남·홍대·이태원·부산·제주'));
fs.writeFileSync(path.join(outDir, 'nights.png'), makeSvg('전국 나이트 가이드', '수유·인천·수원·대전·울산'));
fs.writeFileSync(path.join(outDir, 'lounges.png'), makeSvg('서울 라운지 가이드', '강남·압구정·청담·해운대'));

// Each venue
for (const v of venues) {
  const catLabel = v.cat_slug === 'club' ? '클럽' : v.cat_slug === 'night' ? '나이트' : '라운지';
  const subtitle = `${v.region} ${v.district} ${catLabel}`;
  const filename = `${v.cat_slug}-${v.slug}.png`;
  fs.writeFileSync(path.join(outDir, filename), makeSvg(v.name, subtitle));
}

console.log(`Generated ${venues.length + 4} OG images in public/og/`);
