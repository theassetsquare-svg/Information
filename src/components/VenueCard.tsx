import { Venue } from '@/lib/venues';

/* 가게이름에 이미 포함된 지역/카테고리 단어 → 중복 표시 안 함 */
const catWords: Record<string, string[]> = {
  club: ['클럽'], night: ['나이트'], lounge: ['라운지'],
  room: ['룸'], yojeong: ['요정'], hoppa: ['호빠'],
};

function shouldShowMeta(venue: Venue): string | null {
  const name = venue.name;
  const regionInName = name.includes(venue.region) || name.includes(venue.district);
  const catInName = (catWords[venue.cat_slug] || []).some(w => name.includes(w));

  // 이름에 지역도 카테고리도 있으면 → 메타 표시 안 함
  if (regionInName && catInName) return null;
  // 이름에 카테고리만 있으면 → 지역만 표시
  if (catInName && !regionInName) return venue.region;
  // 이름에 지역만 있으면 → 카테고리만 표시
  if (regionInName && !catInName) {
    const labels: Record<string, string> = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' };
    return labels[venue.cat_slug] || venue.cat_slug;
  }
  // 둘 다 없으면 → 지역+카테고리
  const labels: Record<string, string> = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' };
  return `${venue.region} · ${labels[venue.cat_slug]}`;
}

export default function VenueCard({ venue }: { venue: Venue }) {
  const meta = shouldShowMeta(venue);

  return (
    <a
      href={`/${venue.cat_slug}/${venue.slug}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="venue-card"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="venue-card-body">
        {venue.badge && <span className="venue-card-badge">{venue.badge}</span>}
        {meta && <span className="venue-card-meta">{meta}</span>}
        <h3>{venue.name}</h3>
        {venue.nickname && (
          <p style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, marginBottom: '0.25rem' }}>
            담당: {venue.nickname}
          </p>
        )}
        <p className="venue-card-hook">{venue.card_hook}</p>
        <div className="venue-card-tags">
          {venue.card_tags.slice(0, 3).map(tag => (
            <span key={tag} className="venue-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
}
