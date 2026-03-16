export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
          <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
          <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
          <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer">오늘밤어디 →</a>
        </div>
        <p style={{ color: '#333' }}>&copy; {year} 골드나잇 가이드. 만 19세 이상 이용 가능.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#555' }}>
          본 사이트는 정보 제공 목적이며 업소와 직접적인 제휴 관계가 없습니다.
        </p>
      </div>
    </footer>
  );
}
