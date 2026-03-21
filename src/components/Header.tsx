export default function Header() {
  return (
    <>
      {/* [후킹1] 상단 고정 배너 */}
      <div className="top-banner">
        <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer">
          프리미엄 정보+실시간 예약은 ★오늘밤어디★에서 →
        </a>
      </div>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo" style={{ textDecoration: 'none' }}>
            오늘밤어디
            <span>밤의 격이 다른 선택</span>
          </a>
          <nav>
            <a href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</a>
            <a href="/nights/" target="_blank" rel="noopener noreferrer">나이트</a>
            <a href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</a>
            <a href="/rooms/" target="_blank" rel="noopener noreferrer">룸</a>
            <a href="/yojeongs/" target="_blank" rel="noopener noreferrer">요정</a>
            <a href="/hoppas/" target="_blank" rel="noopener noreferrer">호빠</a>
          </nav>
        </div>
      </header>
    </>
  );
}
