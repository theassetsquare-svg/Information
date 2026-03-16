import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, getAllVenues } from '@/lib/venues';

export const metadata: Metadata = {
  title: `갤러리 — 전국 밤문화 현장 스냅 | ${SITE_NAME}`,
  description: '전국 클럽·나이트·라운지·룸·요정·호빠의 현장 분위기를 사진으로 만나보자.',
  alternates: { canonical: SITE_URL + '/gallery/' },
  openGraph: {
    title: `갤러리 — 전국 밤문화 현장 스냅 | ${SITE_NAME}`,
    description: '전국 클럽·나이트·라운지·룸·요정·호빠의 현장 분위기를 사진으로 만나보자.',
    url: SITE_URL + '/gallery/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

const CAT_COLORS: Record<string, string> = {
  club: '#8B5CF6',
  night: '#EC4899',
  lounge: '#06B6D4',
  room: '#F59E0B',
  yojeong: '#EF4444',
  hoppa: '#F472B6',
};

const CAT_LABELS: Record<string, string> = {
  club: '클럽',
  night: '나이트',
  lounge: '라운지',
  room: '룸',
  yojeong: '요정',
  hoppa: '호빠',
};

/* 해시 기반으로 높이를 결정하여 masonry 효과 */
function hashHeight(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  }
  const heights = [220, 260, 300, 240, 280];
  return heights[Math.abs(h) % heights.length];
}

export default function GalleryPage() {
  const venues = getAllVenues();

  return (
    <>
      <section style={{ padding: '1rem 0 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
            <span>&rsaquo;</span> 갤러리
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem' }}>갤러리</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', maxWidth: '600px' }}>
            전국 밤문화 현장의 분위기를 사진으로 담을 예정이다. 현재 사진을 수집 중이며, 곧 업데이트된다.
          </p>

          {/* Masonry 그리드 */}
          <div
            style={{
              columns: '3 280px',
              columnGap: '1rem',
            }}
          >
            {venues.map((venue) => {
              const height = hashHeight(venue.slug);
              const color = CAT_COLORS[venue.cat_slug] || '#8B5CF6';

              return (
                <div
                  key={venue.slug}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                >
                  {/* 플레이스홀더 이미지 영역 */}
                  <div
                    style={{
                      height: `${height}px`,
                      background: `linear-gradient(135deg, ${color}10, ${color}20)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `${color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: color,
                      }}
                    >
                      &#9935;
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      분위기 사진 준비 중
                    </span>
                  </div>

                  {/* 하단 정보 */}
                  <div style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {CAT_LABELS[venue.cat_slug] || venue.cat_slug}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                      {venue.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {venue.region} {venue.district}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 사진 제보 안내 */}
          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
              현장 사진을 공유해주세요
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
              방문 사진이나 분위기 스냅을 커뮤니티에서 공유하면 갤러리에 반영됩니다.
            </p>
            <a
              href="/community/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'var(--purple)',
                color: '#FFF',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              사진 제보는 커뮤니티에서
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
