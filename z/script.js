/* /z/ 수유샴푸나이트 실전 플로우 */
(function () {
  "use strict";

  /* 타임라인 내비 active 상태 — IntersectionObserver */
  var stages = document.querySelectorAll(".pipe-stage, .pipe-scene, .pipe-faq, .pipe-closing");
  var navLinks = document.querySelectorAll(".tl-node");

  if (stages.length && navLinks.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    stages.forEach(function (s) { if (s.id) obs.observe(s); });
  }

  /* 부드러운 스크롤 */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
