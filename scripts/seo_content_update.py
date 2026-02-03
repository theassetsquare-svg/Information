#!/usr/bin/env python3
from pathlib import Path
import re

DATE = "2026-02-03"
DATE_TIME = "2026-02-03T00:00:00+09:00"
SITE = "https://informationa.pages.dev"

PAGES = {
    "f/index.html": {
        "slug": "f",
        "name": "파주야당스카이돔나이트",
        "title": "파주야당스카이돔나이트 안내 | 야당역 야간 산책·야경 정보",
        "desc": "파주야당스카이돔나이트 검색자를 위한 야당역 일대 야간 산책·야경 정보 안내. 위치, 접근, 관람 팁, 안전 정보를 정리했습니다.",
        "keywords": [
            "파주야당스카이돔나이트",
            "야당역 야경",
            "파주 야간 산책",
            "야당역 인근",
            "파주 포토 스팟",
            "야간 안전",
            "주변 동선"
        ],
        "body": """
<div class=\"section\">
  <div class=\"section-label\">서론</div>
  <h2>파주야당스카이돔나이트 검색 의도 이해</h2>
  <p><strong>파주야당스카이돔나이트</strong>는 파주 야당역 주변의 야간 분위기와 산책 동선을 찾는 분들이 사용하는 검색 키워드입니다. 이 페이지는 ‘야당역 야경’과 ‘파주 야간 산책’처럼 지역·시간·경험 요소를 함께 찾는 수요를 반영해, 야당역 인근에서 안전하게 야간 보행을 즐길 수 있는 기본 정보를 정리합니다. 공식 명칭과 운영 범위는 시기에 따라 달라질 수 있으므로 방문 전 현장 안내와 공지 채널을 확인하는 것이 안전합니다.</p>
  <p>야당역 일대는 상권과 보행로가 연결된 구조여서, 짧은 시간에 주변 동선을 파악하기 좋습니다. 특히 야간 조명 변화가 분위기를 크게 좌우하므로 방문 시간대에 따라 체감되는 야경의 인상이 달라집니다. 이 페이지는 ‘파주 포토 스팟’을 찾는 이용자를 위해 동선, 촬영, 안전을 함께 안내합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>야당역 인근 동선과 접근</h2>
  <h3>대중교통 중심 접근</h3>
  <p>야당역 인근은 지하철 접근성이 좋고 보행 동선이 단순한 편입니다. 야당역에서 나와 보행로를 따라 이동하면 주요 야간 동선이 자연스럽게 이어집니다. 이동 시간이 짧은 만큼, 체류 시간은 현장 분위기와 보행 혼잡도를 고려해 유동적으로 조정하는 것이 좋습니다.</p>
  <h3>야경 관람에 적합한 시간대</h3>
  <p>야당역 야경은 해가 완전히 진 이후가 가장 뚜렷하게 느껴집니다. 주말에는 방문자가 많아 체감 혼잡도가 높아질 수 있고, 평일은 비교적 여유로운 편입니다. 계절별로 일몰 시간이 달라지므로 방문 전 일몰 시간과 날씨를 확인하는 것을 권장합니다.</p>
  <h3>야간 산책 시 안전과 매너</h3>
  <p>야간 이동 시에는 밝은 보행로를 우선 이용하고, 차량 통행이 잦은 구간에서는 횡단보도 신호를 확인하세요. ‘야간 안전’ 관점에서 휴대폰 사용을 최소화하고, 보행 속도를 유지하면 돌발 상황에 대응하기 쉽습니다. 주변 상권과 주거 지역을 배려하는 조용한 보행 매너도 중요합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>파주 포토 스팟과 촬영 팁</h2>
  <p>야당역 인근의 야간 조명은 대비가 강한 편이라 사진 촬영 시 노출이 과해질 수 있습니다. 밝은 간판이나 강한 조명 앞에서는 노출을 낮추고, 피사체와 배경의 간격을 확보하면 피사체가 돋보입니다. 삼각대 사용은 보행자 통행을 방해하지 않는 구간에서만 짧게 활용하는 것이 좋습니다.</p>
  <p>‘파주 포토 스팟’을 찾는다면 밝은 조명 구간과 어두운 구간이 교차하는 지점을 활용하세요. 이때 보행 동선이 막히지 않도록 측면으로 이동해 촬영하는 것이 안전합니다. 사진 촬영 후 이동하는 동선을 미리 확보하면 흐름이 자연스럽습니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">결론</div>
  <h2>요약과 방문 전 체크</h2>
  <p>파주야당스카이돔나이트 검색자는 대체로 야당역 야경과 야간 산책 동선을 빠르게 파악하려는 경우가 많습니다. 핵심은 <strong>야당역 인근</strong>의 보행 접근성과, 시간대에 따라 달라지는 야경 분위기를 미리 고려하는 것입니다. 날씨, 일몰 시간, 보행 혼잡도는 현장 경험의 품질을 좌우하므로 방문 전 체크 리스트로 삼는 것을 권장합니다.</p>
  <p>이 페이지는 지역 중심의 정보 제공을 목적으로 작성되었으며, 운영 정보는 상황에 따라 변동될 수 있습니다. 최신 정보는 공식 안내를 확인해 주세요.</p>
</div>
"""
    },
    "b/index.html": {
        "slug": "b",
        "name": "상봉동한국관나이트",
        "title": "상봉동한국관나이트 안내 | 상봉역 인근 이용 정보",
        "desc": "상봉동한국관나이트 검색자를 위한 상봉역 인근 이용 정보 안내. 위치, 접근, 방문 전 확인사항을 정리했습니다.",
        "keywords": [
            "상봉동한국관나이트",
            "상봉역",
            "중랑구 상봉동",
            "상봉역 인근",
            "대중교통 접근",
            "주변 동선",
            "방문 전 확인"
        ],
        "body": """
<div class=\"section\">
  <div class=\"section-label\">서론</div>
  <h2>상봉동한국관나이트 검색 의도</h2>
  <p><strong>상봉동한국관나이트</strong>는 상봉역 인근 정보를 찾는 이용자들이 사용하는 대표 키워드입니다. 이 페이지는 중랑구 상봉동 지역의 접근성과 이동 동선을 중심으로 기본 정보를 제공합니다. 정확한 운영 정보는 시기에 따라 달라질 수 있으므로 방문 전 공식 안내를 확인하는 것이 안전합니다.</p>
  <p>상봉역 일대는 환승과 접근성이 좋은 지역으로 알려져 있어, 대중교통 중심의 이동 계획이 유리합니다. 상권과 보행로가 가까이 연결되어 있어 짧은 방문 동선을 구성하기에 적합합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>상봉역 인근 접근과 동선</h2>
  <h3>대중교통 중심 이동</h3>
  <p>상봉역 인근은 여러 노선이 교차하는 구간이 있어 접근 편의성이 높습니다. 역에서 출구를 나와 보행로를 따라 이동하면 주요 상권과 연결되며, 도보 이동 시간이 길지 않은 편입니다.</p>
  <h3>주변 동선 구성</h3>
  <p>중랑구 상봉동은 상권과 주거지가 혼재되어 있으므로, 이동 시 보행로와 횡단보도 신호를 우선 확인하세요. 방문 동선을 짧게 계획하면 혼잡 시간대에도 체류가 편안합니다.</p>
  <h3>방문 전 확인사항</h3>
  <p>운영 정보는 요일과 상황에 따라 달라질 수 있습니다. 방문 전 공식 안내를 확인하고, 교통 상황이나 혼잡도에 따라 이동 시간을 여유 있게 잡는 것을 권장합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>이용 매너와 안전</h2>
  <p>야간 이동 시에는 밝은 보행로를 이용하고, 차량 통행이 잦은 구간에서 신호를 확인하세요. 주변 상권과 거주 지역을 배려하는 조용한 보행 매너가 중요합니다.</p>
  <p>혼잡 시간대에는 보행 흐름이 느려질 수 있으므로, 일정이 촘촘한 경우에는 대중교통 시간을 조정하는 것도 좋은 방법입니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">결론</div>
  <h2>요약</h2>
  <p>상봉동한국관나이트를 찾는 이용자는 대체로 상봉역 인근 접근성과 이동 동선을 확인하려는 경우가 많습니다. 상봉역의 환승 편의성과 주변 동선의 단순함을 활용하면 이동이 수월합니다. 방문 전 공식 안내를 확인하고, 안전한 보행과 주변 배려를 기본으로 계획을 세우는 것이 좋습니다.</p>
</div>
"""
    },
    "l/index.html": {
        "slug": "l",
        "name": "신림그랑프리나이트",
        "title": "신림그랑프리나이트 안내 | 신림역 인근 이용 정보",
        "desc": "신림그랑프리나이트 검색자를 위한 신림역 인근 이용 정보 안내. 위치, 접근, 방문 전 확인사항을 정리했습니다.",
        "keywords": [
            "신림그랑프리나이트",
            "신림역",
            "관악구 신림",
            "신림역 인근",
            "대중교통 접근",
            "주변 동선",
            "방문 전 확인"
        ],
        "body": """
<div class=\"section\">
  <div class=\"section-label\">서론</div>
  <h2>신림그랑프리나이트 검색 의도</h2>
  <p><strong>신림그랑프리나이트</strong>는 신림역 인근 정보를 찾는 이용자들이 사용하는 대표 키워드입니다. 이 페이지는 관악구 신림 지역의 접근성과 이동 동선을 중심으로 기본 정보를 제공합니다. 운영 정보는 변동될 수 있으므로 방문 전 공식 안내를 확인하는 것이 안전합니다.</p>
  <p>신림역은 유동 인구가 많은 지역으로, 시간대에 따라 혼잡도가 크게 달라질 수 있습니다. 이동 시간과 동선을 여유 있게 설정하면 보다 안정적인 방문이 가능합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>신림역 인근 접근</h2>
  <h3>대중교통 접근</h3>
  <p>신림역은 지하철 접근성이 뛰어나고 주변 상권과 보행로가 연결되어 있습니다. 역 출구를 기준으로 보행 동선을 계획하면 이동 시간이 크게 늘지 않습니다.</p>
  <h3>보행 동선</h3>
  <p>관악구 신림 지역은 보행 구간이 이어져 있어 짧은 이동 동선 구성에 적합합니다. 혼잡한 시간대에는 인파를 고려해 이동 속도를 조절하는 것이 좋습니다.</p>
  <h3>방문 전 확인사항</h3>
  <p>운영 정보는 요일과 상황에 따라 달라질 수 있습니다. 방문 전 공식 안내를 확인하고, 야간 이동 시에는 밝은 보행로를 우선 이용하세요.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>안전과 매너</h2>
  <p>야간 이동 시에는 횡단보도 신호를 확인하고 차량 통행이 잦은 구간을 주의하세요. 주변 상권과 거주 지역을 배려하는 보행 매너가 중요합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">결론</div>
  <h2>요약</h2>
  <p>신림그랑프리나이트를 찾는 이용자는 신림역 인근 접근성과 이동 동선을 확인하려는 경우가 많습니다. 대중교통 접근이 편리한 만큼, 혼잡 시간대와 보행 안전을 고려해 방문 계획을 세우는 것이 좋습니다.</p>
</div>
"""
    },
    "i/index.html": {
        "slug": "i",
        "name": "인천아라비안나이트",
        "title": "인천아라비안나이트 안내 | 인천 지역 이용 정보",
        "desc": "인천아라비안나이트 검색자를 위한 인천 지역 이용 정보 안내. 위치, 접근, 방문 전 확인사항을 정리했습니다.",
        "keywords": [
            "인천아라비안나이트",
            "인천 지역",
            "인천 접근",
            "인천 대중교통",
            "주변 동선",
            "방문 전 확인",
            "지역 안내"
        ],
        "body": """
<div class=\"section\">
  <div class=\"section-label\">서론</div>
  <h2>인천아라비안나이트 검색 의도</h2>
  <p><strong>인천아라비안나이트</strong>는 인천 지역의 접근성과 방문 동선을 찾는 이용자들이 사용하는 대표 키워드입니다. 이 페이지는 인천 지역의 이동 경로, 접근 방식, 방문 전 확인해야 할 기본 정보를 제공합니다.</p>
  <p>인천은 지역 범위가 넓어 출발 지점에 따라 이동 시간이 크게 달라질 수 있습니다. 따라서 방문 전에는 출발 지점과 교통 수단을 기준으로 이동 경로를 점검하는 것이 좋습니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>인천 지역 접근과 이동</h2>
  <h3>대중교통 이용</h3>
  <p>인천 지역은 지하철과 버스 노선이 다양하게 연결되어 있습니다. 주요 거점역을 기준으로 이동하면 동선이 단순해지고 이동 시간이 예측 가능해집니다.</p>
  <h3>보행 동선과 주변 환경</h3>
  <p>인천 도심 지역은 보행 동선이 비교적 잘 정비되어 있으나, 시간대에 따라 혼잡도가 달라질 수 있습니다. 이동 시에는 보행로와 횡단보도를 우선 이용하세요.</p>
  <h3>방문 전 확인사항</h3>
  <p>운영 정보는 시기에 따라 변동될 수 있으므로 공식 안내를 확인하는 것이 안전합니다. 이동 경로와 예상 도착 시간을 충분히 고려해 방문 계획을 세우세요.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>안전과 매너</h2>
  <p>야간 이동 시에는 밝은 보행로를 이용하고, 차량 통행이 많은 구간에서는 주의를 기울이세요. 주변 상권과 거주지를 배려하는 보행 매너가 중요합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">결론</div>
  <h2>요약</h2>
  <p>인천아라비안나이트를 찾는 이용자는 인천 지역의 접근성과 이동 동선을 확인하려는 경우가 많습니다. 출발 지점에 따라 이동 시간이 크게 달라질 수 있으므로 대중교통 경로를 먼저 확인하는 것이 좋습니다.</p>
</div>
"""
    },
    "j/index.html": {
        "slug": "j",
        "name": "수원찬스돔나이트",
        "title": "수원찬스돔나이트 안내 | 수원역 인근 이용 정보",
        "desc": "수원찬스돔나이트 검색자를 위한 수원역 인근 이용 정보 안내. 위치, 접근, 방문 전 확인사항을 정리했습니다.",
        "keywords": [
            "수원찬스돔나이트",
            "수원역",
            "수원역 인근",
            "경기도 수원",
            "대중교통 접근",
            "주변 동선",
            "방문 전 확인"
        ],
        "body": """
<div class=\"section\">
  <div class=\"section-label\">서론</div>
  <h2>수원찬스돔나이트 검색 의도</h2>
  <p><strong>수원찬스돔나이트</strong>는 수원역 인근 방문 정보를 찾는 이용자들이 사용하는 대표 키워드입니다. 이 페이지는 수원역 주변의 접근성과 이동 동선을 중심으로 기본 정보를 제공합니다.</p>
  <p>수원역은 유동 인구가 많고 환승이 용이해 접근성이 좋은 지역입니다. 다만 시간대에 따라 혼잡도가 달라질 수 있으므로 이동 시간을 여유 있게 계획하는 것이 좋습니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>수원역 인근 접근</h2>
  <h3>대중교통 이용</h3>
  <p>수원역은 지하철과 버스 노선이 집중된 거점역으로, 접근성이 높습니다. 주요 출구를 기준으로 보행 동선을 설정하면 이동이 수월합니다.</p>
  <h3>보행 동선</h3>
  <p>역 주변 상권은 보행 동선이 단순한 편이지만, 야간에는 혼잡 구간이 발생할 수 있습니다. 보행로와 횡단보도 신호를 확인하며 이동하세요.</p>
  <h3>방문 전 확인사항</h3>
  <p>운영 정보는 시기에 따라 변동될 수 있으므로 방문 전 공식 안내를 확인하는 것이 안전합니다. 이동 경로와 도착 시간을 충분히 고려해 계획을 세우세요.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>안전과 매너</h2>
  <p>야간 이동 시에는 밝은 보행로를 우선 이용하고, 차량 통행이 많은 구간에서는 주의를 기울이세요. 주변 상권과 거주 지역을 배려하는 보행 매너가 중요합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">결론</div>
  <h2>요약</h2>
  <p>수원찬스돔나이트를 찾는 이용자는 수원역 인근 접근성과 이동 동선을 확인하려는 경우가 많습니다. 대중교통 접근이 좋은 지역이므로 혼잡 시간대를 고려해 방문 계획을 세우는 것이 좋습니다.</p>
</div>
"""
    },
    "k/index.html": {
        "slug": "k",
        "name": "수유샴푸나이트",
        "title": "수유샴푸나이트 안내 | 수유역 인근 이용 정보",
        "desc": "수유샴푸나이트 검색자를 위한 수유역 인근 이용 정보 안내. 위치, 접근, 방문 전 확인사항을 정리했습니다.",
        "keywords": [
            "수유샴푸나이트",
            "수유역",
            "강북구 수유동",
            "수유역 인근",
            "대중교통 접근",
            "주변 동선",
            "방문 전 확인"
        ],
        "body": """
<div class=\"section\">
  <div class=\"section-label\">서론</div>
  <h2>수유샴푸나이트 검색 의도</h2>
  <p><strong>수유샴푸나이트</strong>는 수유역 인근 정보를 찾는 이용자들이 사용하는 대표 키워드입니다. 이 페이지는 강북구 수유동 지역의 접근성과 이동 동선을 중심으로 기본 정보를 제공합니다.</p>
  <p>수유역 일대는 보행 이동이 편리한 구조로 되어 있어, 짧은 동선을 구성하기에 적합합니다. 방문 전에는 이동 경로와 혼잡도를 고려해 계획을 세우는 것이 좋습니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>수유역 인근 접근</h2>
  <h3>대중교통 이용</h3>
  <p>수유역은 대중교통 접근성이 좋은 지역입니다. 역 출구를 기준으로 보행 동선을 계획하면 이동 시간이 크게 늘지 않습니다.</p>
  <h3>보행 동선</h3>
  <p>수유동 일대는 상권과 보행로가 인접해 있어 이동이 비교적 단순합니다. 야간 이동 시에는 보행로와 횡단보도 신호를 우선 확인하세요.</p>
  <h3>방문 전 확인사항</h3>
  <p>운영 정보는 변동될 수 있으므로 공식 안내를 확인하는 것이 안전합니다. 이동 시간과 혼잡도를 고려해 일정에 여유를 두는 것이 좋습니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">본론</div>
  <h2>안전과 매너</h2>
  <p>야간 이동 시에는 밝은 보행로를 이용하고, 차량 통행이 많은 구간에서는 주의를 기울이세요. 주변 상권과 거주 지역을 배려하는 보행 매너가 중요합니다.</p>
</div>

<div class=\"section\">
  <div class=\"section-label\">결론</div>
  <h2>요약</h2>
  <p>수유샴푸나이트를 찾는 이용자는 수유역 인근 접근성과 이동 동선을 확인하려는 경우가 많습니다. 대중교통 접근이 좋은 만큼, 혼잡 시간대를 고려해 방문 계획을 세우는 것이 좋습니다.</p>
</div>
"""
    },
}


