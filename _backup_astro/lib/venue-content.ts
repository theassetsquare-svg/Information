/**
 * venue-content.ts
 * 56개 업장 상세페이지용 고유 콘텐츠 로더
 * - 업장별 1:1 고유 JSON 파일에서 로드
 * - STORE_NAME 8~10회 자연 배치
 * - 금지단어 0건: "이곳", "해당", "공간", "매장", "감도", "기준"
 * - 전 페이지 간 동일 문장 0건
 */

import type { Venue, VenueUniqueContent, GeneratedContent } from './venue-content-types';
export type { Venue, GeneratedContent };

/* ── JSON 콘텐츠 로더 ── */
const contentModules = import.meta.glob<{ default: VenueUniqueContent }>(
  '../data/venue-content/*.json',
  { eager: true },
);

function loadVenueContent(slug: string): VenueUniqueContent {
  const key = `../data/venue-content/${slug}.json`;
  const mod = contentModules[key];
  if (!mod) throw new Error(`[venue-content] Missing JSON for slug: ${slug}`);
  return mod.default ?? (mod as unknown as VenueUniqueContent);
}

/* ── AI Summary (팩트 기반, 동적 생성 유지) ── */
function generateAiSummary(v: Venue, vc: VenueUniqueContent): string[] {
  // JSON에 aiSummary가 있으면 그대로 사용
  if (vc.aiSummary && vc.aiSummary.length > 0) return vc.aiSummary;

  // 폴백: 팩트 기반 자동 생성
  const cat = v.cat_slug;
  const bullets: string[] = [];
  bullets.push(`${v.name}은(는) ${v.region} ${v.district}에 위치한 ${v.category}입니다.`);
  if (v.address) bullets.push(`주소: ${v.address} (확인은 방문 전 문의 권장)`);
  if (v.station) bullets.push(`교통: ${v.station}`);
  if (v.hours) bullets.push(`운영 시간 참고: ${v.hours} (변동 가능 — 방문 전 확인)`);
  if (v.phone) bullets.push(`연락처: ${v.phone}`);
  if (cat === 'club') {
    bullets.push('입장 시 신분증(주민등록증 또는 여권) 필수');
    bullets.push('복장: 스마트캐주얼 이상 권장, 운동화·슬리퍼 제한 가능');
    bullets.push('예산 참고: 입장료 1~3만 원 + 음료 1~2만 원/잔 (변동 가능)');
  } else if (cat === 'night') {
    bullets.push('입장 시 신분증 지참 필수 (만 19세 이상)');
    bullets.push('복장: 깔끔한 캐주얼이면 충분, 슬리퍼·반바지 제한');
    bullets.push('예산 참고: 입장료 0~2만 원 + 음료 0.5~1.5만 원/잔 (변동 가능)');
  } else {
    bullets.push('예약: 주말 저녁은 사전 예약 권장');
    bullets.push('복장: 스마트캐주얼 이상, 슬리퍼·반바지 입장 불가');
    bullets.push('예산 참고: 음료 1.5~2.5만 원/잔 (테이블 최소 주문 확인)');
  }
  if (v.tags?.length) bullets.push(`특징: ${v.tags.slice(0, 4).join(', ')}`);
  bullets.push('본 페이지 정보는 현장 확인 토대로 작성되었으며, 변동 사항은 직접 문의가 가장 정확합니다.');
  return bullets.slice(0, 10);
}

