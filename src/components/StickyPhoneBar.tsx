export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      padding: '0.4rem 0.75rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
      maxWidth: '100vw',
      height: '48px',
    }}>
      <div style={{ color: '#FFF', minWidth: 0, flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {nickname}
        </div>
      </div>
      <a
        href={`tel:${phone}`}
        aria-label={`${nickname}에게 전화`}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          background: '#10B981', color: '#FFF',
          padding: '0.4rem 0.75rem', borderRadius: '6px',
          fontWeight: 700, fontSize: '0.8rem',
          textDecoration: 'none', whiteSpace: 'nowrap',
          minHeight: '36px',
        }}
      >
        📞 전화
      </a>
    </div>
  );
}
