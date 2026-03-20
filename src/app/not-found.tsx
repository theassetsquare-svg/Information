import { getAllVenues, getCategories } from '../lib/venues';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';

export default function NotFound() {
  const allVenues = getAllVenues();
  const cats = getCategories();
  // 닉네임 있는 업소 우선, 없으면 앞에서 5개
  const popular = allVenues.filter(v => v.nickname).slice(0, 5);

  return (
    <>
      <section style={{ padding: '3rem 0 1.5rem', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '4rem', fontWeight: 800, color: '#8B5CF6', marginBottom: '0.5rem' }}>404</p>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>앗, 길을 잃었네!</h1>
          <p style={{ color: '#333', marginBottom: '2rem', fontSize: '1rem' }}>
            주소가 바뀌었거나 잘못 입력했을 수 있다. 대신 지금 핫한 곳을 보여줄게.
          </p>
          <SearchBar venues={allVenues} />
        </div>
      </section>

      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>담당자 직통 연결</h2>
          <div className="venue-grid">
            {popular.map(v => <VenueCard key={v.slug} venue={v} />)}
          </div>
        </div>
      </section>

      <section style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>카테고리별 둘러보기</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {cats.map(cat => (
              <a key={cat.slug} href={cat.path} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', background: '#FFF', border: '1px solid #D1D5DB',
                borderRadius: '16px', padding: '1.25rem', textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.2s',
              }}>
                <h3 style={{ color: '#8B5CF6', marginBottom: '0.25rem' }}>{cat.name} {cat.count}곳</h3>
                <p style={{ fontSize: '0.9rem', color: '#333' }}>전체 보기 →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '1.5rem 0' }}>
        <div className="container narrow" style={{ textAlign: 'center' }}>
          <h2>자주 묻는 질문</h2>
          <div style={{ textAlign: 'left' }}>
            <div className="faq-item">
              <p className="faq-q">Q. 처음인데 어디가 좋을까?</p>
              <p className="faq-a">테이블 문화가 궁금하면 수유·상봉 쪽 나이트. 플로어를 원하면 강남청담 쪽. 조용한 곳이면 압구정 라운지가 좋다.</p>
            </div>
            <div className="faq-item">
              <p className="faq-q">Q. 신분증 없으면 입장 되나?</p>
              <p className="faq-a">안 된다. 주민등록증·운전면허증·여권만 인정. 모바일 신분증은 업소마다 다르니 실물을 챙기자.</p>
            </div>
            <div className="faq-item">
              <p className="faq-q">Q. 혼자 가도 괜찮나?</p>
              <p className="faq-a">물론이다. 바 카운터가 있는 곳이면 어색하지 않다. 혼자 오는 손님이 생각보다 많다.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
