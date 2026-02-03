#!/usr/bin/env python3
from pathlib import Path

HTML_FILES = [
    "index.html",
    "404.html",
    "b/index.html",
    "f/index.html",
    "i/index.html",
    "j/index.html",
    "k/index.html",
    "l/index.html",
    "m/index.html",
    "og/preview.html",
    "og/preview-1x1.html",
]

STYLE = """
<style id=\"age-gate-style\">
  #age-gate-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.86);z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;text-align:center}
  #age-gate-overlay .age-card{max-width:420px;background:#121212;border-radius:16px;padding:24px 22px;box-shadow:0 10px 30px rgba(0,0,0,0.4)}
  #age-gate-overlay h2{margin:0 0 12px;font-size:20px;color:#fff;letter-spacing:-0.3px}
  #age-gate-overlay p{margin:0 0 18px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.7}
  #age-gate-overlay .age-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  #age-gate-confirm{padding:12px 22px;border:none;border-radius:10px;background:#e94560;color:#fff;font-size:14px;font-weight:700;cursor:pointer}
  #age-gate-exit{padding:12px 22px;border:1px solid rgba(255,255,255,0.2);border-radius:10px;background:transparent;color:#fff;font-size:14px;font-weight:700;text-decoration:none;display:inline-block}
</style>
"""

OVERLAY = """
<div id=\"age-gate-overlay\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"age-gate-title\">
  <div class=\"age-card\">
    <h2 id=\"age-gate-title\">본 페이지는 만 19세 이상을 대상으로 합니다</h2>
    <p>04:00~20:00 시간대에는 성인 확인 안내가 표시됩니다. 만 19세 미만은 청소년 보호법에 따라 관련 정보 열람이 제한됩니다.</p>
    <div class=\"age-actions\">
      <button id=\"age-gate-confirm\" type=\"button\">19세 이상입니다</button>
      <a id=\"age-gate-exit\" href=\"https://informationa.pages.dev/\">나가기</a>
    </div>
  </div>
</div>
"""

SCRIPT = """
<script id=\"age-gate-script\">
(function(){
  var ua = navigator.userAgent || "";
  if (/Yeti/i.test(ua)) return;
  var now = new Date();
  var hour = now.getHours();
  var show = (hour >= 4 && hour < 20);
  if (!show) return;
  var overlay = document.getElementById("age-gate-overlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  var btn = document.getElementById("age-gate-confirm");
  if (btn) {
    btn.addEventListener("click", function(){ overlay.style.display = "none"; });
  }
})();
</script>
"""


def inject(content: str) -> str:
    if "age-gate-overlay" in content:
        return content

    if "</head>" in content:
        content = content.replace("</head>", STYLE + "\n</head>")
    else:
        content = STYLE + content

    if "</body>" in content:
        content = content.replace("</body>", OVERLAY + "\n" + SCRIPT + "\n</body>")
    else:
        content = content + OVERLAY + "\n" + SCRIPT

    return content


def main():
    for path in HTML_FILES:
        p = Path(path)
        text = p.read_text(encoding="utf-8")
        text = inject(text)
        p.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
