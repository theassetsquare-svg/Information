import Link from 'next/link';
import { getAllVenues } from '../lib/venues';
import VenueCard from '../components/VenueCard';

export default function NotFound() {
  const popular = getAllVenues().filter(v =>
    ['sound', 'purple', 'grandprix', 'shampoo', 'intro', 'park-hyatt'].includes(v.slug)
  );

  return (
    <>
      <section className="section" style={{ textAlign: 'center', paddingBottom: '1.5rem' }}>
        <div className="container">
          <h1 style={{ color: 'var(--gold)', fontSize: '3rem' }}>404</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>요청한 페이지가 존재하지 않는다.</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            주소가 바뀌었거나, 잘못 입력했을 수 있다. 아래에서 원하는 곳을 찾아보자.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="/clubs/" target="_blank" rel="noopener noreferrer" style={{
              background: 'var(--gold)', color: '#0a0a0a', padding: '0.75rem 1.5rem',
              borderRadius: '6px', fontWeight: 700, textDecoration: 'none',
            }}>클럽 전체보기</Link>
            <Link href="/nights/" target="_blank" rel="noopener noreferrer" style={{
              background: 'transparent', color: 'var(--gold)', padding: '0.75rem 1.5rem',
              borderRadius: '6px', fontWeight: 700, textDecoration: 'none',
              border: '1px solid var(--gold)',
            }}>나이트 전체보기</Link>
            <Link href="/lounges/" target="_blank" rel="noopener noreferrer" style={{
              background: 'transparent', color: 'var(--gold)', padding: '0.75rem 1.5rem',
              borderRadius: '6px', fontWeight: 700, textDecoration: 'none',
              border: '1px solid var(--gold)',
            }}>라운지 전체보기</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>지금 인기 있는 곳</h2>
          <div className="venue-grid">
            {popular.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <h2>카테고리별 둘러보기</h2>
          <p style={{ marginBottom: '1.5rem' }}>전국 56곳의 업소를 세 가지 유형으로 분류했다.</p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Link href="/clubs/" target="_blank" rel="noopener noreferrer" style={{
              display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '1.5rem', textDecoration: 'none',
            }}>
              <h3 style={{ color: 'var(--gold)' }}>클럽 30곳</h3>
              <p>비트가 몸을 감싸고 조명이 공간을 장악하는 곳. 강남부터 제주까지.</p>
            </Link>
            <Link href="/nights/" target="_blank" rel="noopener noreferrer" style={{
              display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '1.5rem', textDecoration: 'none',
            }}>
              <h3 style={{ color: 'var(--gold)' }}>나이트 15곳</h3>
              <p>격식과 여유가 공존하는 테이블 문화. 수유부터 울산까지.</p>
            </Link>
            <Link href="/lounges/" target="_blank" rel="noopener noreferrer" style={{
              display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '1.5rem', textDecoration: 'none',
            }}>
              <h3 style={{ color: 'var(--gold)' }}>라운지 11곳</h3>
              <p>잔을 기울이며 나누는 대화가 밤의 주인공인 곳. 강남·청담·해운대.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <h2>자주 묻는 질문</h2>
          <div style={{ textAlign: 'left' }}>
            <div className="faq-item">
              <p className="faq-q">Q. 밤문화 초보인데 어디부터 가면 좋을까?</p>
              <p className="faq-a">클럽이 처음이라면 홍대 비원(B1)이나 강남 어게인부터 시작해보자. 나이트는 수유샴푸나이트가 입문으로 좋다. 라운지는 코드라운지나 인트로라운지가 분위기 편하다.</p>
            </div>
            <div className="faq-item">
              <p className="faq-q">Q. 신분증이 없으면 입장 가능한가?</p>
              <p className="faq-a">불가능하다. 주민등록증, 운전면허증, 여권만 인정된다. 모바일 신분증은 업소마다 다르니 실물을 챙기자.</p>
            </div>
            <div className="faq-item">
              <p className="faq-q">Q. 혼자 가도 괜찮은가?</p>
              <p className="faq-a">물론이다. 라운지는 바 카운터 자리가 있고, 나이트는 테이블을 잡으면 된다. 혼자 오는 손님이 생각보다 많다.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
