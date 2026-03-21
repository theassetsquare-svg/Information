import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, getAllVenues } from '@/lib/venues';

export const metadata: Metadata = {
  title: `포토 아카이브 — 공간 분위기 미리보기 | ${SITE_NAME}`,
  description: '업장 내부 컷과 외관 사진을 아카이브로 정리. 분위기 파악에 참고하세요.',
  alternates: { canonical: SITE_URL + '/gallery/' },
  openGraph: {
    title: `포토 아카이브 — 공간 분위기 미리보기 | ${SITE_NAME}`,
    description: '업장 내부 컷과 외관 사진을 아카이브로 정리.',
    url: SITE_URL + '/gallery/',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

const CAT_COLORS: Record<string, string> = {
  club: '#D4AF37',
  night: '#D4AF37',
  lounge: '#D4AF37',
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

/* 해시 기반 결정적 셔플로 12개 선택 */
function selectShowcaseVenues(allVenues: ReturnType<typeof getAllVenues>) {
  const seed = 42;
  const indexed = allVenues.map((v, i) => ({
    venue: v,
    score: Math.abs(((seed * 2654435761 + i * 2246822519) | 0)) % 100000,
  }));
  indexed.sort((a, b) => a.score - b.score);
  return indexed.slice(0, 6).map((x) => x.venue);
}

export default function GalleryPage() {
  const allVenues = getAllVenues();
  const venues = selectShowcaseVenues(allVenues);

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
            전국 밤문화 현장의 스냅을 모아둘 예정이다. 현재 수집 중이며, 곧 업데이트된다.
          </p>

          {/* 대표 12곳 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {venues.map((venue) => {
              const height = hashHeight(venue.slug);
              const color = CAT_COLORS[venue.cat_slug] || '#D4AF37';

              return (
                <a
                  key={venue.slug}
                  href={`/${venue.cat_slug}/${venue.slug}/`}
                  style={{
                    display: 'block',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                >
                  {/* 플레이스홀더 영역 */}
                  <div
                    style={{
                      height: `${height}px`,
                      background: `linear-gradient(135deg, ${color}10, ${color}20)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
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
                  </div>

                  {/* 하단 정보: 업소명 + 카테고리 */}
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
                </a>
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
              현장 컷을 공유해주세요
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
              방문 시 촬영한 컷을 커뮤니티에서 공유하면 갤러리에 반영됩니다.
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
              제보는 커뮤니티에서
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
