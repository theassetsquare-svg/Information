export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* [후킹8] 푸터 직전 대형 CTA */}
      <div className="hooking-large">
        <h3>103개 업소 실시간 순위+AI추천+리뷰</h3>
        <p>당신의 완벽한 밤을 위한 모든 정보가 한곳에</p>
        <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer">
          오늘밤어디 바로가기 →
        </a>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
            <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer">룸</a>
            <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37' }}>
              오늘밤어디 →
            </a>
          </div>
          <p style={{ color: '#D4C5A9' }}>&copy; {year} 골드나잇 가이드. 만 19세 이상 이용 가능.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#A89B80' }}>
            본 사이트는 정보 제공 목적이며 업소와 직접적인 제휴 관계가 없습니다.
          </p>
        </div>
      </footer>
    </>
  );
}
