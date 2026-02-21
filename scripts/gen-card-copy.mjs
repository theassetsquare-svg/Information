#!/usr/bin/env node
/**
 * gen-card-copy.mjs
 * Generates unique card_hook / card_value / card_tags for every venue.
 * Each hook is emotional + venue-specific. Each value is a concise practical one-liner.
 * Validates: banned words, per-field repetition, cross-card template uniqueness.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VENUES_PATH = resolve(__dirname, '../src/data/venues.json');
const BANNED = ['해당', '이곳', '공간', '매장', '감도', '기준'];

/* ────────────────────────────────────────────
   COPY MAP — hand-crafted per venue
   key = venue name (exact match)
   ──────────────────────────────────────────── */
const COPY = {
  /* ═══ CLUBS — Seoul Gangnam/Seocho ═══ */
  'Club RACE': {
    hook: '호텔 로비를 지나 엘리베이터를 타는 순간, 일상이 끊긴다. 문이 열리면 베이스가 전신을 감싸고 강남 한복판의 밤이 시작된다.',
    value: '금·토 23시 오픈. 강남역 도보 5분. 신분증 필수.',
    tags: ['EDM', '강남역', '호텔B1'],
  },
  'Octagon': {
    hook: 'B1과 B2를 가로지르는 360도 LED가 시야를 삼킨다. 아시아 TOP 5에 이름을 올린 규모는 직접 서 봐야 실감한다.',
    value: '금요 자정 전 도착 필수. 신논현역 도보 3분.',
    tags: ['메가클럽', 'LED연출', '사전예약'],
  },
  'Club ARTE': {
    hook: '벽과 천장을 뒤덮는 미디어아트 조명이 음악에 맞춰 숨 쉰다. 강남역 출구에서 3분, 접근성까지 완벽한 새벽형 클럽.',
    value: '수~토 23시 오픈, 새벽 8시 마감. 2호선 강남역 도보 3분.',
    tags: ['미디어아트', '강남역', '새벽영업'],
  },
  'Club MUIN': {
    hook: '한국적 미학과 모던 비트가 교차하는 프리미엄 DJ바. 예약 확정 전까지 주소조차 공개되지 않는 문턱이 분위기를 만든다.',
    value: '위치 비공개 — 예약 확정 후 주소 안내. 드레스코드 엄격.',
    tags: ['프리미엄', 'DJ바', '드레스코드'],
  },
  'Club Sound': {
    hook: 'RACE가 쉬는 월·화·수에 도산 골목이 깨어난다. 하우스와 테크노 중심, 주말 인파 없이 사운드에 집중하는 평일 밤.',
    value: '월·화·수·토 23시 오픈. 신사역 도보 7분.',
    tags: ['하우스', '테크노', '평일영업'],
  },
  'Club Face': {
    hook: '금요일과 토요일, 딱 이틀만 문을 연다. 선택과 집중 전략 덕에 주말 밀도와 에너지가 압축된다.',
    value: '금·토만 운영. 강남역 도보 5분. 드레스코드 있음.',
    tags: ['EDM', '강남역', '주말전용'],
  },
  'Jack Livin': {
    hook: '지하철 출구와 바로 연결되는 올나이트 클럽. 밤 11시에 들어가 아침 10시에 나오는 마라톤 나이트가 가능하다.',
    value: '23시~10시. 신사역 3번 출구 직결.',
    tags: ['신사역', '올나이트', '역직결'],
  },
  '강남어게인': {
    hook: '삼성동 좁은 골목, 간판 없이도 주말이면 줄이 늘어선다. 좁은 입구 뒤 넓은 플로어의 반전이 첫 방문자를 놀라게 한다.',
    value: '금·토 22시 오픈. 삼성역 도보 8분.',
    tags: ['삼성동', 'EDM', '히든스팟'],
  },

  /* ═══ CLUBS — Seoul Mapo (Hongdae) ═══ */
  'B1': {
    hook: '계단을 내려서는 순간 홍대 씬의 날것이 시작된다. 주변 클럽이 문을 닫은 뒤에도 이 지하는 북적인다.',
    value: '금·토 22시~새벽 6시. 입장료 1~2만 원대.',
    tags: ['올장르', '홍대', '심야'],
  },
  'Club LASER': {
    hook: '암전된 플로어를 한 줄기 레이저가 가르면 환호가 터진다. 테크노와 힙합을 오가는 하이브리드 셋리스트가 지루할 틈을 준다.',
    value: '입장료 1만 원대. 홍대입구역 9번 출구 도보 5분.',
    tags: ['하이브리드', '가성비', '홍대'],
  },
  'Club AURA': {
    hook: '높은 천장 덕분에 사람이 차도 답답함이 없다. 음향 설계에 진심인 소규모 플로어에서 DJ와 눈이 마주치는 거리.',
    value: '주말 입장 제한 빈번. 목~토 운영, 평일 추천.',
    tags: ['소규모', '음향특화', '평일추천'],
  },
  'SABOTAGE': {
    hook: '홍대 힙합의 대명사. 강렬한 비트 위에서 모르는 사람과 어깨가 부딪히는 순간, 리듬이 인사를 대신한다.',
    value: '금·토 집중. 운동화 OK, 슬리퍼 불가.',
    tags: ['힙합', '홍대', '운동화OK'],
  },
  'Club Bermuda': {
    hook: 'B1과 B2를 오가며 장르를 고르는 재미가 있다. 층마다 분위기가 다르고, 새벽 8시까지 운영해 시간 압박이 사라진다.',
    value: '목~일 22시~08시. 2개 층 장르 선택 가능.',
    tags: ['2층구조', '올장르', '심야영업'],
  },
  'Club Purple': {
    hook: '365일 문을 닫지 않는다. 월요일 밤에도 플로어가 움직인다는 건, 팬층 두께가 남다르다는 증거.',
    value: '연중무휴. 평일 22시, 주말 21시 오픈.',
    tags: ['연중무휴', '평일영업', '홍대'],
  },
  'Club Ocean': {
    hook: '지하 2층까지 내려가면 바다 테마 조명이 플로어를 감싼다. 화요일 하루만 쉬고 매일 운영하는 안정감.',
    value: '매일 22시~06시 30분(화 휴무). 홍대입구역 4분.',
    tags: ['매일영업', 'B2', '홍대'],
  },
  'Club FF': {
    hook: '라이브 밴드가 무대를 달구다 DJ에게 바통을 넘기는 하이브리드 구성. 공연의 열기가 댄스 타임으로 자연스럽게 이어진다.',
    value: '금·토 22시 오픈. 라이브+DJ 혼합 프로그램.',
    tags: ['라이브', '댄스', '홍대'],
  },

  /* ═══ CLUBS — Seoul Yongsan (Itaewon) ═══ */
  'Faust': {
    hook: '이태원 뒷골목 3층, 한국 최초 음향 전용 설계를 반영한 테크노 전당. 서울에서 베를린의 밤을 경험하는 가장 빠른 방법.',
    value: '금·토 23시 오픈. 이태원역 3번 출구 도보 7분.',
    tags: ['테크노', '언더그라운드', '이태원'],
  },
  'Cakeshop': {
    hook: '간판 없는 계단 아래, 서울에서 가장 실험적인 사운드가 숨어 있다. 외국인 비율이 높아 언어 대신 음악으로 통하는 밤.',
    value: '목~토 22시 오픈. 이태원역 도보 3분.',
    tags: ['실험음악', '다국적', '이태원'],
  },
  'Volnost': {
    hook: '작고 어두운 플로어에서 시작된 밤이 새벽 6시를 넘기는 일이 잦다. 이태원 언더그라운드 테크노의 핵심 거점.',
    value: '금·토 23시~06시. 테크노·미니멀 전문.',
    tags: ['테크노', '미니멀', '이태원'],
  },
  'Club 82': {
    hook: '다른 클럽이 불을 끄는 새벽 4시, 여기서 진짜 밤이 열린다. 아침 9시까지 이어지는 애프터 문화의 정점.',
    value: '새벽 04시~09시. 청담역 도보 5분.',
    tags: ['애프터', '새벽전용', '청담'],
  },

  /* ═══ CLUBS — Busan ═══ */
  'Club AZIT': {
    hook: '서면 한복판 3층, 지하가 아닌 높은 곳에서 내려다보며 추는 춤이 색다르다. 부산 클러버들의 비밀 아지트.',
    value: '서면역 도보 5분. 금·토 22시 오픈.',
    tags: ['서면', 'EDM', '부산'],
  },
  'GRID': {
    hook: '매주 다른 게스트 DJ가 턴테이블을 잡아 같은 밤이 두 번 없다. 부산 서면 힙합 씬의 중심축.',
    value: '서면역 도보 7분. 힙합·R&B 중심.',
    tags: ['서면', '힙합', 'R&B'],
  },
  'Groove': {
    hook: '밤 9시부터 아침 7시까지, 부산에서 가장 긴 밤을 보낼 수 있다. 10시간 논스톱 비트 위에서 체력의 한계를 시험한다.',
    value: '21시~07시 올나이트. 서면역 도보 5분.',
    tags: ['올나이트', '서면', '10시간'],
  },
  'Billie Jean': {
    hook: '해운대 바닷바람을 안고 들어서면 팝과 댄스가 교차하는 무대가 펼쳐진다. 관광객과 로컬이 반반, 독특한 에너지.',
    value: '20시~05시. 센텀시티역 도보 10분.',
    tags: ['해운대', '센텀', '팝'],
  },
  'MELT BUSAN': {
    hook: '해외 게스트 DJ 라인업이 부산 일렉트로닉 씬에서 독보적이다. 해운대의 밤을 녹여내는 프리미엄 무대.',
    value: '21시~04시 30분. 사전 예약 권장.',
    tags: ['해운대', '일렉트로닉', '프리미엄'],
  },

  /* ═══ CLUBS — Regional ═══ */
  'BaBamBa': {
    hook: '대구 유일의 연중무휴 클럽. 화요일에도 비트가 살아 있어 요일을 따지지 않고 문을 두드릴 수 있다.',
    value: '연중무휴 21시~05시. 죽전역 도보 10분.',
    tags: ['대구', '연중무휴', 'EDM'],
  },
  'All Air': {
    hook: '둔산동 6층, 도시 야경을 등지고 춤추는 독특한 구조. 충청권 클럽 씬의 새 흐름을 만들고 있다.',
    value: '목~일 22시 오픈. 둔산동 소재.',
    tags: ['대전', '둔산동', '야경'],
  },
  'Club Curtain': {
    hook: '제주 연동 10층, 창 너머로 한라산 야경이 내려다보인다. 여행 마지막 밤을 불태우기에 딱 맞는 높이.',
    value: '금·토 22시~05시. 제주시 연동.',
    tags: ['제주', '10층', '야경'],
  },
  'Monkey Beach': {
    hook: '중문 해변에서 걸어갈 수 있는 트로피컬 클럽. 파도 소리와 DJ 세트가 겹치는 건 제주에서만 가능하다.',
    value: '21시~03시. 중문관광단지 인근. 예약 권장.',
    tags: ['중문', '비치', '트로피컬'],
  },

  /* ═══ NIGHTS ═══ */
  '수유샴푸나이트': {
    hook: '4호선 수유역 3번 출구에서 4분, 강북 대표 나이트. 접근성과 가격 모두 부담이 없다.',
    value: '19시~05시. 수유역 3번 출구 도보 4분.',
    tags: ['강북', '가성비', '수유역'],
  },
  '상봉동한국관나이트': {
    hook: '주말이면 초대 가수 무대가 열리고 90년대 히트곡이 플로어를 달군다. 테이블·부스·룸 세 가지 선택지.',
    value: '상봉역 도보 5분. 19시~05시. 현금 소액 준비 권장.',
    tags: ['라이브', '90년대', '상봉역'],
  },
  '인천아라비안나이트': {
    hook: '인천 최대 규모, 3개 층으로 나뉜 플로어에서 취향에 따라 분위기를 고른다. 발렛 주차와 VIP룸 완비.',
    value: '계양역 도보 5분. 발렛 주차 가능. 연중무휴.',
    tags: ['인천최대', 'VIP룸', '발렛주차'],
  },
  '파주야당스카이돔나이트': {
    hook: '높은 돔 천장 아래 음향이 넓게 퍼진다. 일반 건물에서 느낄 수 없는 개방감이 발걸음을 가볍게 만든다.',
    value: '야당역 택시 7분. 자가용 추천, 건물 주차장 있음.',
    tags: ['돔형', '파주', '주차가능'],
  },
  '수원찬스돔나이트': {
    hook: '수원 최대 규모. 시간대별로 분위기가 완전히 전환되는 구조라 몇 시에 도착하느냐가 경험을 바꾼다.',
    value: '수원역 택시 10분. 워크인 가능, 주말 예약 유리.',
    tags: ['수원', '대규모', '워크인'],
  },
  '신림그랑프리나이트': {
    hook: '역에서 3분, 부담 없는 분위기로 첫 방문자도 자연스럽게 녹아든다. 신림의 밤은 여기서 시작된다.',
    value: '2호선 신림역 1번 출구 직진 3분. 평일 저녁 추천.',
    tags: ['신림역', '편안함', '첫방문'],
  },
  '대전세븐나이트': {
    hook: 'KTX 타고 원정 오는 방문객이 주말마다 몰린다. 충청권 대형 나이트의 열기는 직접 와야 체감된다.',
    value: '대전역 택시 10분. 숙소를 근처에 잡으면 편리.',
    tags: ['대전', '충청권', 'KTX원정'],
  },
  '인덕원국빈관나이트': {
    hook: '경기 남부 야간 문화의 거점. 볼륨보다 대화가 우선인 라운지형 분위기가 나이트 초보에게도 편안하다.',
    value: '인덕원역 도보 8분. 카톡 besta12로 예약 문의.',
    tags: ['인덕원', '라운지형', '카톡예약'],
  },
  '울산챔피언나이트': {
    hook: '영남권 전역에서 단체 방문이 몰리는 울산 대표 나이트. 주말 에너지가 KTX 거리를 무색하게 만든다.',
    value: '울산역 택시 20분. 주말 단체 시 사전 예약 필수.',
    tags: ['울산', '영남권', '단체방문'],
  },
  '일산샴푸나이트': {
    hook: '넓은 플로어와 다양한 좌석 배치로 경기 북부 야간 문화의 중심축 역할을 한다. 규모가 주는 안정감.',
    value: '백석역 도보 10분. 건물 주차장 이용 가능.',
    tags: ['일산', '최대규모', '백석역'],
  },
  '청담h2o나이트': {
    hook: '청담 특유의 세련된 무드와 엄격한 드레스코드. 입장 문턱이 높은 만큼 내부 퀄리티가 보장된다.',
    value: '청담역 도보 7분. 드레스코드: 스마트캐주얼 이상.',
    tags: ['청담', '드레스코드', '프리미엄'],
  },
  '부산아시아드나이트': {
    hook: '24시간 멈추지 않는 부산 동래의 전설. 새벽에 들어가 오후에 나와도 비트가 계속된다.',
    value: '24시간 운영. 온천장역 도보 5분.',
    tags: ['24시간', '부산', '온천장'],
  },
  '대구한국관나이트': {
    hook: '라이브 무대와 트로트 타임이 번갈아 이어진다. 연령대를 가리지 않는 에너지가 대구 수성구의 밤을 채운다.',
    value: '수성구 소재. 20시~05시. 전화 예약 권장.',
    tags: ['대구', '수성구', '라이브'],
  },
  '대구 룰루랄라': {
    hook: '이름처럼 흥겨운 가요·트로트 중심 무대. 평일 밤에도 플로어에 빈자리가 없는 건 대구 로컬의 단골력 덕분.',
    value: '월~목 03시, 금·토 05시 마감. 평일도 활발.',
    tags: ['대구', '가요', '트로트'],
  },
  '광주 프린스나이트': {
    hook: '호남권 대표 나이트. 라이브와 댄스가 교차하며 광주 특유의 흥을 플로어 위에서 느낄 수 있다.',
    value: '20시~05시. 운암동 소재. 전화 문의 후 방문 권장.',
    tags: ['광주', '호남권', '라이브'],
  },
  '광주 첨단물나이트': {
    hook: '첨단지구에 들어선 비교적 새로운 나이트. 깔끔한 인테리어와 음향 세팅이 기존 무대와 다른 결을 보여준다.',
    value: '첨단지구 소재. 20시~05시.',
    tags: ['광주', '첨단지구', '신규'],
  },
  '대전 으뜸원나이트': {
    hook: '세븐나이트와 양대 산맥으로 대전 나이트 씬의 폭을 넓힌다. 동구 용전동의 로컬 색이 진하다.',
    value: '20시~05시. 용전동 소재. 전화 확인 후 방문 추천.',
    tags: ['대전', '동구', '로컬'],
  },
  '수유샴푸나이트 파이프라인': {
    hook: '검색에서 귀갓길까지 끊기지 않는 동선 가이드. 수유 나이트의 확장판으로 핵심 루트를 짚어 준다.',
    value: '수유역 도보 5분. 본관과 가까운 거리.',
    tags: ['수유', '동선가이드', '강북'],
  },
  '수유샴푸나이트 체크리스트': {
    hook: '첫 방문이라면 일곱 가지 체크포인트부터 확인하라. 출발 준비부터 귀가까지 빈틈없는 안내.',
    value: '수유역 3번 출구 도보 4분. 체크리스트 확인 후 출발.',
    tags: ['체크리스트', '초보', '수유역'],
  },

  /* ═══ LOUNGES ═══ */
  'CODE Lounge': {
    hook: '프라이빗 테이블 중심, 음악 볼륨은 대화가 가능한 수준으로 유지된다. 비즈니스 애프터와 소규모 모임에 적합하다.',
    value: '사전 예약 필수. 압구정로데오역 5번 출구 3분.',
    tags: ['프라이빗', '예약필수', '압구정'],
  },
  'HYPE Seoul': {
    hook: '힙합과 R&B를 베이스로, 압구정 패션 피플이 모이는 프리미엄 라운지. 주말 밤 드레스코드가 분위기를 한 단계 올린다.',
    value: '주말 드레스코드: 스마트캐주얼 이상. 슬리퍼 불가.',
    tags: ['힙합', 'R&B', '드레스코드'],
  },
  'Intro Lounge': {
    hook: '입구를 지나면 조용한 대화와 칵테일이 흐른다. 시끄럽지 않은 2차, 소규모 모임에 정확히 맞는 동선.',
    value: '19시~02시. 예약 추천. 압구정로데오역 5분.',
    tags: ['칵테일', '소모임', '압구정'],
  },
  'DM Lounge': {
    hook: '압구정 뒷길, 간판 없이 운영되는 멤버십형 라운지. 초대받아야 들어간다는 소문 자체가 브랜드다.',
    value: '20시~03시. 사전 연락 필수. 압구정로데오역 5분.',
    tags: ['멤버십', '셀럽', '초대제'],
  },
  'Color Lounge': {
    hook: '조명 톤이 시간대별로 바뀐다. 이른 저녁은 따뜻한 앰버, 심야에는 차가운 블루 — 같은 자리에서 두 가지 분위기.',
    value: '20시~03시. 압구정로데오역 7분.',
    tags: ['무드조명', '인테리어', '2차추천'],
  },
  '르클럽': {
    hook: '청담동 1층, 골목에 면한 유리창 너머 고급 인테리어가 첫인상을 결정한다. 와인 리스트와 조용한 대화가 중심.',
    value: '19시~03시. 청담역 도보 5분. 사전 예약 권장.',
    tags: ['청담', '와인', '프리미엄'],
  },
  '더 시에나': {
    hook: 'B1부터 4층까지 층마다 컨셉이 다른 복합 라운지. 다이닝으로 시작해 루프탑 바에서 마무리하는 원스톱 코스.',
    value: '18시~02시. B1~4층 구성. 청담역 7분.',
    tags: ['청담', '다층', '다이닝'],
  },
  '엘빈에비뉴': {
    hook: '강남역 뒷골목 B1, 칵테일 바와 DJ 부스가 공존한다. 초반은 조용하게, 자정 넘으면 분위기가 반전된다.',
    value: '20시~04시. 강남역 도보 5분.',
    tags: ['강남역', '칵테일', 'DJ'],
  },
  '달리는토끼': {
    hook: '역삼 골목의 아담한 감성 라운지. 조명이 어둡고 음악이 낮아서, 대화에 집중하고 싶은 밤에 어울린다.',
    value: '19시~03시. 역삼역 도보 5분. 소규모 모임 적합.',
    tags: ['역삼', '감성', '대화중심'],
  },
  '스카이 라운지': {
    hook: '코엑스 인터컨티넨탈 최상층에서 강남 스카이라인을 내려다본다. 특별한 날 꺼내는 카드로 손색없는 높이.',
    value: '17시~01시. 삼성역 도보 5분. 예약 권장.',
    tags: ['호텔', '야경', '특별한날'],
  },
  '파크 하얏트 부산 리빙룸': {
    hook: '마린시티 바다 위에 떠 있는 듯한 라운지. 오션뷰와 위스키 한 잔이면 부산 여행의 마무리가 완성된다.',
    value: '11시~01시. 해운대 마린시티 소재. 예약 권장.',
    tags: ['해운대', '오션뷰', '호텔'],
  },
};

