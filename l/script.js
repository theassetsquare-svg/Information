const ctaBtn = document.querySelector('.cta-btn');

const syncCtaHeight = () => {
  if (!ctaBtn) return;
  const height = ctaBtn.offsetHeight;
  document.documentElement.style.setProperty('--cta-h', `${height}px`);
};

syncCtaHeight();
window.addEventListener('resize', syncCtaHeight);
