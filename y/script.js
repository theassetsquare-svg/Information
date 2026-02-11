/* /y/ 전용 스크립트 */
(function(){
  'use strict';

  /* 탭 전환 */
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = btn.getAttribute('data-tab');
      tabBtns.forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      tabPanels.forEach(function(p){ p.classList.remove('active'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      var panel = document.getElementById('panel-' + target);
      if(panel) panel.classList.add('active');
    });
  });

  /* 사이드 프로그레스 TOC 활성화 (Intersection Observer) */
  var tocLinks = document.querySelectorAll('.progress-toc a');
  var sections = [];
  tocLinks.forEach(function(link){
    var href = link.getAttribute('href');
    if(href){
      var sec = document.querySelector(href);
      if(sec) sections.push({el: sec, link: link});
    }
  });

  if(sections.length > 0 && 'IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          tocLinks.forEach(function(l){ l.classList.remove('active'); });
          sections.forEach(function(s){
            if(s.el === entry.target) s.link.classList.add('active');
          });
        }
      });
    }, {rootMargin: '-80px 0px -60% 0px', threshold: 0});

    sections.forEach(function(s){ observer.observe(s.el); });
  }
})();
