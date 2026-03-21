import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/venues';

export const metadata: Metadata = {
  title: `캘린더 — 월간 스케줄 한눈에 | ${SITE_NAME}`,
  description: '월간 스케줄 달력. 금토 오프닝부터 월말 스페셜까지 날짜별 일정 표기.',
  alternates: { canonical: SITE_URL + '/events/' },
  openGraph: {
    title: `캘린더 — 월간 스케줄 한눈에 | ${SITE_NAME}`,
    description: '월간 스케줄 달력. 금토 오프닝부터 월말 스페셜까지.',
    url: SITE_URL + '/events/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

/* ── 캘린더 빌드 (현재 월 기준) ── */
function buildCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = `${year}년 ${month + 1}월`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // 금요일 표시 (0=일, 5=금, 6=토)
  const fridays: number[] = [];
  const saturdays: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 5) fridays.push(d);
    if (dow === 6) saturdays.push(d);
  }

  // 마지막 금요일
  const lastFriday = fridays[fridays.length - 1];

  return { cells, monthName, fridays, saturdays, lastFriday, year, month };
}

const EVENTS = [
  {
    title: '매주 금요일 — 주요 업소 피크타임',
    desc: '금요일 밤 11시부터 주요 클럽과 나이트의 피크타임이 시작된다. 일찍 도착하면 좋은 자리를 선점할 수 있다.',
    recurrence: 'friday' as const,
  },
  {
    title: '매주 토요일 — 주말 스페셜',
    desc: '토요일은 주말 방문객이 가장 많은 날. 각 업소별 주말 이벤트와 스페셜 프로그램이 운영된다.',
    recurrence: 'saturday' as const,
  },
  {
    title: '매월 마지막 금요일 — 월말 파티',
    desc: '월말 금요일에는 특별한 파티와 이벤트가 열리는 곳이 많다. 한 달의 마무리를 화려하게 장식하자.',
    recurrence: 'lastFriday' as const,
  },
];

export default function EventsPage() {
  const cal = buildCalendar();
  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === cal.month;
  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  /* JSON-LD for events */
  const year = cal.year;
  const m = String(cal.month + 1).padStart(2, '0');
  const jsonLdEvents = [
    ...cal.fridays.map((d) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: '주요 업소 피크타임',
      startDate: `${year}-${m}-${String(d).padStart(2, '0')}T23:00:00+09:00`,
      endDate: `${year}-${m}-${String(d).padStart(2, '0')}T23:59:00+09:00`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: '전국 주요 밤문화 업소', address: '대한민국' },
      description: '금요일 밤 주요 클럽과 나이트의 피크타임.',
      organizer: { '@type': 'Organization', name: '오늘밤어디', url: 'https://informationa.pages.dev' },
    })),
    ...cal.saturdays.map((d) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: '주말 스페셜',
      startDate: `${year}-${m}-${String(d).padStart(2, '0')}T22:00:00+09:00`,
      endDate: `${year}-${m}-${String(d).padStart(2, '0')}T23:59:00+09:00`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: '전국 주요 밤문화 업소', address: '대한민국' },
      description: '토요일 주말 스페셜 이벤트.',
      organizer: { '@type': 'Organization', name: '오늘밤어디', url: 'https://informationa.pages.dev' },
    })),
    ...(cal.lastFriday
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: '월말 파티',
            startDate: `${year}-${m}-${String(cal.lastFriday).padStart(2, '0')}T22:00:00+09:00`,
            endDate: `${year}-${m}-${String(cal.lastFriday).padStart(2, '0')}T23:59:00+09:00`,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: { '@type': 'Place', name: '전국 주요 밤문화 업소', address: '대한민국' },
            description: '매월 마지막 금요일 월말 파티.',
            organizer: { '@type': 'Organization', name: '오늘밤어디', url: 'https://informationa.pages.dev' },
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvents) }}
      />

      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 이벤트
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>이벤트 캘린더</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', maxWidth: '600px' }}>
            이번 달 밤문화 일정을 한눈에 확인하자. 매주 금요일과 토요일이 피크타임이다.
          </p>

          {/* 캘린더 그리드 */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.25rem' }}>
              {cal.monthName}
            </h2>

            {/* 요일 헤더 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                marginBottom: '0.5rem',
              }}
            >
              {WEEKDAYS.map((w, i) => (
                <div
                  key={w}
                  style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : 'var(--text-muted)',
                    padding: '0.4rem 0',
                  }}
                >
                  {w}
                </div>
              ))}
            </div>

            {/* 날짜 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
              }}
            >
              {cal.cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} style={{ padding: '0.5rem', minHeight: '48px' }} />;
                }
                const isFriday = cal.fridays.includes(day);
                const isSaturday = cal.saturdays.includes(day);
                const isLastFri = day === cal.lastFriday;
                const isToday = isCurrentMonth && day === today;
                const hasEvent = isFriday || isSaturday;

                return (
                  <div
                    key={day}
                    style={{
                      padding: '0.5rem 0.25rem',
                      minHeight: '48px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      background: isToday
                        ? 'var(--purple)'
                        : hasEvent
                          ? 'rgba(139,92,246,0.06)'
                          : 'transparent',
                      color: isToday ? '#FFF' : 'var(--text)',
                      fontSize: '0.9rem',
                      fontWeight: isToday || hasEvent ? 700 : 400,
                      position: 'relative',
                    }}
                  >
                    {day}
                    {hasEvent && !isToday && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '2px',
                          marginTop: '2px',
                        }}
                      >
                        {isFriday && (
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: isLastFri ? '#EF4444' : 'var(--purple)',
                            }}
                          />
                        )}
                        {isSaturday && (
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: '#8B5CF6',
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 이벤트 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {EVENTS.map((evt, i) => (
              <div
                key={i}
                style={{
                  padding: '1.25rem 1.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  borderLeft: `4px solid ${i === 0 ? 'var(--purple)' : i === 1 ? '#8B5CF6' : '#EF4444'}`,
                }}
              >
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{evt.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{evt.desc}</p>
              </div>
            ))}
          </div>

          {/* 이벤트 등록 배너 */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1A1714, #241F1A)',
              border: '1px solid var(--border-accent)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
              이벤트 등록은 오늘밤어디에서
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
              업소 이벤트를 등록하고 더 많은 방문객을 만나보세요.
            </p>
            <a
              href="https://ilsanroom.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'var(--purple)',
                color: '#FFF',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              오늘밤어디 바로가기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
