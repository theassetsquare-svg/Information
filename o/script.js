const ctaPhone = document.querySelector('.cta-phone');

const syncCtaHeight = () => {
  if (!ctaPhone) return;
  const height = ctaPhone.offsetHeight;
  document.documentElement.style.setProperty('--cta-h', `${height}px`);
};

syncCtaHeight();
window.addEventListener('resize', syncCtaHeight);
