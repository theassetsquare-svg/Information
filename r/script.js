const dock = document.querySelector('.r-call');

const syncDockHeight = () => {
  if (!dock) return;
  const height = dock.offsetHeight;
  document.documentElement.style.setProperty('--r-dock-height', `${height}px`);
};

syncDockHeight();
window.addEventListener('resize', syncDockHeight);
