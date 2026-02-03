#!/usr/bin/env python3
from pathlib import Path
import re

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

STYLE_BLOCK_RE = re.compile(r"<style(?![^>]*age-gate-style)[^>]*>[\s\S]*?</style>", re.IGNORECASE)
STYLE_ATTR_RE = re.compile(r"\sstyle=\"[^\"]*\"")
STYLE_ATTR_RE_SQ = re.compile(r"\sstyle='[^']*'")


def clean_html(text: str) -> str:
    text = STYLE_BLOCK_RE.sub("", text)
    text = STYLE_ATTR_RE.sub("", text)
    text = STYLE_ATTR_RE_SQ.sub("", text)
    return text


def main():
    for path in HTML_FILES:
        p = Path(path)
        text = p.read_text(encoding="utf-8")
        text = clean_html(text)
        p.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