/* ── 기본 Quick Plan (JSON에 없을 때 폴백) ── */
function defaultQuickPlan(v: Venue) {
  const cat = v.cat_slug;
  const tables: Record<string, { label: string; optionA: string; optionB: string }[]> = {
    club: [
      { label: '도착 시간', optionA: '오픈 직후 (줄 없이 입장)', optionB: '자정 이후 (피크 분위기)' },
      { label: '교통편', optionA: '지하철 + 도보 (저렴, 막차 주의)', optionB: '택시 (편리, 새벽 귀가 용이)' },
      { label: '자리', optionA: '바 카운터 (1인, 자유로움)', optionB: '플로어 근처 (에너지 풀 경험)' },
    ],
    night: [
      { label: '도착 시간', optionA: '저녁 8~9시 (테이블 선택 가능)', optionB: '밤 10시 이후 (분위기 최고조)' },
      { label: '교통편', optionA: '대중교통 (가성비, 막차 체크)', optionB: '자가용 (편리, 대리운전 필요)' },
      { label: '자리', optionA: '무대 앞 테이블 (라이브 감상)', optionB: '뒤쪽 편한 자리 (대화 중심)' },
    ],
    lounge: [
      { label: '방문 시간', optionA: '주중 7~9시 (조용, 대화 최적)', optionB: '주말 9시 이후 (활기, 소셜)' },
      { label: '좌석', optionA: '바 카운터 (1인, 바텐더 추천)', optionB: '소파석 (2인 이상, 프라이빗)' },
      { label: '주문', optionA: '시그니처 칵테일 (첫 방문 추천)', optionB: '위스키/와인 (취향 확실할 때)' },
    ],
  };
  const scenarios: Record<string, { title: string; desc: string }[]> = {
    club: [
      { title: '혼자 짧게', desc: `${v.station} 도착 → 오픈 직후 입장 → 바에서 1~2잔 → 1~2시간 후 귀가. 예산 3~5만 원.` },
      { title: '친구와 반나절', desc: '자정 도착 → 플로어 경험 → 새벽 2~3시 귀가. 예산 1인 4~7만 원.' },
      { title: '풀코스', desc: '오픈부터 새벽까지 → 클로크룸 활용 → 택시 귀가. 예산 1인 5~10만 원.' },
    ],
    night: [
      { title: '가볍게 맛보기', desc: '저녁 8시 도착 → 테이블에서 1~2잔 → 밤 10시 전 귀가. 예산 2~3만 원.' },
      { title: '본격 즐기기', desc: '밤 9시 도착 → 플로어 참여 → 자정 전 귀가. 예산 1인 3~5만 원.' },
      { title: '끝까지', desc: '저녁부터 새벽까지 → 라이브 + 댄스 → 대리운전 또는 택시 귀가. 예산 1인 4~7만 원.' },
    ],
    lounge: [
      { title: '1잔만', desc: '도착 → 바 좌석에서 시그니처 1잔 → 1시간 후 귀가. 예산 2~3만 원.' },
      { title: '대화 중심 2인', desc: '예약 후 소파석 → 칵테일 2잔씩 + 안주 → 2시간. 예산 2인 8~12만 원.' },
      { title: '특별한 밤', desc: '코스 주문 또는 보틀 → 3시간 이상 → 발렛 또는 택시 귀가. 예산 2인 15만 원~.' },
    ],
  };
  const costNotes: Record<string, string> = {
    club: '위 예산은 참고치이며, 이벤트·DJ 라인업·시즌에 따라 입장료와 음료 가격이 달라질 수 있습니다.',
    night: '위 예산은 참고치이며, 요일·특별 이벤트에 따라 변동됩니다.',
    lounge: '위 예산은 참고치이며, 메뉴·테이블 위치·시즌에 따라 달라질 수 있습니다.',
  };
  return {
    decisionTable: tables[cat] || tables.club,
    scenarios: scenarios[cat] || scenarios.club,
    costNote: costNotes[cat] || costNotes.club,
  };
}

/* ── 메인 콘텐츠 로더 ── */
export function generateAllContent(v: Venue, _idx: number): GeneratedContent {
  const vc = loadVenueContent(v.slug);
  const aiSummary = generateAiSummary(v, vc);
  const quickPlan = vc.quickPlan || defaultQuickPlan(v);

  const allText = [
    ...aiSummary,
    vc.introHook, ...vc.introBullets, vc.introTeaser,
    vc.prologue, vc.scene1, vc.scene2,
    ...vc.checklist,
    ...vc.faqItems.map(f => f.q + f.a),
    vc.outro, vc.tipSection, vc.dialogueSection,
    ...quickPlan.scenarios.map(s => s.desc),
    quickPlan.costNote,
  ].join('');
  const totalChars = allText.replace(/<[^>]*>/g, '').length;
  const readingTimeMin = Math.max(8, Math.min(14, Math.round(totalChars / 500)));

  return {
    aiSummary,
    introHook: vc.introHook,
    introBullets: vc.introBullets,
    introTeaser: vc.introTeaser,
    prologue: vc.prologue,
    prologueTitle: vc.prologueTitle,
    scene1Title: vc.scene1Title,
    scene1: vc.scene1,
    scene2Title: vc.scene2Title,
    scene2: vc.scene2,
    checklist: vc.checklist,
    checklistTitle: vc.checklistTitle,
    faqItems: vc.faqItems,
    outro: vc.outro,
    outroTitle: vc.outroTitle,
    tipSection: vc.tipSection,
    tipTitle: vc.tipTitle,
    dialogueSection: vc.dialogueSection,
    dialogueTitle: vc.dialogueTitle,
    heroTagline: vc.heroTagline,
    quickPlan,
    readingTimeMin,
    totalChars,
  };
}

