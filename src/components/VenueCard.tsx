import { Venue } from '@/lib/venues';

const catWords: Record<string, string[]> = {
  club: ['클럽'], night: ['나이트'], lounge: ['라운지'],
  room: ['룸'], yojeong: ['요정'], hoppa: ['호빠'],
};

function shouldShowMeta(venue: Venue): string | null {
  const name = venue.name;
  const regionInName = name.includes(venue.region) || name.includes(venue.district);
  const catInName = (catWords[venue.cat_slug] || []).some(w => name.includes(w));
  if (regionInName && catInName) return null;
  if (catInName && !regionInName) return venue.region;
  if (regionInName && !catInName) {
    const labels: Record<string, string> = { club: '클럽', night: '나이트', lounge: '라운지', room: '룸', yojeong: '요정', hoppa: '호빠' };
    return labels[venue.cat_slug] || venue.cat_slug;
  }
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
          <p style={{ fontSize: '0.8rem', color: '#8B5CF6', fontWeight: 600, marginBottom: '0.25rem' }}>
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
