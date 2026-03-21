const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const venues = require('../src/data/venues.json');
const OG_DIR = path.join(__dirname, '..', 'public', 'og');

// Ensure directory exists
if (!fs.existsSync(OG_DIR)) fs.mkdirSync(OG_DIR, { recursive: true });

const catColors = {
  club: '#8B5CF6', night: '#EC4899', lounge: '#06B6D4',
  room: '#3B82F6', yojeong: '#059669', hoppa: '#F43F5E',
};
const catLabels = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function makeSvg({ title, subtitle, bg, textColor = '#FFFFFF' }) {
  const lines = [];
  const escaped = escapeXml(title);
  // Split long names into multiple lines
  if (escaped.length > 12) {
    const mid = Math.ceil(escaped.length / 2);
    const spaceIdx = escaped.lastIndexOf(' ', mid);
    if (spaceIdx > 3) {
      lines.push(escaped.slice(0, spaceIdx));
      lines.push(escaped.slice(spaceIdx + 1));
    } else {
      lines.push(escaped.slice(0, mid));
      lines.push(escaped.slice(mid));
    }
  } else {
    lines.push(escaped);
  }

  const titleY = lines.length > 1 ? 280 : 300;
  const titleSvg = lines.map((line, i) =>
    `<text x="600" y="${titleY + i * 70}" text-anchor="middle" fill="${textColor}" font-family="sans-serif" font-weight="800" font-size="58">${line}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#grad)" opacity="0.3"/>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  ${titleSvg}
  ${subtitle ? `<text x="600" y="${titleY + lines.length * 70 + 20}" text-anchor="middle" fill="${textColor}" font-family="sans-serif" font-weight="400" font-size="28" opacity="0.85">${escapeXml(subtitle)}</text>` : ''}
  <text x="600" y="580" text-anchor="middle" fill="${textColor}" font-family="sans-serif" font-weight="600" font-size="24" opacity="0.6">오늘밤어디</text>
</svg>`;
}

async function generate() {
  let count = 0;

  // 1. Main page
  const mainSvg = makeSvg({
    title: '오늘밤어디',
    subtitle: '클럽 · 나이트 · 라운지 · 룸 · 요정 · 호빠',
    bg: '#8B5CF6',
  });
  await sharp(Buffer.from(mainSvg)).png().toFile(path.join(OG_DIR, 'home.png'));
  count++;
  console.log('✅ home.png');

  // 2. Category pages
  for (const [slug, color] of Object.entries(catColors)) {
    const label = catLabels[slug];
    const svg = makeSvg({
      title: label + ' 전체보기',
      subtitle: '오늘밤어디',
      bg: color,
    });
    const filename = slug === 'club' ? 'clubs.png' : slug === 'night' ? 'nights.png' : slug === 'lounge' ? 'lounges.png' : slug === 'room' ? 'rooms.png' : slug === 'yojeong' ? 'yojeongs.png' : 'hoppas.png';
    await sharp(Buffer.from(svg)).png().toFile(path.join(OG_DIR, filename));
    count++;
    console.log('✅', filename);
  }

  // 3. Venue pages
  for (const venue of venues) {
    const color = catColors[venue.cat_slug] || '#8B5CF6';
    const label = catLabels[venue.cat_slug] || '';
    const nickname = venue.nickname ? `(${venue.nickname})` : '';
    const subtitle = [venue.region, label].filter(Boolean).join(' · ');

    const svg = makeSvg({
      title: venue.name + (nickname ? ' ' + nickname : ''),
      subtitle: subtitle,
      bg: color,
    });

    const filename = `${venue.cat_slug}-${venue.slug}.png`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(OG_DIR, filename));
    count++;
  }

  console.log(`\n✅ Total: ${count} OG images generated`);
}

generate().catch(console.error);
