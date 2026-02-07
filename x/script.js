/* 하단 고정바 높이 동기화 */
(function(){
  var bar = document.querySelector('.bottom-bar');
  if (!bar) return;
  function sync(){
    document.documentElement.style.setProperty('--bar-h', bar.offsetHeight + 'px');
  }
  sync();
  window.addEventListener('resize', sync);
})();

/* 사이드 진행바 스크롤스파이 */
(function(){
  var nav = document.querySelector('.side-progress');
  if (!nav) return;
  var items = nav.querySelectorAll('li');
  var ids = [];
  items.forEach(function(li){
    var a = li.querySelector('a');
    if (a && a.dataset.spy) ids.push({ id: a.dataset.spy, li: li });
  });
  if (!ids.length) return;

  function update(){
    var scrollY = window.scrollY || window.pageYOffset;
    var current = null;
    ids.forEach(function(entry){
      var el = document.getElementById(entry.id);
      if (el && el.offsetTop - 120 <= scrollY) current = entry;
    });
    ids.forEach(function(entry){
      entry.li.classList.toggle('active', entry === current);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
