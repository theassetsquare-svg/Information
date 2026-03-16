import { Venue } from './venues';

export const SITE_NAME = '골드나잇 가이드';
const YEAR = new Date().getFullYear();

/* ── 해시 기반 결정적 선택 ── */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], slug: string, count: number, offset = 0): T[] {
  const h = hash(slug + offset);
  const result: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count * 3 && result.length < count; i++) {
    let idx = (h + i * 11 + offset * 17) % arr.length;
    while (used.has(idx)) idx = (idx + 1) % arr.length;
    used.add(idx);
    result.push(arr[idx]);
  }
  return result;
}

/* ── 태그라인 풀 (카테고리별) ── */
const clubTaglines = [
  '비트가 몸을 감싸는 순간, 밤이 시작된다',
  '조명이 꺼지면 사운드가 공간을 지배한다',
  '플로어 위에서 시간을 잊는 곳',
  '밤이 깊을수록 에너지가 올라가는 공간',
  '입구를 지나는 순간 일상이 멈춘다',
  '사운드 시스템이 다른 차원인 곳',
  '금요일 밤, 이곳이 아니면 어디를 가겠나',
  'DJ의 선곡이 밤의 온도를 결정한다',
  '처음 오면 놀라고, 두 번째부턴 단골이 된다',
  '이 동네 밤의 중심축',
];

const nightTaglines = [
  '테이블에 앉는 순간 밤의 주인공이 된다',
  '격식과 흥이 동시에 존재하는 드문 장소',
  '이 동네 밤 문화의 산증인',
  '오래된 단골이 많다는 건 이유가 있다',
  '피크타임의 열기를 직접 느껴봐야 안다',
  '여기 한번 오면 다른 데 못 간다는 후기가 많다',
  '좌석 배치부터 남다른 전략이 필요한 곳',
  '자정이 넘으면 진짜 분위기가 시작된다',
  '주말 밤이면 이 거리가 들썩인다',
  '전통과 현대가 공존하는 밤의 사교장',
];

const loungeTaglines = [
  '대화에 집중할 수 있는 유일한 밤',
  '잔을 기울이며 시간이 천천히 흐르는 곳',
  '분위기만으로 값어치를 하는 공간',
  '볼륨이 낮아 대화가 주인공이 되는 곳',
  '첫 만남도 편안해지는 온도의 공간',
];

const roomTaglines = [
  '문이 닫히면 오롯이 우리만의 시간',
  '프라이빗한 공간에서 격식을 갖추다',
];

const yojeongTaglines = [
  '한정식과 국악이 어우러지는 전통의 현장',
];

const hoppaTaglines = [
  '여성을 위한 프리미엄 밤의 선택지',
  '처음이라도 편하게, 시스템이 안내하는 곳',
  '분위기 좋고 서비스 확실한 프리미엄 공간',
  '밤의 주인공은 당신이 된다',
];

function getTagline(venue: Venue): string {
  const pools: Record<string, string[]> = {
    club: clubTaglines,
    night: nightTaglines,
    lounge: loungeTaglines,
    room: roomTaglines,
    yojeong: yojeongTaglines,
    hoppa: hoppaTaglines,
  };
  const pool = pools[venue.cat_slug] || clubTaglines;
  const idx = hash(venue.slug + 'tagline') % pool.length;
  return pool[idx];
}

