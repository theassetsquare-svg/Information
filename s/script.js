const toast = document.querySelector('.toast');
const copyTargets = document.querySelectorAll('[data-copy]');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}

copyTargets.forEach((link) => {
  link.addEventListener('click', async () => {
    const text = link.dataset.copy;
    if (!text) return;
    try {
      await copyText(text);
      showToast('카톡 아이디가 복사되었습니다');
    } catch (error) {
      showToast('복사에 실패했습니다. 수동으로 입력해 주세요.');
    }
  });
});

const HERO_LAYOUTS = [
  'poster-split',
  'folded-poster',
  'stacked-card',
  'map-frame',
  'timeline-slab',
  'radio-grid',
  'notebook-dock',
  'catalogue',
  'field-note',
  'sticker-wall'
];

const HERO_TONES = [
  'archival',
  'noir',
  'minimal',
  'warm',
  'calm',
  'documentary',
  'lyric',
  'practical',
  'precise',
  'slow-breath'
];

const NAV_TYPES = [
  'rail',
  'tab',
  'bookmark',
  'breadcrumb',
  'index-card',
  'ticker',
  'floating-dot',
  'side-flag',
  'stamp',
  'paperclip'
];

const NAV_LABEL_STYLES = [
  'short',
  'caps',
  'noun',
  'verb',
  'emoji-less',
  'mono',
  'dual',
  'thin',
  'bold',
  'capsule'
];

const PROBLEM_FRAMES = [
  'direction',
  'timing',
  'contact',
  'noise',
  'crowd',
  'sequence',
  'decision',
  'clarity',
  'exit',
  'etiquette'
];

const PROBLEM_CONTEXTS = [
  'first-visit',
  'late-night',
  'rain',
  'weekend',
  'weekday',
  'peak-hour',
  'quiet-hour',
  'solo',
  'pair',
  'group'
];

const COMPONENT_TYPES = [
  'fold-panel',
  'card-deck',
  'timeline',
  'radio-guide',
  'memo-block',
  'stamp-grid',
  'index-list',
  'check-strip',
  'bulletin',
  'gallery'
];

const COMPONENT_SKINS = [
  'paper',
  'linen',
  'ink',
  'chalk',
  'stamp',
  'soft',
  'mono',
  'glass',
  'grain',
  'atlas'
];

const HERO_MATRIX = HERO_LAYOUTS.flatMap((layout) =>
  HERO_TONES.map((tone) => `${layout}:${tone}`)
);
const NAV_MATRIX = NAV_TYPES.flatMap((type) =>
  NAV_LABEL_STYLES.map((style) => `${type}:${style}`)
);
const PROBLEM_MATRIX = PROBLEM_FRAMES.flatMap((frame) =>
  PROBLEM_CONTEXTS.map((context) => `${frame}:${context}`)
);
const COMPONENT_MATRIX = COMPONENT_TYPES.flatMap((type) =>
  COMPONENT_SKINS.map((skin) => `${type}:${skin}`)
);

const archetypeId = document.body.dataset.archetype;
const navId = document.body.dataset.nav;
const heroId = document.body.dataset.hero;

if (HERO_MATRIX.length < 100 || NAV_MATRIX.length < 100 || PROBLEM_MATRIX.length < 100 || COMPONENT_MATRIX.length < 100) {
  console.warn('Matrix size check failed');
}

if (!archetypeId || !navId || !heroId) {
  console.warn('Archetype identifiers missing');
}
