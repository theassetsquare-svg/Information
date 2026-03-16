export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" target="_blank" rel="noopener noreferrer" className="logo" style={{ textDecoration: 'none' }}>
          골드나잇
          <span>Club · Night · Lounge Guide</span>
        </a>
        <nav>
          <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
          <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
          <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
        </nav>
      </div>
    </header>
  );
}
