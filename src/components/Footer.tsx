export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* [후킹8] 푸터 직전 대형 CTA */}
      <div className="hooking-large">
        <h3>110곳 실시간 순위+AI추천+리뷰</h3>
        <p>당신의 완벽한 밤을 위한 모든 정보가 한곳에</p>
        <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer">
          ★오늘밤어디★ 바로가기 →
        </a>
      </div>

      {/* 구글·AI 검색 유도 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        padding: '1.25rem 1rem',
        textAlign: 'center',
      }}>
        <p style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
          구글 · ChatGPT · Gemini에서<br />
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>&#39;오늘밤어디&#39;</span>를 검색하세요
        </p>
      </div>

      <footer className="footer">
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#6D28D9', marginBottom: '1rem', letterSpacing: '0.02em' }}>
            광고문의 카톡 besta12
          </p>

          {/* 6종 카테고리 */}
          <div className="footer-links">
            <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
            <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer">룸</a>
            <a href="/yojeongs/" target="_blank" rel="noopener noreferrer">요정</a>
            <a href="/hoppas/" target="_blank" rel="noopener noreferrer">호빠</a>
          </div>

          {/* 지역 링크 (SEO 내부링크) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>강남</a>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>압구정</a>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>홍대</a>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>이태원</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>수유</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>수원</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>부산</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>대전</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>광주</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>울산</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>일산</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>인천</a>
          </div>

          {/* 오늘밤어디 링크 */}
          <p style={{ marginBottom: '0.75rem' }}>
            <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer" style={{ color: '#6D28D9', fontWeight: 600 }}>
              오늘밤어디 →
            </a>
          </p>

          <p style={{ color: '#333' }}>&copy; {year} 오늘밤어디. 만 19세 이상 이용 가능.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            본 사이트는 정보 제공 목적이며 업소와 직접적인 제휴 관계가 없습니다.
          </p>
        </div>
      </footer>
    </>
  );
}
