const callbar = document.querySelector('.callbar');

const syncCallbarHeight = () => {
  if (!callbar) return;
  const height = callbar.offsetHeight;
  document.documentElement.style.setProperty('--callbar-height', `${height}px`);
};

syncCallbarHeight();
window.addEventListener('resize', syncCallbarHeight);
