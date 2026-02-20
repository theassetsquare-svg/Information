/* /y/ Decision Canvas script */
(function(){
  'use strict';

  /* 카드형 목차 클릭 시 부드러운 스크롤 */
  var tocCards = document.querySelectorAll('.toc-card');
  tocCards.forEach(function(card){
    card.addEventListener('click', function(e){
      var href = card.getAttribute('href');
      if(!href) return;
      var target = document.querySelector(href);
      if(target){
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    });
  });
})();
