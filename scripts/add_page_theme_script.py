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

SCRIPT = """
<script id=\"page-theme-script\">
(function(){
  var path = location.pathname || "/";
  var theme = "neutral";
  if (path === "/" || path === "/index.html") theme = "home";
  else if (path.indexOf("/b/") === 0) theme = "b";
  else if (path.indexOf("/f/") === 0) theme = "f";
  else if (path.indexOf("/i/") === 0) theme = "i";
  else if (path.indexOf("/j/") === 0) theme = "j";
  else if (path.indexOf("/k/") === 0) theme = "k";
  else if (path.indexOf("/l/") === 0) theme = "l";
  else if (path.indexOf("/m/") === 0) theme = "m";
  else if (path.indexOf("/og/") === 0) theme = "preview";
  document.body.setAttribute("data-theme", theme);
})();
</script>
"""


def inject(content: str) -> str:
    if "page-theme-script" in content:
        return content
    if "</body>" in content:
        return content.replace("</body>", SCRIPT + "\n</body>")
    return content + SCRIPT


def main():
    for path in HTML_FILES:
        p = Path(path)
        text = p.read_text(encoding="utf-8")
        text = inject(text)
        p.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