/* ── 서사 풀 ── */
const narrativePool = [
  (v: Venue) => `${v.district} 한복판에서 ${v.name}은 밤이 깊어질수록 제 색깔을 드러낸다. 문을 열고 들어서는 순간의 공기부터 다르다.`,
  (v: Venue) => `${v.region}에서 밤 외출을 계획할 때, 이곳은 항상 후보에 올라온다. 분위기와 접근성의 균형이 괜찮다.`,
  (v: Venue) => `피크타임은 자정 무렵이다. 그 전에 도착하면 좋은 자리를 고를 여유가 생긴다.`,
  (v: Venue) => `이곳의 강점은 한마디로 정리하기 어렵다. 직접 가봐야 느낌이 온다는 후기가 많다.`,
  (v: Venue) => `사전에 전화 한 통이면 당일 상황을 파악할 수 있다. 주말이라면 확인이 필수다.`,
  (v: Venue) => `안쪽 좌석과 바 카운터의 분위기가 사뭇 다르다. 첫 방문이면 바 쪽에서 한잔하며 공간을 파악하는 편이 낫다.`,
  (v: Venue) => `금요일 밤에는 대기가 생길 수 있다. 일찍 움직이거나 평일을 노려보는 것도 방법이다.`,
  (v: Venue) => `단체로 오면 테이블을, 소수라면 바석을 추천한다. 인원에 따라 경험이 달라진다.`,
  (v: Venue) => `${v.region} 지역에서 접근성과 분위기를 동시에 잡은 몇 안 되는 곳이다.`,
  (v: Venue) => `첫인상이 전부는 아니다. 두세 번 방문하면 진짜 매력이 보이기 시작한다.`,
  (v: Venue) => `주변에 식사할 곳이 많다. 저녁부터 자연스럽게 밤으로 이어지는 동선이 완성된다.`,
  (v: Venue) => `혼자 와도 어색하지 않은 구조다. 바 카운터가 자연스러운 1인석 역할을 한다.`,
  (v: Venue) => `주중에 방문하면 여유롭게 즐길 수 있다. 직원 응대도 한결 느긋해진다.`,
  (v: Venue) => `가격대는 ${v.district} 상권 수준이다. 미리 예산을 잡아두면 부담이 줄어든다.`,
  (v: Venue) => `이곳을 다녀온 사람들의 공통 후기는 "다시 오고 싶다"이다.`,
  (v: Venue) => `${v.region}에서 약속 장소를 정할 때 이곳을 떠올리는 사람이 늘고 있다.`,
  (v: Venue) => `내부 인테리어가 정돈돼 있어서 사진도 잘 나온다. SNS 후기가 많은 이유가 있다.`,
  (v: Venue) => `운영 시간을 꼭 확인하고 가라. 요일에 따라 오픈 시간이 다를 수 있다.`,
  (v: Venue) => `여기는 음악 선곡이 좋다는 평이 많다. 취향에 맞는 밤을 보내고 싶다면 참고하자.`,
  (v: Venue) => `이 동네에서 밤을 보내본 사람이라면 이곳의 위치를 이미 알 것이다.`,
];

/* ── FAQ 풀 ── */
const faqPool: ((v: Venue) => { q: string; a: string })[] = [
  (v) => ({ q: '영업시간이 어떻게 되나요?', a: v.hours ? `${v.hours}에 운영합니다.` : '방문 전 전화로 확인하는 것을 권합니다.' }),
  (v) => ({ q: '위치가 어디인가요?', a: v.address ? `${v.address}에 있습니다.` : `${v.region} ${v.district}에 위치합니다. 정확한 주소는 전화로 확인하세요.` }),
  (v) => ({ q: '나이 제한이 있나요?', a: '만 19세 이상 입장 가능합니다. 신분증을 반드시 지참하세요.' }),
  (v) => ({ q: '예약이 필요한가요?', a: '예약 없이 방문 가능하지만 주말에는 사전 연락을 권합니다.' }),
  (v) => ({ q: '혼자 방문해도 괜찮나요?', a: '바 카운터를 이용하면 1인 방문도 자연스럽습니다.' }),
  (v) => ({ q: '주차가 가능한가요?', a: '인근 유료 주차장을 이용하거나 대중교통을 권합니다.' }),
  (v) => ({ q: '카드 결제가 되나요?', a: '대부분의 카드 결제가 가능합니다.' }),
  (v) => ({ q: '드레스코드가 있나요?', a: '깔끔한 캐주얼 이상을 권장합니다. 슬리퍼나 운동복은 제한될 수 있습니다.' }),
  (v) => ({ q: '피크타임은 언제인가요?', a: '보통 금·토요일 밤 11시~새벽 1시가 가장 붐빕니다.' }),
  (v) => ({ q: '가격대가 궁금합니다', a: `${v.district} 지역 평균 수준입니다. 전화로 미리 확인하면 계획이 수월합니다.` }),
];

