#!/usr/bin/env python3
import re
from pathlib import Path

SITE_URL = "https://informationa.pages.dev"
DATE = "2026-02-03"
DATE_TIME = "2026-02-03T00:00:00+09:00"

PAGES = {
    "b/index.html": {"name": "상봉동한국관나이트", "area": "서울 중랑구 상봉동"},
    "j/index.html": {"name": "수원찬스돔나이트", "area": "경기도 수원시 수원역 인근"},
    "l/index.html": {"name": "신림그랑프리나이트", "area": "서울 관악구 신림역 인근"},
    "i/index.html": {"name": "인천아라비안나이트", "area": "인천광역시 일대"},
    "f/index.html": {"name": "파주야당스카이돔나이트", "area": "경기도 파주시 야당역 인근"},
}

NOTICE_HTML = (
    "<div class=\"notice\">\n"
    "  <div class=\"notice-inner\">\n"
    "    <strong>안내</strong><br>\n"
    "    이 페이지는 공개적으로 확인 가능한 정보를 바탕으로 정리한 안내 자료입니다.<br>\n"
    "    운영 정보는 업소 정책에 따라 변동될 수 있으므로 방문 전 공식 안내를 확인해 주세요.<br>\n"
    "    권리 침해 관련 요청이 있을 경우 확인 후 조치하겠습니다.\n"
    "  </div>\n"
    "</div>\n"
)

FAQ_ITEMS = (
    "      <div class=\"faq-item\">\n"
    "        <div class=\"faq-q\">Q. 위치는 어디인가요?</div>\n"
    "        <div class=\"faq-a\">A. {area} 일대에 위치하며, 정확한 주소는 공식 안내를 확인해 주세요.</div>\n"
    "      </div>\n"
    "      <div class=\"faq-item\">\n"
    "        <div class=\"faq-q\">Q. 운영 시간은 어떻게 확인하나요?</div>\n"
    "        <div class=\"faq-a\">A. 운영 시간은 변동될 수 있으므로 방문 전 공식 안내를 확인하는 것이 좋습니다.</div>\n"
    "      </div>\n"
    "      <div class=\"faq-item\">\n"
    "        <div class=\"faq-q\">Q. 입장 조건이 있나요?</div>\n"
    "        <div class=\"faq-a\">A. 연령 제한과 입장 기준은 업소 정책에 따라 달라질 수 있습니다.</div>\n"
    "      </div>\n"
    "      <div class=\"faq-item\">\n"
    "        <div class=\"faq-q\">Q. 드레스코드가 있나요?</div>\n"
    "        <div class=\"faq-a\">A. 복장 규정은 업소별로 상이하며, 단정한 복장을 권장합니다.</div>\n"
    "      </div>\n"
)


def build_article(name, area, has_article=True):
    content = (
        "  <div class=\"section\">\n"
        "    <div class=\"section-label\">안내 요약</div>\n"
        f"    <h2>{name} 안내 요약</h2>\n"
        f"    <p><strong>{name}</strong>는 {area} 나이트클럽 정보를 요약한 안내 페이지입니다. 운영 정보는 변동될 수 있으므로 공식 안내를 확인해 주세요.</p>\n"
        f"    <div class=\"list-item\"><span class=\"list-dot\"></span><span>위치: {area}</span></div>\n"
        "    <div class=\"list-item\"><span class=\"list-dot\"></span><span>운영 시간: 요일 및 행사에 따라 변동 가능</span></div>\n"
        "    <div class=\"list-item\"><span class=\"list-dot\"></span><span>입장 조건: 연령 제한 및 업소 정책 확인 필요</span></div>\n"
        "    <div class=\"list-item\"><span class=\"list-dot\"></span><span>복장: 단정한 복장 권장</span></div>\n"
        "  </div>\n"
        "\n"
        "  <div class=\"section\">\n"
        "    <div class=\"section-label\">이용 전 확인</div>\n"
        "    <h2>방문 전 확인 사항</h2>\n"
        "    <p>운영 시간은 요일이나 행사에 따라 변동될 수 있으므로 방문 전 공식 안내를 확인하세요. 연령 제한과 입장 기준은 업소 정책에 따라 달라질 수 있습니다.</p>\n"
        "  </div>\n"
        "\n"
        "  <div class=\"section\">\n"
        "    <div class=\"section-label\">위치 안내</div>\n"
        "    <h2>위치와 교통</h2>\n"
        "    <p>대중교통 접근이 편리한 지역이며, 정확한 경로는 지도 서비스나 공식 안내를 참고하는 것이 좋습니다.</p>\n"
        "    <div class=\"list-item\"><span class=\"list-dot\"></span><span>대중교통: 인근 역에서 도보 접근 가능</span></div>\n"
        "    <div class=\"list-item\"><span class=\"list-dot\"></span><span>주차: 인근 유료 주차장 이용 가능</span></div>\n"
        "  </div>\n"
        "\n"
        "  <div class=\"section\">\n"
        "    <div class=\"section-label\">안전 및 매너</div>\n"
        "    <h2>안전과 이용 매너</h2>\n"
        "    <p>주변 상권과 이용객을 배려한 매너를 지켜 주세요. 이동 시 안전에 유의하고, 귀가 교통편을 사전에 확인하는 것을 권장합니다.</p>\n"
        "  </div>\n"
        "\n"
        "  <div class=\"section\">\n"
        "    <div class=\"section-label\">FAQ</div>\n"
        "    <h2>자주 묻는 질문</h2>\n"
        f"{FAQ_ITEMS.format(area=area)}"
        "  </div>\n"
    )

    if has_article:
        return f"<article class=\"wrap\">\n\n{content}\n</article>\n"
    return f"<div class=\"content\">\n\n{content}\n</div>\n"


