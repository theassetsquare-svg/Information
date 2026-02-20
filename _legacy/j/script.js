const ctaBar = document.querySelector('.cta-bar');

const updateCtaHeight = () => {
  if (!ctaBar) return;
  const height = ctaBar.offsetHeight;
  document.documentElement.style.setProperty('--cta-h', `${height}px`);
};

updateCtaHeight();
window.addEventListener('resize', updateCtaHeight);
