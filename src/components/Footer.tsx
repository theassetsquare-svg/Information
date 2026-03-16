import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Link href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</Link>
          <Link href="/nights/" target="_blank" rel="noopener noreferrer">나이트</Link>
          <Link href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</Link>
          <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer">
            오늘밤어디 →
          </a>
        </div>
        <p>© {year} GOLD NIGHT GUIDE. 만 19세 이상 이용 가능.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          본 사이트는 정보 제공 목적이며, 업소와 직접적인 제휴 관계가 없습니다.
        </p>
      </div>
    </footer>
  );
}
