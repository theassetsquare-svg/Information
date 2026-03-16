import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="logo">
          GOLD NIGHT
          <span>Club · Night · Lounge Guide</span>
        </Link>
        <nav>
          <Link href="/clubs/" target="_blank" rel="noopener noreferrer">클럽</Link>
          <Link href="/nights/" target="_blank" rel="noopener noreferrer">나이트</Link>
          <Link href="/lounges/" target="_blank" rel="noopener noreferrer">라운지</Link>
        </nav>
      </div>
    </header>
  );
}