/* ────────── Helpers ────────── */
function hasBanned(text) {
  return BANNED.filter(w => text.includes(w));
}

function hasRepeat(text, max = 3) {
  const words = text.replace(/[.,!?·\-—:;()'""]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
    if (freq[w] > max) return w;
  }
  return null;
}

/* ────────── Main ────────── */
const venues = JSON.parse(readFileSync(VENUES_PATH, 'utf-8'));
const errors = [];
let changed = false;

for (const v of venues) {
  const copy = COPY[v.name];

  if (copy) {
    // Apply generated copy
    if (v.card_hook !== copy.hook || v.card_value !== copy.value || JSON.stringify(v.card_tags) !== JSON.stringify(copy.tags)) {
      v.card_hook = copy.hook;
      v.card_value = copy.value;
      v.card_tags = copy.tags;
      changed = true;
    }
  }

  // Validate
  for (const field of ['card_hook', 'card_value']) {
    const text = v[field] || '';
    if (!text) {
      errors.push(`[EMPTY] ${v.name}.${field}`);
      continue;
    }
    const banned = hasBanned(text);
    if (banned.length) {
      errors.push(`[BANNED] ${v.name}.${field}: ${banned.join(', ')}`);
    }
    const rep = hasRepeat(text);
    if (rep) {
      errors.push(`[REPEAT] ${v.name}.${field}: "${rep}" >3회`);
    }
  }

  if (!v.card_tags || v.card_tags.length === 0) {
    errors.push(`[EMPTY] ${v.name}.card_tags`);
  }

  // Normalize image_alt
  const region = v.region === '경기' ? v.district.replace(/구$|시$/, '') : v.region;
  const catShort = v.cat_slug === 'club' ? '클럽' : v.cat_slug === 'night' ? '나이트' : '라운지';
  const expectedAlt = `${v.name} ${v.region} ${v.district.replace(/구$|시$/, '')} ${catShort} 썸네일`;
  if (v.image_alt !== expectedAlt) {
    v.image_alt = expectedAlt;
    changed = true;
  }
}

/* ────────── Cross-card template check ────────── */
const hookStarts = {};
for (const v of venues) {
  const start = (v.card_hook || '').slice(0, 8);
  hookStarts[start] = (hookStarts[start] || 0) + 1;
}
for (const [start, count] of Object.entries(hookStarts)) {
  if (count > 2) {
    errors.push(`[TEMPLATE] ${count}개 카드 hook이 "${start}…"로 시작 (2개 이하 권장)`);
  }
}

/* ────────── Write ────────── */
if (changed) {
  writeFileSync(VENUES_PATH, JSON.stringify(venues, null, 2) + '\n', 'utf-8');
  console.log(`✅ venues.json updated — ${Object.keys(COPY).length} venue card copies applied.`);
}

if (errors.length) {
  console.error('❌ Card copy issues:');
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
} else {
  console.log(`✅ Card copy QA passed. ${venues.length} venues, 0 banned words, 0 repeats, 0 template collisions.`);
}