def update_head(html, name, slug, area):
    title = f"{name} 안내 | 위치·이용 전 확인사항"
    desc = f"{name} 이용 전 확인할 위치, 운영, 출입 안내를 간단히 정리했습니다."

    def repl(pattern, replacement):
        nonlocal html
        html = re.sub(pattern, replacement, html, flags=re.IGNORECASE)

    repl(r"<title>.*?</title>", f"<title>{title}</title>")
    repl(r"<meta name=\"description\" content=\".*?\">", f"<meta name=\"description\" content=\"{desc}\">")
    repl(r"<meta name=\"date\" content=\".*?\">", f"<meta name=\"date\" content=\"{DATE}\">")
    repl(r"<meta name=\"last-modified\" content=\".*?\">", f"<meta name=\"last-modified\" content=\"{DATE}\">")

    repl(r"<meta property=\"article:published_time\" content=\".*?\">", f"<meta property=\"article:published_time\" content=\"{DATE_TIME}\">")
    repl(r"<meta property=\"article:modified_time\" content=\".*?\">", f"<meta property=\"article:modified_time\" content=\"{DATE_TIME}\">")

    repl(r"<meta property=\"og:title\" content=\".*?\">", f"<meta property=\"og:title\" content=\"{title}\">")
    repl(r"<meta property=\"og:description\" content=\".*?\">", f"<meta property=\"og:description\" content=\"{desc}\">")
    repl(r"<meta property=\"og:image:alt\" content=\".*?\">", f"<meta property=\"og:image:alt\" content=\"{name} 안내 이미지\">")

    repl(r"<meta name=\"twitter:title\" content=\".*?\">", f"<meta name=\"twitter:title\" content=\"{title}\">")
    repl(r"<meta name=\"twitter:description\" content=\".*?\">", f"<meta name=\"twitter:description\" content=\"{desc}\">")

    # Remove existing JSON-LD blocks
    html = re.sub(r"<script type=\"application/ld\+json\">.*?</script>", "", html, flags=re.DOTALL)

    url = f"{SITE_URL}/{slug}/"
    jsonld = f"""
<script type=\"application/ld+json\">
{{
  \"@context\": \"https://schema.org\",
  \"@type\": \"WebPage\",
  \"name\": \"{name} 안내\",
  \"description\": \"{desc}\",
  \"url\": \"{url}\",
  \"inLanguage\": \"ko\",
  \"isAccessibleForFree\": true
}}
</script>

<script type=\"application/ld+json\">
{{
  \"@context\": \"https://schema.org\",
  \"@type\": \"FAQPage\",
  \"mainEntity\": [
    {{
      \"@type\": \"Question\",
      \"name\": \"위치는 어디인가요?\",
      \"acceptedAnswer\": {{
        \"@type\": \"Answer\",
        \"text\": \"{area} 일대에 위치하며, 정확한 주소는 공식 안내를 확인해 주세요.\"
      }}
    }},
    {{
      \"@type\": \"Question\",
      \"name\": \"운영 시간은 어떻게 확인하나요?\",
      \"acceptedAnswer\": {{
        \"@type\": \"Answer\",
        \"text\": \"운영 시간은 변동될 수 있으므로 방문 전 공식 안내를 확인하는 것이 좋습니다.\"
      }}
    }},
    {{
      \"@type\": \"Question\",
      \"name\": \"입장 조건이 있나요?\",
      \"acceptedAnswer\": {{
        \"@type\": \"Answer\",
        \"text\": \"연령 제한과 입장 기준은 업소 정책에 따라 달라질 수 있습니다.\"
      }}
    }},
    {{
      \"@type\": \"Question\",
      \"name\": \"드레스코드가 있나요?\",
      \"acceptedAnswer\": {{
        \"@type\": \"Answer\",
        \"text\": \"복장 규정은 업소별로 상이하며, 단정한 복장을 권장합니다.\"
      }}
    }}
  ]
}}
</script>

<script type=\"application/ld+json\">
{{
  \"@context\": \"https://schema.org\",
  \"@type\": \"Article\",
  \"headline\": \"{title}\",
  \"description\": \"{desc}\",
  \"datePublished\": \"{DATE_TIME}\",
  \"dateModified\": \"{DATE_TIME}\",
  \"author\": {{
    \"@type\": \"Person\",
    \"name\": \"전국 지역 정보 가이드\"
  }},
  \"publisher\": {{
    \"@type\": \"Organization\",
    \"name\": \"informationa.pages.dev\",
    \"url\": \"{SITE_URL}/\"
  }},
  \"mainEntityOfPage\": {{
    \"@type\": \"WebPage\",
    \"@id\": \"{url}\"
  }},
  \"inLanguage\": \"ko\",
  \"isAccessibleForFree\": true,
  \"keywords\": ["{name}", "{name} 안내", "{area}"]
}}
</script>
"""

    html = re.sub(r"</head>", jsonld + "</head>", html, flags=re.IGNORECASE)
    return html


