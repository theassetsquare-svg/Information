const callbar = document.querySelector('.callbar');

const updateCallbarHeight = () => {
  if (!callbar) return;
  const height = callbar.offsetHeight;
  document.documentElement.style.setProperty('--callbar-height', `${height}px`);
};

updateCallbarHeight();
window.addEventListener('resize', updateCallbarHeight);