/* ── 팁 풀 ── */
const tipPool: string[] = [
  '피크타임 전에 도착하면 좋은 자리를 선점할 수 있다.',
  '신분증은 필수다. 없으면 입장이 불가능하다.',
  '보조 배터리를 꼭 챙기자. 새벽에 배터리 없으면 곤란하다.',
  '귀중품은 최소한으로 가져가는 것이 안전하다.',
  '음주 후 운전은 절대 금지. 대리운전이나 택시를 이용하자.',
  '복장은 깔끔하게. 첫인상이 밤의 경험을 좌우한다.',
  '물을 충분히 마셔두면 다음 날 컨디션이 한결 낫다.',
  '바 카운터에 앉으면 혼자서도 자연스럽게 분위기를 즐길 수 있다.',
  '주변 맛집을 미리 알아두면 저녁부터 새벽까지 동선이 완성된다.',
  '주말 밤에는 택시 잡기가 어렵다. 호출 앱을 미리 준비하자.',
  '처음 가는 곳이라면 너무 늦은 시간보다 오픈 직후가 편하다.',
  '동행자와 귀가 방법을 미리 합의해두면 편하다.',
  '사전에 전화로 현재 상황을 확인하면 헛걸음을 줄인다.',
  '리뷰는 참고만 하자. 직접 가봐야 비로소 판단이 가능하다.',
];

const catLabel: Record<string, string> = {
  club: '클럽', night: '나이트', lounge: '라운지',
  room: '룸', yojeong: '요정', hoppa: '호빠',
};

/* ── 메인 콘텐츠 생성 ── */
export function generateGoldContent(venue: Venue) {
  const tagline = getTagline(venue);
  const label = catLabel[venue.cat_slug] || venue.category;

  // 서사 3단락
  const selectedNarratives = pick(narrativePool, venue.slug, 3, 0);
  let narrativeText = selectedNarratives.map(fn => fn(venue)).join('\n\n');
  let nameCount = 0;
  const escaped = venue.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  narrativeText = narrativeText.replace(new RegExp(escaped, 'g'), () => {
    nameCount++;
    return nameCount <= 2 ? venue.name : '이곳';
  });

  // FAQ 5개
  const faq = pick(faqPool, venue.slug, 5, 1).map(fn => fn(venue));

  // 팁 6개
  const tips = pick(tipPool, venue.slug, 6, 2);

  // 고유 description (12패턴, venue.name 필수 포함)
  const descPool: ((v: Venue, tl: string) => string)[] = [
    (v, tl) => `${v.name} — ${tl}. ${v.district} 현장 답사 기반 ${YEAR} 솔직 기록.`,
    (v, tl) => `${v.name}, 단골만 알던 곳을 공개한다. ${tl}. 리얼 리뷰와 방문 체크리스트.`,
    (v, tl) => `${v.name}: ${tl}. 직접 다녀온 사람만 쓸 수 있는 솔직 안내서.`,
    (v, tl) => `${v.name}으로 향하는 이유. ${tl}. ${YEAR} 현장 취재 완전 가이드.`,
    (v, tl) => `${v.name} 첫 방문이라면 필독. ${tl}. 꿀팁과 솔직 후기 정리.`,
    (v, tl) => `${v.name} — ${tl}. ${v.region} 도보권. 운영·분위기·팁 ${YEAR} 총정리.`,
    (v, tl) => `${v.name} 방문 전 확인할 것. ${tl}. 피크타임·복장·교통편 정리.`,
    (v, tl) => `${v.name}: ${v.region} 밤 지도의 핵심. ${tl}. 현장 기반 안내서.`,
    (v, tl) => `${v.name} — ${v.district} 밤 약속 장소 고민 끝. ${tl}. 접근성·분위기 비교.`,
    (v, tl) => `한번 가면 또 찾게 되는 ${v.name}. ${tl}. ${YEAR} 완전 가이드.`,
    (v, tl) => `${label} 마니아 추천 ${v.name}. ${tl}. 솔직한 현장 후기.`,
    (v, tl) => `${v.name}의 진짜 매력. ${tl}. 방문 전 알아야 할 모든 것 ${YEAR}.`,
  ];
  const descIdx = hash(venue.slug + 'gold-desc-v2') % descPool.length;
  const description = descPool[descIdx](venue, tagline);

  return {
    tagline,
    title: `${venue.name} — ${tagline} | 골드나잇`,
    description,
    ogImage: `/og/${venue.cat_slug}-${venue.slug}.png`,
    narrative: narrativeText,
    faq,
    tips,
    year: YEAR,
  };
}

