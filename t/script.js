/* 하단 고정바 높이 동기화 */
(function(){
  var bar = document.querySelector('.sticky-bar');
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

/* 탭 전환 */
(function(){
  var btns = document.querySelectorAll('.tab-btn');
  if (!btns.length) return;

  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var key = btn.getAttribute('data-tab');
      // 탭 버튼 활성화
      btns.forEach(function(b){
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // 패널 전환
      var panels = document.querySelectorAll('.tab-panel');
      panels.forEach(function(p){
        var isTarget = p.id === 'panel-' + key;
        p.classList.toggle('active', isTarget);
        p.hidden = !isTarget;
      });
    });
  });
})();
