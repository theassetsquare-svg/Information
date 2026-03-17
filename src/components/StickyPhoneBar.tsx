export default function StickyPhoneBar({ name, nickname, phone }: { name: string; nickname: string; phone: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      padding: '0.5rem 1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0.75rem',
    }}>
      <a
        href={`tel:${phone}`}
        aria-label={`${nickname}에게 전화`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          background: '#10B981', color: '#FFF',
          padding: '0.75rem 1.5rem', borderRadius: '50px',
          fontWeight: 700, fontSize: '0.9rem',
          textDecoration: 'none', whiteSpace: 'nowrap',
          minHeight: '44px',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
          maxWidth: '280px',
          width: '100%',
        }}
      >
        📞 {nickname} 전화하기
      </a>
    </div>
  );
}
