export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px', zIndex: 50,
      background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      padding: '0.75rem 1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          담당: {nickname}
        </p>
      </div>
      <a
        href={`tel:${phone}`}
        aria-label={`${nickname}에게 전화`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: '#10B981', color: '#FFF',
          padding: '0.6rem 1.2rem', borderRadius: '50px',
          fontWeight: 700, fontSize: '0.85rem',
          textDecoration: 'none', whiteSpace: 'nowrap',
          minHeight: '44px', minWidth: '44px',
        }}
      >
        {phone}
      </a>
    </div>
  );
}
