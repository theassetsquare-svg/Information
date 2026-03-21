import VenueCard from './VenueCard';
import VsBattle from './VsBattle';
import { SlotMachine, DailyStreak, EndlessRecommend } from './AddictionEngine';
import { FullCompareHook, AIRecommendHook } from './HookingCTAs';

interface CatPageProps {
  heading: string;
  intro: string;
  body: string;
  guide: { title: string; items: string[] };
  timeslots: { time: string; level: string; bar: string }[];
  venues: any[];
  catLabel: string;
  year: number;
  isHoppa?: boolean;
}

export default function CategoryPage({ heading, intro, body, guide, timeslots, venues, catLabel, year, isHoppa }: CatPageProps) {
  const accent = isHoppa ? '#F43F5E' : '#8B5CF6';
  const bgAccent = isHoppa ? '#FFF1F2' : '#FFFFFF';
  const borderAccent = isHoppa ? '#FDA4AF' : '#8B5CF6';
  const textAccent = isHoppa ? '#E11D48' : '#8B5CF6';

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span> {catLabel}
        </div>

        {/* ① 소개글 500자+ */}
        <h1 style={{ marginTop: '1rem' }}>{heading}</h1>
        <p style={{ maxWidth: '480px', marginBottom: '1.5rem', color: '#333333' }}>{intro}</p>
        <div className="narrow" style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#111111' }}>{body}</p>
          <p style={{ marginTop: '1rem', color: '#111111' }}>
            {year}년 기준 {venues.length}곳을 정리했다.
          </p>
        </div>

        {/* ② 업소 리스트 */}
        <div className="venue-grid">
          {venues.map(v => <VenueCard key={v.slug} venue={v} />)}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666666', textAlign: 'center' }}>
          전체 {venues.length}곳 — 각 카드를 눌러 상세 확인
        </p>

        {/* [후킹] AI 추천 */}
        <div style={{ marginTop: '2rem' }}><AIRecommendHook /></div>

        {/* ③ [D] 첫 방문 가이드 */}
        <div className="narrow" style={{ marginTop: '2rem', padding: '2rem',
          background: bgAccent, borderRadius: '16px', border: `1px solid ${borderAccent}` }}>
          <h2 style={{ color: textAccent }}>{guide.title}</h2>
          <ul className="checklist">
            {guide.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ④ [E] 인기 시간대 */}
        <div className="narrow" style={{ marginTop: '2rem' }}>
          <h2>인기 요일·시간대</h2>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {timeslots.map(t => (
              <div key={t.time} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ minWidth: '110px', fontSize: '0.9rem', fontWeight: 600 }}>{t.time}</span>
                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: t.bar, background: accent, height: '100%', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#666666', minWidth: '40px' }}>{t.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ⑤ [B] VS 대결 (2개 이상일 때만) */}
        {venues.length >= 2 && (
          <div style={{ marginTop: '2rem' }}>
            <VsBattle venues={venues} />
          </div>
        )}

        {/* [후킹] 전체 비교 */}
        <div style={{ marginTop: '2rem' }}><FullCompareHook /></div>

        {/* 슬롯머신 + 출석 + 추천 */}
        <div style={{ marginTop: '2rem' }}><SlotMachine venues={venues.slice(0, 7)} /></div>
        <div style={{ marginTop: '2rem' }}><DailyStreak /></div>
        <div style={{ marginTop: '2rem' }}><EndlessRecommend venues={venues.slice(0, 7)} /></div>
      </div>
    </section>
  );
}
