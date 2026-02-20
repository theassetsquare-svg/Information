const ctaBar = document.querySelector('.cta-bar');
const copyBtn = document.querySelector('[data-copy]');
const kakaoBtn = document.querySelector('[data-kakao]');
const toast = document.querySelector('.toast');
const kakaoId = 'besta12';

const syncCtaHeight = () => {
  if (!ctaBar) return;
  const height = ctaBar.offsetHeight;
  document.documentElement.style.setProperty('--cta-height', `${height}px`);
};

const showToast = () => {
  if (!toast) return;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1600);
};

const copyKakao = async () => {
  try {
    await navigator.clipboard.writeText(kakaoId);
    showToast();
  } catch (e) {
    const temp = document.createElement('textarea');
    temp.value = kakaoId;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast();
  }
};

const openKakao = () => {
  window.location.href = 'kakaotalk://';
  window.setTimeout(() => {
    window.open('https://open.kakao.com/', '_blank', 'noopener');
  }, 600);
};

syncCtaHeight();
window.addEventListener('resize', syncCtaHeight);

if (copyBtn) copyBtn.addEventListener('click', copyKakao);
if (kakaoBtn) kakaoBtn.addEventListener('click', openKakao);
