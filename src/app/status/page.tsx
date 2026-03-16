import type { Metadata } from 'next';
import { getAllVenues, SITE_URL } from '../../lib/venues';
import { SITE_NAME } from '../../lib/gold-content';

export const metadata: Metadata = {
  title: `사이트 상태 | ${SITE_NAME}`,
  description: '골드나잇 가이드 서비스 상태 확인.',
  alternates: { canonical: SITE_URL + '/status/' },
};

export default function StatusPage() {
  const venues = getAllVenues();
  const year = new Date().getFullYear();
  const cats: Record<string, number> = {};
  venues.forEach(v => { cats[v.cat_slug] = (cats[v.cat_slug] || 0) + 1; });

  return (
    <section className="section">
      <div className="container narrow">
        <h1>사이트 상태</h1>
        <p style={{ color: 'var(--text-sub)', marginBottom: '2rem' }}>
          {SITE_NAME} 서비스 현황을 확인합니다.
        </p>

        <div style={{ padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>서비스 상태</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontWeight: 600 }}>정상 운영 중</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {year}년 기준 모든 서비스가 정상 운영되고 있습니다.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>데이터 현황</h2>
          <table className="info-table">
            <tbody>
              <tr><th>총 업소 수</th><td>{venues.length}곳</td></tr>
              <tr><th>클럽</th><td>{cats.club || 0}곳</td></tr>
              <tr><th>나이트</th><td>{cats.night || 0}곳</td></tr>
              <tr><th>라운지</th><td>{cats.lounge || 0}곳</td></tr>
              <tr><th>룸</th><td>{cats.room || 0}곳</td></tr>
              <tr><th>요정</th><td>{cats.yojeong || 0}곳</td></tr>
              <tr><th>호빠</th><td>{cats.hoppa || 0}곳</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>설정 안내</h2>
          <ul className="checklist">
            <li>Google Search Console: 등록 후 사이트맵 제출</li>
            <li>네이버 서치어드바이저: 등록 후 사이트맵 제출</li>
            <li>Bing 웹마스터 도구: 등록 후 사이트맵 제출 (ChatGPT 검색 노출)</li>
            <li>Google Analytics 4: 추적 코드 설정</li>
            <li>Microsoft Clarity: 히트맵 분석 설정</li>
            <li>UptimeRobot: 5분마다 다운 체크 설정</li>
            <li>Supabase 백업: 주 1회 자동 백업</li>
            <li>커스텀 도메인: Cloudflare Pages 설정에서 연결</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
