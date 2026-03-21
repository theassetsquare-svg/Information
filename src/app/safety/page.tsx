import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '../../lib/venues';
import SafetyClient from '../../components/SafetyClient';

export const metadata: Metadata = {
  title: `귀가 수칙 — 알코올 계산기·긴급번호 | ${SITE_NAME}`,
  description: '혈중농도 측정기, 긴급 전화번호부, 택시 호출 팁, 위치 공유 설정법. 무사 귀환을 위한 수칙.',
  alternates: { canonical: SITE_URL + '/safety/' },
  openGraph: {
    title: `귀가 수칙 — 알코올 계산기·긴급번호 | ${SITE_NAME}`,
    description: '혈중농도 측정기, 긴급 전화번호부, 택시 호출 팁.',
    url: SITE_URL + '/safety/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

const emergencyNumbers = [
  { name: '경찰', number: '112', desc: '범죄 신고, 긴급 상황' },
  { name: '소방·구급', number: '119', desc: '화재, 응급 환자, 구조' },
  { name: '대리운전', number: '1588-5000', desc: '카카오 대리운전 (전국)' },
  { name: '여성 긴급 전화', number: '1366', desc: '성폭력·가정폭력 상담 (24시간)' },
  { name: '음주 운전 신고', number: '182', desc: '음주 운전 목격 시 신고' },
  { name: '응급 의료 정보', number: '1339', desc: '응급 의료 상담 (24시간)' },
];

const safeReturnTips = [
  {
    title: '교통편을 미리 확보하자',
    items: [
      '카카오T, 타다 앱을 미리 설치하고 결제 수단을 등록하자',
      '지하철 막차 시간 확인 (보통 23:30~00:00 사이 마지막 열차)',
      '심야 버스 노선 미리 검색 (N버스)',
      '대리운전 번호를 연락처에 저장해두자',
    ],
  },
  {
    title: '음주 속도를 조절하자',
    items: [
      '술 한 잔당 물 한 잔을 함께 마시자',
      '빈속에 마시지 말 것. 출발 전에 식사하자',
      '권유를 거절할 줄 알아야 한다. "오늘은 여기까지"라고 말하자',
      '음료를 자리에 두고 간 사이 다른 사람이 무언가를 넣을 수 있다. 자리를 비운 음료는 버리자',
    ],
  },
  {
    title: '개인 안전 수칙',
    items: [
      '처음 만난 사람과 단둘이 2차 가지 않기',
      '귀중품은 최소한으로 챙기고, 분실 시 신속하게 신고',
      '지갑과 핸드폰은 몸에 붙이자 (뒷주머니 X)',
      '낯선 장소에서는 출구 위치를 확인하자',
    ],
  },
  {
    title: '귀가 시 주의사항',
    items: [
      '밝은 길, 사람 많은 길로 걸어가자',
      '택시 탑승 시 차량 번호를 친구에게 보내자',
      '지나치게 취한 상태라면 무리하지 말고 근처 카페에서 정신을 차리자',
      '불쾌한 상황이 생기면 112에 주저 없이 연락하자',
    ],
  },
];

export default function SafetyPage() {
  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 안전 가이드
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>안전 가이드</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', marginBottom: '2.5rem' }}>
            즐거운 밤을 위한 필수 정보. 안전하게 놀고, 안전하게 돌아오자.
          </p>

          {/* 음주 계산기 (client component) */}
          <SafetyClient />
        </div>
      </section>

      {/* 긴급 연락처 */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container narrow">
          <h2 style={{ marginBottom: '1.5rem' }}>긴급 연락처</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {emergencyNumbers.map(en => (
              <div key={en.number} style={{
                padding: '1.25rem', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: '12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '0.75rem',
              }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>{en.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{en.desc}</p>
                </div>
                <a
                  href={`tel:${en.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--purple)', color: '#FFF',
                    padding: '0.5rem 1.25rem', borderRadius: '8px',
                    fontWeight: 700, fontSize: '1.05rem',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  {en.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 안전 귀가 팁 */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container narrow">
          <h2 style={{ marginBottom: '1.5rem' }}>안전 귀가 가이드</h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {safeReturnTips.map((section, si) => (
              <div key={si} style={{
                padding: '1.5rem', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: '16px',
              }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--purple)' }}>
                  {section.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{
                      padding: '0.4rem 0', paddingLeft: '1.25rem',
                      position: 'relative', fontSize: '0.9rem', color: 'var(--text-sub)',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--purple)', fontWeight: 700 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 위치 공유 가이드 */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-alt)' }}>
        <div className="container narrow">
          <h2 style={{ marginBottom: '1rem' }}>친구에게 위치 공유하기</h2>
          <p style={{ color: 'var(--text-sub)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            밤에 나갈 때는 신뢰할 수 있는 친구에게 위치를 공유하자. 만약의 상황에 큰 도움이 된다.
          </p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '1.5rem', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '12px',
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>카카오톡으로 위치 공유</h3>
              <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.4rem' }}>친구와의 채팅방 열기</li>
                <li style={{ marginBottom: '0.4rem' }}>왼쪽 하단 &lsquo;+&rsquo; 버튼 탭</li>
                <li style={{ marginBottom: '0.4rem' }}>&lsquo;위치&rsquo; 선택</li>
                <li style={{ marginBottom: '0.4rem' }}>&lsquo;실시간 위치 공유&rsquo; 탭</li>
                <li>공유 시간 설정 (1시간~8시간) 후 전송</li>
              </ol>
            </div>
            <div style={{
              padding: '1.5rem', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '12px',
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>아이폰 — 나의 찾기</h3>
              <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.4rem' }}>&lsquo;나의 찾기&rsquo; 앱 열기</li>
                <li style={{ marginBottom: '0.4rem' }}>&lsquo;나&rsquo; 탭 → &lsquo;내 위치 공유&rsquo; 활성화</li>
                <li style={{ marginBottom: '0.4rem' }}>&lsquo;사람&rsquo; 탭 → &lsquo;위치 공유 시작&rsquo;</li>
                <li>공유할 친구 선택 후 기간 설정</li>
              </ol>
            </div>
            <div style={{
              padding: '1.5rem', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '12px',
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>안드로이드 — 구글 지도</h3>
              <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.4rem' }}>구글 지도 앱 열기</li>
                <li style={{ marginBottom: '0.4rem' }}>프로필 사진 탭 → &lsquo;위치 공유&rsquo;</li>
                <li style={{ marginBottom: '0.4rem' }}>공유 시간 설정</li>
                <li>공유할 연락처 선택 후 전송</li>
              </ol>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem', padding: '1.25rem', textAlign: 'center',
            background: 'linear-gradient(135deg, #1A1714, #241F1A)',
            border: '1px solid var(--border-accent)', borderRadius: '12px',
          }}>
            <p style={{ fontWeight: 700, color: 'var(--purple)', fontSize: '1rem' }}>
              안전한 밤은 사전 준비에서 시작된다. 즐기되, 무사히 돌아오자.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