def cleanup_body(html, name, area, has_article):
    # Remove age-gate overlay if present
    html = re.sub(r"<div id=\"age-gate\"[\s\S]*?</div>\s*", "", html)
    html = re.sub(r"<!-- 성인 확인 오버레이 -->[\s\S]*?<div style=\"background:#1a1a1a", "<div style=\"background:#1a1a1a", html)

    # Replace main content
    if has_article:
        html = re.sub(r"<article class=\"wrap\">[\s\S]*?</article>", build_article(name, area, True), html)
    else:
        html = re.sub(r"<div class=\"content\">[\s\S]*?</div>", build_article(name, area, False), html)

    # Replace notice block if present
    html = re.sub(r"<div class=\"notice\">[\s\S]*?</div>", NOTICE_HTML, html)
    html = re.sub(r"<div class=\"disclaimer\">[\s\S]*?</div>", NOTICE_HTML, html)

    # Remove promo blocks (제휴문의/카톡/연락처)
    html = re.sub(r"<div[^>]*>[^<]*제휴문의[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"contact-info\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div[^>]*>[^<]*카톡 ID:[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"profile-card\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"card\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"checklist\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"timeline\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"check-item\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"faq-block\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"route-item\">[\s\S]*?</div>", "", html)
    html = re.sub(r"<div class=\"faq-a\">[^<]*(입장료|예약|요금|전화|바 좌석)[^<]*</div>", "", html)

    # Normalize taglines/subtitles
    html = re.sub(r"<p class=\"tagline\">[\s\S]*?</p>", "<p class=\"tagline\">이용 전 확인 사항을 간단히 정리했습니다.</p>", html)
    html = re.sub(r"<p class=\"sub\">[\s\S]*?</p>", "<p class=\"sub\">이용 전 확인 사항을 간단히 정리했습니다.</p>", html)
    html = re.sub(r"<div class=\"ci-number\">[^<]*</div>", "", html)

    # Normalize main H1 if it uses gold span pattern
    html = re.sub(
        r"<h1><span class=\"gold\">[^<]*</span><br>[^<]*</h1>",
        f"<h1><span class=\"gold\">{name}</span><br>이용 안내</h1>",
        html,
    )

    return html


def main():
    for path, meta in PAGES.items():
        p = Path(path)
        html = p.read_text(encoding="utf-8")
        slug = p.parent.name
        name = meta["name"]
        area = meta["area"]
        has_article = "<article class=\"wrap\">" in html

        html = update_head(html, name, slug, area)
        html = cleanup_body(html, name, area, has_article)

        p.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    main()
