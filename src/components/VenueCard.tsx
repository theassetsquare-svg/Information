import { Venue } from '@/lib/venues';

const catLabels: Record<string, string> = {
  club: 'Club', night: 'Night', lounge: 'Lounge',
  room: 'Room', yojeong: 'Yojeong', hoppa: 'Hoppa',
};

export default function VenueCard({ venue }: { venue: Venue }) {
  const hook = venue.card_hook;

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
        <span className="venue-card-meta">{catLabels[venue.cat_slug] || venue.cat_slug}</span>
        <h3>{venue.name}</h3>
        <p className="venue-card-hook">{hook}</p>
        <div className="venue-card-tags">
          {venue.card_tags.slice(0, 3).map(tag => (
            <span key={tag} className="venue-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
}