def update_head(html, page):
    html = re.sub(r"<title>.*?</title>", f"<title>{page['title']}</title>", html, flags=re.IGNORECASE)
    html = re.sub(r"<meta name=\"description\" content=\".*?\">", f"<meta name=\"description\" content=\"{page['desc']}\">", html, flags=re.IGNORECASE)
    html = re.sub(r"<meta name=\"date\" content=\".*?\">", f"<meta name=\"date\" content=\"{DATE}\">", html, flags=re.IGNORECASE)
    html = re.sub(r"<meta name=\"last-modified\" content=\".*?\">", f"<meta name=\"last-modified\" content=\"{DATE}\">", html, flags=re.IGNORECASE)

    html = re.sub(r"<meta property=\"article:published_time\" content=\".*?\">", f"<meta property=\"article:published_time\" content=\"{DATE_TIME}\">", html, flags=re.IGNORECASE)
    html = re.sub(r"<meta property=\"article:modified_time\" content=\".*?\">", f"<meta property=\"article:modified_time\" content=\"{DATE_TIME}\">", html, flags=re.IGNORECASE)

    html = re.sub(r"<meta property=\"og:title\" content=\".*?\">", f"<meta property=\"og:title\" content=\"{page['title']}\">", html, flags=re.IGNORECASE)
    html = re.sub(r"<meta property=\"og:description\" content=\".*?\">", f"<meta property=\"og:description\" content=\"{page['desc']}\">", html, flags=re.IGNORECASE)

    html = re.sub(r"<meta name=\"twitter:title\" content=\".*?\">", f"<meta name=\"twitter:title\" content=\"{page['title']}\">", html, flags=re.IGNORECASE)
    html = re.sub(r"<meta name=\"twitter:description\" content=\".*?\">", f"<meta name=\"twitter:description\" content=\"{page['desc']}\">", html, flags=re.IGNORECASE)

    # Remove existing JSON-LD
    html = re.sub(r"<script type=\"application/ld\+json\">.*?</script>", "", html, flags=re.DOTALL)

    url = f"{SITE}/{page['slug']}/"
    keywords = page["keywords"]
    jsonld = f"""
<script type=\"application/ld+json\">
{{
  \"@context\": \"https://schema.org\",
  \"@type\": \"WebPage\",
  \"name\": \"{page['name']} 안내\",
  \"description\": \"{page['desc']}\",
  \"url\": \"{url}\",
  \"inLanguage\": \"ko\",
  \"isAccessibleForFree\": true
}}
</script>

<script type=\"application/ld+json\">
{{
  \"@context\": \"https://schema.org\",
  \"@type\": \"Article\",
  \"headline\": \"{page['title']}\",
  \"description\": \"{page['desc']}\",
  \"datePublished\": \"{DATE_TIME}\",
  \"dateModified\": \"{DATE_TIME}\",
  \"author\": {{
    \"@type\": \"Person\",
    \"name\": \"전국 지역 정보 가이드\"
  }},
  \"publisher\": {{
    \"@type\": \"Organization\",
    \"name\": \"informationa.pages.dev\",
    \"url\": \"{SITE}/\"
  }},
  \"mainEntityOfPage\": {{
    \"@type\": \"WebPage\",
    \"@id\": \"{url}\"
  }},
  \"inLanguage\": \"ko\",
  \"isAccessibleForFree\": true,
  \"keywords\": {keywords}
}}
</script>
"""

    html = re.sub(r"</head>", jsonld + "</head>", html, flags=re.IGNORECASE)
    return html


def replace_body(html, page):
    # Remove broken overlay chunk if present
    html = re.sub(r"<!-- 성인 확인 오버레이 -->[\s\S]*?<div style=\"background:#", "<div style=\"background:#", html)

    body = page["body"].strip()

    if "<article class=\"wrap\">" in html:
        html = re.sub(r"<article class=\"wrap\">[\s\S]*?</article>", f"<article class=\"wrap\">\n{body}\n</article>", html)
    elif "<div class=\"content\">" in html:
        html = re.sub(r"<div class=\"content\">[\s\S]*?</div>", f"<div class=\"content\">\n{body}\n</div>", html)

    return html


def main():
    for path, page in PAGES.items():
        p = Path(path)
        html = p.read_text(encoding="utf-8")
        html = update_head(html, page)
        html = replace_body(html, page)
        p.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    main()
