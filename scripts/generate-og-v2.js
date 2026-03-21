const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const venues = require('../src/data/venues.json');
const OG_DIR = path.join(__dirname, '..', 'public', 'og');
if (!fs.existsSync(OG_DIR)) fs.mkdirSync(OG_DIR, { recursive: true });

const catColors = {
  club: '#8B5CF6', night: '#EC4899', lounge: '#06B6D4',
  room: '#3B82F6', yojeong: '#059669', hoppa: '#F43F5E',
};
const catLabels = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function svg({ bg, lines, sub, footer }) {
  const titleBlocks = lines.map((line, i) => {
    const y = 260 + i * 80;
    return `<text x="600" y="${y}" text-anchor="middle" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="72" letter-spacing="-1">${esc(line)}</text>`;
  }).join('\n');

  const subY = 260 + lines.length * 80 + 10;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="630" fill="#000000" opacity="0.08"/>
  ${titleBlocks}
  ${sub ? `<text x="600" y="${subY}" text-anchor="middle" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="400" font-size="32" opacity="0.85">${esc(sub)}</text>` : ''}
  ${footer ? `<text x="600" y="580" text-anchor="middle" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="28" opacity="0.5">${esc(footer)}</text>` : ''}
</svg>`;
}

function splitName(name) {
  if (name.length <= 10) return [name];
  const space = name.indexOf(' ');
  if (space > 0 && space < name.length - 1) return [name.slice(0, space), name.slice(space + 1)];
  const mid = Math.ceil(name.length / 2);
  return [name.slice(0, mid), name.slice(mid)];
}

async function run() {
  let n = 0;

  // 1. 메인페이지
  const mainSvg = svg({
    bg: '#8B5CF6',
    lines: ['오늘밤어디'],
    sub: '전국 클럽 · 나이트 · 라운지 · 룸 · 요정 · 호빠',
    footer: 'informationa.pages.dev',
  });
  await sharp(Buffer.from(mainSvg)).png({ quality: 90 }).toFile(path.join(OG_DIR, 'home.png'));
  n++;
  console.log('✅ home.png', (fs.statSync(path.join(OG_DIR, 'home.png')).size / 1024).toFixed(1) + 'KB');

  // 2. 카테고리 페이지 6개
  const catFiles = { club: 'clubs', night: 'nights', lounge: 'lounges', room: 'rooms', yojeong: 'yojeongs', hoppa: 'hoppas' };
  for (const [slug, file] of Object.entries(catFiles)) {
    const s = svg({
      bg: catColors[slug],
      lines: [catLabels[slug] + ' 전체보기'],
      sub: '오늘밤어디',
      footer: 'informationa.pages.dev',
    });
    await sharp(Buffer.from(s)).png({ quality: 90 }).toFile(path.join(OG_DIR, file + '.png'));
    n++;
  }
  console.log('✅ 카테고리 6개');

  // 3. 업소 114개
  for (const v of venues) {
    const color = catColors[v.cat_slug] || '#8B5CF6';
    const nick = v.nickname ? ` (${v.nickname})` : '';
    const fullName = v.name + nick;
    const lines = splitName(fullName);
    const sub = [v.region, catLabels[v.cat_slug]].filter(Boolean).join(' · ');

    const s = svg({ bg: color, lines, sub, footer: '오늘밤어디' });
    const filename = `${v.cat_slug}-${v.slug}.png`;
    await sharp(Buffer.from(s)).png({ quality: 90 }).toFile(path.join(OG_DIR, filename));
    n++;
  }

  console.log(`✅ 업소 ${venues.length}개`);
  console.log(`\n🎉 총 ${n}개 OG 이미지 생성 완료`);

  // 검증
  const homeSize = fs.statSync(path.join(OG_DIR, 'home.png')).size;
  const header = Buffer.alloc(4);
  const fd = fs.openSync(path.join(OG_DIR, 'home.png'), 'r');
  fs.readSync(fd, header, 0, 4, 0);
  fs.closeSync(fd);
  console.log(`home.png: ${homeSize} bytes, PNG=${header[0]===0x89 && header[1]===0x50}`);
}

run().catch(console.error);
