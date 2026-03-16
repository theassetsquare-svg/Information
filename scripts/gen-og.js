#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const venues = require('../src/data/venues.json');
const outDir = path.join(__dirname, '..', 'public', 'og');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function makeSvg(title, subtitle, accent = '#8B5CF6') {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="#F9FAFB" stroke="${accent}" stroke-width="2" opacity="0.5"/>
  <text x="600" y="260" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="700" fill="#111111">${esc(title)}</text>
  <text x="600" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="#555555">${esc(subtitle)}</text>
  <text x="600" y="510" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="${accent}" opacity="0.7">informationa.pages.dev</text>
  <line x1="460" y1="370" x2="740" y2="370" stroke="${accent}" stroke-width="2" opacity="0.3"/>
</svg>`;
}

fs.writeFileSync(path.join(outDir, 'home.png'), makeSvg('골드나잇 가이드', '전국 클럽·나이트·라운지'));
fs.writeFileSync(path.join(outDir, 'clubs.png'), makeSvg('전국 클럽 가이드', '강남·홍대·이태원·부산·제주'));
fs.writeFileSync(path.join(outDir, 'nights.png'), makeSvg('전국 나이트 가이드', '수유·인천·수원·대전·울산'));
fs.writeFileSync(path.join(outDir, 'lounges.png'), makeSvg('서울 라운지 가이드', '강남·압구정·청담·해운대'));

for (const v of venues) {
  const catLabel = v.cat_slug === 'club' ? '클럽' : v.cat_slug === 'night' ? '나이트' : '라운지';
  fs.writeFileSync(path.join(outDir, `${v.cat_slug}-${v.slug}.png`), makeSvg(v.name, `${v.region} ${v.district} ${catLabel}`));
}
console.log(`Generated ${venues.length + 4} OG images`);
