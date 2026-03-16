import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <h1 style={{ color: 'var(--gold)', fontSize: '3rem' }}>404</h1>
        <p style={{ marginBottom: '1.5rem' }}>페이지를 찾을 수 없습니다.</p>
        <Link href="/" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-block',
          background: 'var(--gold)',
          color: '#0a0a0a',
          padding: '0.75rem 2rem',
          borderRadius: '6px',
          fontWeight: 700,
        }}>
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
