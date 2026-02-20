const ctaBar = document.querySelector('.cta-bar');

const syncCtaHeight = () => {
  if (!ctaBar) return;
  const height = ctaBar.offsetHeight;
  document.documentElement.style.setProperty('--cta-height', `${height}px`);
};

syncCtaHeight();
window.addEventListener('resize', syncCtaHeight);
