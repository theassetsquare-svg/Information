/* Nightlife Directory — main.js */
(function () {
  "use strict";

  /* ── Venue data for search autocomplete ── */
  var venues = [
    { name: "Club RACE", region: "강남", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "Octagon", region: "강남", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "Club ARTE", region: "강남", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "Club MUIN", region: "강남", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "B1", region: "홍대", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "Club LASER", region: "홍대", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "AURA", region: "홍대", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "SABOTAGE", region: "홍대", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "Faust", region: "이태원", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "CODE Lounge", region: "압구정", cat: "라운지", thumb: "images/girl-model-party.png", url: null },
    { name: "HYPE Seoul", region: "압구정", cat: "라운지", thumb: "images/girl-model-party.png", url: null },
    { name: "Club 82", region: "청담", cat: "클럽", thumb: "images/girl-model-party.png", url: null },
    { name: "수유샴푸나이트", region: "수유", cat: "나이트", thumb: "/y/og-image.jpg", url: "/y/" },
    { name: "상봉동한국관나이트", region: "상봉", cat: "나이트", thumb: "/b/og-image.jpg", url: "/b/" },
    { name: "인천아라비안나이트", region: "인천", cat: "나이트", thumb: "/i/og-image.jpg", url: "/i/" },
    { name: "파주야당스카이돔나이트", region: "파주", cat: "나이트", thumb: "/f/og-image.jpg", url: "/f/" },
    { name: "수원찬스돔나이트", region: "수원", cat: "나이트", thumb: "/j/og-image.jpg", url: "/j/" },
    { name: "신림그랑프리나이트", region: "신림", cat: "나이트", thumb: "/l/og-image.jpg", url: "/l/" },
    { name: "대전세븐나이트", region: "대전", cat: "나이트", thumb: "/t/og-image.jpg", url: "/t/" },
    { name: "인덕원국빈관나이트", region: "인덕원", cat: "나이트", thumb: "/q/og-image.jpg", url: "/q/" },
    { name: "울산챔피언나이트", region: "울산", cat: "나이트", thumb: "/r/og-image.jpg", url: "/r/" },
    { name: "일산샴푸나이트", region: "일산", cat: "나이트", thumb: "/s/og-image.jpg", url: "/s/" },
    { name: "청담h2o나이트", region: "청담", cat: "나이트", thumb: "/x/og-image.jpg", url: "/x/" }
  ];

  /* ── Search autocomplete ── */
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var activeIdx = -1;

  function renderResults(matches) {
    if (matches.length === 0) {
      searchResults.classList.remove("is-open");
      searchResults.innerHTML = "";
      activeIdx = -1;
      return;
    }
    var html = matches.map(function (v, i) {
      var href = v.url || "#recommend";
      return '<a class="search-item" href="' + href + '"' +
        (v.url ? ' target="_blank" rel="noopener noreferrer"' : '') +
        ' role="option" data-idx="' + i + '">' +
        '<div class="search-item__thumb"><img src="' + v.thumb + '" alt="" loading="lazy" width="40" height="40"></div>' +
        '<div class="search-item__info">' +
        '<span class="search-item__name">' + v.name + '</span>' +
        '<span class="search-item__meta">' + v.region + ' · ' + v.cat + '</span>' +
        '</div></a>';
    }).join("");
    searchResults.innerHTML = html;
    searchResults.classList.add("is-open");
    activeIdx = -1;
  }

  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (q.length === 0) { renderResults([]); return; }
    var matches = venues.filter(function (v) {
      return v.name.toLowerCase().indexOf(q) !== -1 ||
             v.region.indexOf(q) !== -1 ||
             v.cat.indexOf(q) !== -1;
    });
    renderResults(matches.slice(0, 8));
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", function () { doSearch(this.value); });

    searchInput.addEventListener("keydown", function (e) {
      var items = searchResults.querySelectorAll(".search-item");
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIdx = (activeIdx + 1) % items.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIdx = (activeIdx - 1 + items.length) % items.length;
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIdx >= 0 && items[activeIdx]) {
          items[activeIdx].click();
        } else if (items[0]) {
          items[0].click();
        }
        return;
      } else if (e.key === "Escape") {
        renderResults([]);
        searchInput.blur();
        return;
      } else {
        return;
      }
      items.forEach(function (el) { el.classList.remove("is-active"); });
      if (items[activeIdx]) items[activeIdx].classList.add("is-active");
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-box")) {
        searchResults.classList.remove("is-open");
        activeIdx = -1;
      }
    });

    var searchBtn = document.querySelector(".search-box__btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        var items = searchResults.querySelectorAll(".search-item");
        if (items.length > 0) {
          items[0].click();
        }
      });
    }
  }

  /* ── Quick Filters ── */
  var regionBar = document.querySelector('[data-filter="region"]');
  var categoryBar = document.querySelector('[data-filter="category"]');
  var venueGrid = document.getElementById("venue-grid");
  var noResults = document.getElementById("no-results");
  var activeRegion = "all";
  var activeCat = "all";

  function applyFilters() {
    if (!venueGrid) return;
    var cards = venueGrid.querySelectorAll("[data-region]");
    var visibleCount = 0;
    cards.forEach(function (card) {
      var matchR = activeRegion === "all" || card.getAttribute("data-region") === activeRegion;
      var matchC = activeCat === "all" || card.getAttribute("data-cat") === activeCat;
      if (matchR && matchC) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  function bindFilterBar(bar, setFn) {
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var pill = e.target.closest(".filter-pill");
      if (!pill) return;
      bar.querySelectorAll(".filter-pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      setFn(pill.getAttribute("data-value"));
      applyFilters();
    });
  }

  bindFilterBar(regionBar, function (v) { activeRegion = v; });
  bindFilterBar(categoryBar, function (v) { activeCat = v; });

  /* ── Scroll reveal ── */
  function initReveal() {
    var elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || elements.length === 0) {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  initReveal();
})();
