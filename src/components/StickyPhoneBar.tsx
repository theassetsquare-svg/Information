export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      padding: '0.5rem 1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{ color: '#FFF', minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
          담당: {nickname}
        </div>
      </div>
      <a
        href={`tel:${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${nickname}에게 전화`}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: '#10B981', color: '#FFF',
          padding: '0.6rem 1.25rem', borderRadius: '8px',
          fontWeight: 700, fontSize: '0.9rem',
          textDecoration: 'none', whiteSpace: 'nowrap',
          minHeight: '44px',
        }}
      >
        <span>📞</span> 전화하기
      </a>
    </div>
  );
}