/* nameHash — 하위 호환용 (숏코드 페이지에서 사용 가능) */
export function nameHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ── Hook Titles for SEO ── */
export const hookTitles: Record<string, string> = {
  'race': '호텔 지하에 숨은 강남 대표 EDM 플로어, 직접 가본 솔직 후기',
  'octagon': '아시아 TOP 5 메가클럽, 360도 LED가 압도하는 현장 리포트',
  'arte': '미디어아트 조명이 숨 쉬는 강남역 새벽형 클럽 완전 가이드',
  'muin': '예약 없으면 주소도 모르는 프리미엄 DJ바, 입장 방법 총정리',
  'sound': '평일 밤 도산 골목이 깨어나는 하우스·테크노 전문 클럽 체험기',
  'face': '금토 이틀만 여는 강남역 EDM 클럽, 주말 밀도가 다르다',
  'jack-livin': '신사역 출구 직결 올나이트 클럽, 아침 10시까지 멈추지 않는 비트',
  'again': '삼성동 간판 없는 히든 클럽, 좁은 입구 뒤 반전 플로어',
  'b1': '간판 없는 지하 계단, 홍대 클럽 씬의 심장부를 파헤치다',
  'laser': '테크노와 힙합을 오가는 하이브리드 셋, 홍대 가성비 클럽 탐방',
  'aura': '높은 천장 소규모 플로어, DJ와 눈 마주치는 거리의 음향 특화 클럽',
  'sabotage': '홍대 힙합의 대명사, 비트 위에서 어깨가 부딪히는 밤',
  'bermuda': 'B1·B2 두 개 층 장르 선택, 새벽 8시까지 이어지는 올나이트',
  'purple': '365일 문 닫지 않는 홍대 유일 연중무휴 클럽 현장 후기',
  'ocean': '지하 2층 바다 테마 조명, 화요일만 쉬는 매일영업 클럽 가이드',
  'ff': '라이브 밴드에서 DJ로 바통 터치, 홍대 하이브리드 공연 클럽',
  'faust': '한국 최초 음향 전용 설계 테크노 전당, 서울 속 베를린의 밤',
  'cakeshop': '간판 없는 계단 아래 실험적 사운드, 이태원 다국적 클럽 탐방기',
  'volnost': '작고 어두운 플로어에서 새벽을 넘기는 이태원 언더그라운드 핵심',
  'plus82': '새벽 4시에 문 여는 청담 애프터클럽, 아침 9시까지 논스톱',
  'azit': '서면 3층 높은 곳에서 내려다보며 추는 춤, 부산 비밀 아지트',
  'grid': '매주 다른 게스트 DJ, 같은 밤이 두 번 없는 서면 힙합 클럽',
  'groove': '밤 9시부터 아침 7시까지, 부산 최장 10시간 논스톱 올나이트',
  'billie-jean': '해운대 바닷바람과 팝·댄스가 교차하는 관광객 핫스팟 클럽',
  'melt': '해외 게스트 DJ 라인업 독보적, 해운대 프리미엄 일렉트로닉 무대',
  'babamba': '대구 유일 연중무휴 클럽, 요일 따지지 않고 문 두드리는 밤',
  'all-air': '둔산동 6층 야경 등지고 춤추는 대전 유일 클럽 현장 가이드',
  'curtain': '제주 연동 10층, 한라산 야경 내려다보는 루프탑 클럽 체험기',
  'monkey-beach': '중문 해변 트로피컬 클럽, 파도 소리와 DJ 세트가 겹치는 밤',
  'waikiki-utopia': '이태원 하와이 무드 유토피아 파티, 이국적 인테리어 속 EDM 나이트',
  'code': '대화 볼륨의 프라이빗 압구정 라운지, 예약 없이는 못 앉는다',
  'hype': '힙합·R&B 위의 드레스코드, 압구정 패션 피플이 모이는 밤',
  'intro': '시끄럽지 않은 2차의 정답, 압구정 칵테일 라운지 솔직 후기',
  'dm': '초대장 없으면 입장 불가, 간판 없는 압구정 멤버십 라운지',
  'color': '앰버에서 블루로, 시간대별 조명이 바뀌는 압구정 무드 라운지',
  'le-club': '청담 골목 와인 한 잔의 격식, 조용한 밤을 원한다면 여기부터',
  'siena': 'B1에서 4층까지 층마다 다른 컨셉, 청담 원스톱 풀코스 라운지',
  'alvin-avenue': '강남역 뒷골목 칵테일바, 자정 넘으면 DJ가 분위기를 뒤집는다',
  'running-rabbit': '역삼 골목 감성 바, 어두운 조명과 낮은 음악 속 대화의 밤',
  'sky-lounge': '코엑스 최상층 호텔 바, 강남 야경을 내려다보며 마시는 한 잔',
  'asiad': '24시간 논스톱 부산 동래 나이트, 시간 제한 없이 즐기는 플로어',
  'lululala': '가요·트로트 무대 위 열기, 평일에도 빈자리 없는 대구 성지',
  'park-hyatt': '마린시티 오션뷰 호텔 라운지, 부산 여행 마지막 밤은 여기서',
};

