export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 50,
    }}>
      <a
        href={`tel:${phone}`}
        aria-label={`${nickname}에게 전화`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: '#D4AF37', color: '#0A0A0A',
          padding: '0.6rem 1.2rem', borderRadius: '50px',
          fontWeight: 700, fontSize: '0.85rem',
          textDecoration: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
        }}
      >
        {nickname} {phone}
      </a>
    </div>
  );
}
