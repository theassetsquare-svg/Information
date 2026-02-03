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

FONT_LINK = "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css\">"
UI_LINK = "<link rel=\"stylesheet\" href=\"/ui.css\">"


def inject(content: str) -> str:
    if UI_LINK in content:
        return content
    insertion = "\n" + FONT_LINK + "\n" + UI_LINK + "\n"
    if "</head>" in content:
        return content.replace("</head>", insertion + "</head>")
    return content + insertion


def main():
    for path in HTML_FILES:
        p = Path(path)
        text = p.read_text(encoding="utf-8")
        text = inject(text)
        p.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
