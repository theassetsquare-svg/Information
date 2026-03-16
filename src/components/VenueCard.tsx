import Link from 'next/link';
import { Venue } from '@/lib/venues';

const taglines: Record<string, string> = {
  race: '호텔 로비를 지나면 펼쳐지는 황금빛 언더그라운드',
  octagon: '강남 한복판, 빛의 원형극장이 열리는 밤',
  arte: '미디어아트가 벽을 타고 흐르는 비밀 갤러리',
  muin: '주소 없는 바, 초대받은 자만 아는 골드 리스트',
  sound: '사운드 엔지니어가 설계한 주파수의 성역',
  face: '얼굴을 기억하는 프라이빗 플로어',
  'jack-livin': '재즈와 하우스가 교차하는 숨은 거실',
  again: '한번 빠지면 되돌아오는 밤의 루프',
  b1: '지하 콘크리트 너머에서 터지는 사운드',
  laser: '레이저 한 줄기가 밤을 가르는 순간',
  aura: '골목 끝에서 피어오르는 오라의 정체',
  sabotage: '반항적 에너지가 응축된 지하',
  bermuda: '한번 들어가면 시간을 잃는 삼각지대',
  purple: '보랏빛 아래 밤이 물드는 곳',
  ocean: '파도처럼 밀려오는 비트의 깊은 바다',
  ff: '빠르고 강렬한 한 밤의 가속 페달',
  faust: '이태원 언덕, 테크노 철학의 전당',
  cakeshop: '세계 DJ가 찾는 작은 거인',
  volnost: '자유라는 이름의 밤',
  plus82: '청담의 감각이 숫자 하나로 응축된 밤',
  azit: '서면 밤의 아지트가 열리는 시간',
  grid: '격자 조명 아래 에너지가 폭발한다',
  groove: '비트를 타고 서면의 밤이 흔들린다',
  'billie-jean': '해운대 달빛 아래 전설이 불리는 밤',
  melt: '해운대의 밤이 녹아내리는 순간',
  babamba: '리듬이 심장을 두드리는 대구의 밤',
  'all-air': '밤바람이 비트를 싣고 오는 곳',
  curtain: '커튼이 열리면 또 다른 섬이 시작된다',
  'monkey-beach': '야자수 아래 비트가 일렁이는 해변',
  'waikiki-utopia': '하와이안 파라다이스가 이태원에 상륙',
  'suyu-shampoo': '세대를 잇는 밤의 살아있는 전설',
  hangukgwan: '검증된 밤의 격식이 시작되는 곳',
  arabian: '인천의 밤에 펼쳐지는 골드 나잇',
  'yadang-skydome': '하늘 아래, 돔 천장이 열리는 무대',
  chancedom: '기회의 문이 열리는 수원의 밤',
  grandprix: '신림의 밤을 질주하는 그랑프리',
  seven: '일곱 빛깔의 밤이 펼쳐지는 곳',
  gukbingwan: '격조 있는 만남이 시작되는 밤',
  champion: '챔피언 벨트를 건 밤의 무대',
  shampoo: '젊음이 거품처럼 피어오르는 밤',
  h2o: '물결처럼 일렁이는 사교의 밤',
  asiad: '아시아드의 열기가 살아 숨 쉬는 밤',
  lululala: '흥이 절로 나는 밤의 무대',
  code: '해독하는 자만 입장하는 라운지',
  hype: '감각적 사교장, 밤을 끌어올리다',
  intro: '처음 만나도 자연스럽게 대화가 되는 곳',
  dm: '은밀한 메시지가 오가는 밤의 응접실',
  color: '조명이 대화의 온도를 높이는 곳',
  'le-club': '프렌치 감성의 골드빛 밤',
  siena: '토스카나 황혼이 강남에 내려앉은 밤',
  'alvin-avenue': '와인잔 너머의 세련된 대화',
  'running-rabbit': '토끼를 따라가면 나오는 비밀 라운지',
  'sky-lounge': '스카이라인을 안주 삼는 하늘 위의 밤',
  'park-hyatt': '해운대 발아래, 럭셔리 호텔의 밤',
  'suyu-pipeline': '수유의 밤을 잇는 파이프라인',
  'suyu-checklist': '이것만 체크하면 완벽한 밤',
};

export default function VenueCard({ venue }: { venue: Venue }) {
  const catLabel = venue.cat_slug === 'club' ? 'Club'
    : venue.cat_slug === 'night' ? 'Night' : 'Lounge';
  const hook = taglines[venue.slug] || venue.card_hook;

  return (
    <Link
      href={`/${venue.cat_slug}/${venue.slug}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="venue-card"
      style={{ textDecoration: 'none' }}
    >
      <div className="venue-card-body">
        {venue.badge && (
          <span className="venue-card-badge">{venue.badge}</span>
        )}
        <span className="venue-card-meta">{catLabel}</span>
        <h3>{venue.name}</h3>
        <p className="venue-card-hook">{hook}</p>
        <div className="venue-card-tags">
          {venue.card_tags.slice(0, 3).map(tag => (
            <span key={tag} className="venue-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