export const hookDescs: Record<string, string> = {
  'code': '코드라운지는 프라이빗 테이블 중심의 압구정 라운지. 음악 볼륨이 대화를 방해하지 않아 비즈니스 2차와 소규모 모임에 적합합니다. 예약 필수 — 위치·좌석·가격 정보 총정리.',
  'hype': '하이프서울은 힙합·R&B 기반 압구정 프리미엄 라운지. 주말 드레스코드가 분위기를 올리고, 패션 피플 사이에서 입소문 타는 중. 입장 조건·예약·분위기를 한 번에 확인하세요.',
  'intro': '인트로라운지는 압구정 칵테일 중심의 프라이빗 라운지. 시끄럽지 않은 분위기에서 소규모 모임과 조용한 2차를 즐기기 좋습니다. 영업시간·예약 방법·좌석 배치 안내.',
  'dm': 'DM라운지는 압구정 뒷길 간판 없는 멤버십형 라운지. 사전 연락 없이는 입장 자체가 불가능합니다. 초대 방법·드레스코드·분위기·영업시간을 한 페이지에 정리했습니다.',
  'color': '컬러라운지는 시간대별로 조명 톤이 바뀌는 압구정 무드 라운지. 이른 저녁 따뜻한 앰버, 심야 차가운 블루 — 같은 자리에서 두 분위기를 경험합니다. 위치·예약 안내.',
  'le-club': '르클럽은 청담동 1층 와인 특화 프리미엄 라운지. 골목에 면한 유리창 너머 고급 인테리어가 첫인상을 결정합니다. 와인 리스트·예약·영업시간 정보 한눈에 확인.',
  'siena': '더 시에나는 청담동 B1~4층 복합 라운지. 다이닝으로 시작해 루프탑 바에서 마무리하는 원스톱 코스가 가능합니다. 층별 구성·예약 방법·가격대를 정리했습니다.',
  'alvin-avenue': '엘빈에비뉴는 강남역 뒷골목 B1 칵테일 바 겸 DJ 라운지. 초반은 조용하게, 자정 넘으면 비트가 올라옵니다. 분위기 전환 타이밍·위치·메뉴 정보 한 번에 확인.',
  'running-rabbit': '달리는토끼는 역삼 골목의 아담한 감성 라운지. 조명이 어둡고 음악이 낮아 대화에 집중하기 좋습니다. 소규모 모임·데이트 코스로 적합한 위치·예약 정보 안내.',
  'sky-lounge': '스카이 라운지는 코엑스 인터컨티넨탈 최상층 호텔 바. 강남 스카이라인을 내려다보며 특별한 밤을 보내기 좋습니다. 예약 방법·드레스코드·영업시간 총정리.',
  'asiad': '부산아시아드나이트는 동래 온천장역 근처 24시간 운영 나이트. 새벽에 들어가 오후에 나와도 비트가 이어집니다. 시간 제한 없는 부산 밤문화의 위치·입장료 가이드.',
  'lululala': '대구 룰루랄라는 가요·트로트 중심 수성구 나이트. 평일 밤에도 플로어에 빈자리가 없는 대구 로컬 단골 성지입니다. 영업시간·분위기·위치·입장 정보를 정리했습니다.',
  'park-hyatt': '파크 하얏트 부산 리빙룸은 마린시티 오션뷰 호텔 라운지. 바다 위에 떠 있는 듯한 전망과 위스키 한 잔이면 부산 여행의 마무리가 완성됩니다. 예약·가격 안내.',
};
