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

/* 클립보드 복사 + 토스트 */
(function(){
  var toast = document.querySelector('.toast');
  var timer = null;

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(function(){ toast.hidden = true; }, 1800);
  }

  function copyText(text){
    if (navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  var btns = document.querySelectorAll('[data-copy]');
  btns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var text = btn.getAttribute('data-copy');
      if (!text) return;
      copyText(text).then(function(){
        showToast('카톡 아이디가 복사되었습니다');
      }).catch(function(){
        showToast('복사에 실패했습니다. 수동으로 입력해 주세요.');
      });
    });
  });
})();

/* 스텝퍼 스크롤스파이 + 완료 토글 */
(function(){
  var nav = document.querySelector('.stepper-nav');
  if (!nav) return;
  var items = nav.querySelectorAll('li');
  var steps = [];
  items.forEach(function(li){
    var a = li.querySelector('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    var el = document.querySelector(href);
    if (el) steps.push({ li: li, el: el });
  });
  if (!steps.length) return;

  function update(){
    var scrollY = window.scrollY || window.pageYOffset;
    var activeIdx = -1;
    steps.forEach(function(s, i){
      if (s.el.offsetTop - 140 <= scrollY) activeIdx = i;
    });
    steps.forEach(function(s, i){
      s.li.classList.toggle('active', i === activeIdx);
      if (i < activeIdx) s.li.classList.add('done');
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
