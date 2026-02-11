/* /b/ 현장 체크 로그북 script */
(function(){
  'use strict';
  /* 최초 로드 시 첫 번째 토글 항목 자동 오픈 */
  var first = document.querySelector('.toggle-item');
  if(first) first.setAttribute('open','');
})();
