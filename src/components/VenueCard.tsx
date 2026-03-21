import { Venue } from '@/lib/venues';

const catWords: Record<string, string[]> = {
  club: ['클럽'], night: ['나이트'], lounge: ['라운지'],
  room: ['룸'], yojeong: ['요정'], hoppa: ['호빠'],
};

const catColors: Record<string, string> = {
  club: '#D4AF37', night: '#B8860B', lounge: '#C5A028',
  room: '#8B7355', yojeong: '#A08C5B', hoppa: '#CD853F',
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
  const bg = catColors[venue.cat_slug] || '#D4AF37';
  const nameParts = venue.name.split(' ');
  const line1 = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : venue.name;
  const line2 = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <a
      href={`/${venue.cat_slug}/${venue.slug}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="venue-card"
      style={{ textDecoration: 'none', color: 'inherit', flexDirection: 'row' }}
    >
      {/* 1:1 썸네일 (카테고리별 색상 + 업소명) */}
      <div style={{
        width: '100px', minWidth: '100px', height: '100px',
        background: bg, borderRadius: '16px 0 0 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0.5rem', overflow: 'hidden',
      }}>
        <span style={{ color: '#0D0D0D', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3, wordBreak: 'keep-all' }}>
          {line1}
        </span>
        {line2 && (
          <span style={{ color: 'rgba(13,13,13,0.85)', fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', marginTop: '2px' }}>
            {line2}
          </span>
        )}
        {venue.nickname && (
          <span style={{ color: 'rgba(13,13,13,0.7)', fontSize: '0.55rem', marginTop: '4px' }}>
            ({venue.nickname})
          </span>
        )}
      </div>

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
          {venue.card_tags.filter(t => !(catWords[venue.cat_slug] || []).some(w => t.includes(w))).slice(0, 3).map(tag => (
            <span key={tag} className="venue-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
}