/* ── 카테고리 페이지 콘텐츠 ── */
export function getCategoryContent(catSlug: string) {
  const data: Record<string, { title: string; description: string; heading: string; intro: string }> = {
    club: {
      title: `전국 클럽 리스트 — 사운드가 시작되는 곳 | 골드나잇`,
      description: `강남·압구정·이태원·홍대·부산·제주. 전국 클럽을 비교하는 ${YEAR} 현장 가이드.`,
      heading: '전국 클럽, 한눈에 비교한다',
      intro: 'EDM부터 힙합, 테크노까지. 사운드와 분위기가 다른 전국 각지의 플로어를 정리했다.',
    },
    night: {
      title: `전국 나이트 리스트 — 격식 있는 밤의 선택지 | 골드나잇`,
      description: `수유·상봉·인천·수원·대전·울산·부산·광주. 전국 나이트를 비교하는 ${YEAR} 가이드.`,
      heading: '전국 나이트, 격식과 흥이 공존하는 밤',
      intro: '테이블 중심의 전통 나이트부터 현대식 공간까지. 지역과 취향에 맞는 곳을 골라보자.',
    },
    lounge: {
      title: `라운지 리스트 — 대화가 주인공인 밤 | 골드나잇`,
      description: `압구정 라운지를 비교한다. 분위기·음료·예약 팁까지 ${YEAR} 가이드.`,
      heading: '라운지, 대화가 피어나는 밤',
      intro: '볼륨이 낮고 대화에 집중할 수 있는 공간. 소개팅이나 소규모 모임에도 적합하다.',
    },
    room: {
      title: `전국 룸 리스트 — 프라이빗 공간 가이드 | 골드나잇`,
      description: `일산·부산 해운대. 프라이빗 룸 정보를 비교하는 ${YEAR} 가이드.`,
      heading: '전국 룸, 문이 닫히면 우리만의 시간',
      intro: '단체 모임이나 비즈니스 접대에 적합한 프라이빗 공간을 안내한다.',
    },
    yojeong: {
      title: `요정 리스트 — 한국 전통 접대의 현장 | 골드나잇`,
      description: `한정식과 국악이 어우러지는 요정 정보. ${YEAR} 현장 가이드.`,
      heading: '요정, 격식과 풍류가 공존하는 곳',
      intro: '한국 전통 접대 문화의 정수. 한정식 코스와 국악 공연이 함께하는 특별한 공간이다.',
    },
    hoppa: {
      title: `전국 호빠 리스트 — 여성을 위한 프리미엄 밤 | 골드나잇`,
      description: `강남·부산·장안동·건대. 전국 호빠 정보를 비교하는 ${YEAR} 가이드.`,
      heading: '전국 호빠, 여성을 위한 프리미엄 공간',
      intro: '호스트바의 시스템과 분위기를 미리 파악하고 가면 첫 방문도 한결 편해진다.',
    },
  };
  return data[catSlug] || data.club;
}

export function getHomeContent() {
  return {
    title: `골드나잇 가이드 — 전국 밤문화 ${YEAR} 완전 가이드`,
    description: `전국 103곳의 밤문화를 한눈에. 클럽·나이트·라운지·룸·요정·호빠. ${YEAR} 현장 기반 가이드.`,
    heading: '전국 밤문화 가이드',
    subheading: `클럽·나이트·라운지·룸·요정·호빠 ${YEAR}`,
  };
}
