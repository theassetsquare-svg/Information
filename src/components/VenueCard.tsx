import { Venue } from '@/lib/venues';

const catWords: Record<string, string[]> = {
  club: ['클럽'], night: ['나이트'], lounge: ['라운지'],
  room: ['룸'], yojeong: ['요정'], hoppa: ['호빠'],
};

const catColors: Record<string, string> = {
  club: '#8B5CF6', night: '#EC4899', lounge: '#06B6D4',
  room: '#3B82F6', yojeong: '#059669', hoppa: '#F43F5E',
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
  const bg = catColors[venue.cat_slug] || '#8B5CF6';
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
        <span style={{ color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3, wordBreak: 'keep-all' as const }}>
          {line1}
        </span>
        {line2 && (
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', marginTop: '2px' }}>
            {line2}
          </span>
        )}
        {venue.nickname && (
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.55rem', marginTop: '4px' }}>
            ({venue.nickname})
          </span>
        )}
      </div>

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
      </div>
    </a>
  );
}
