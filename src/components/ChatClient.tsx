'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const initialMessages: Message[] = [
  {
    role: 'bot',
    text: '안녕하세요! 오늘밤어디 가이드 AI 상담입니다. 오늘밤 어디로 갈지 고민이신가요?',
  },
  {
    role: 'bot',
    text: 'AI 상담 서비스는 곧 오픈 예정입니다. 조금만 기다려 주세요!',
  },
];

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'bot', text: 'AI 상담 서비스는 현재 준비 중입니다. 곧 오픈 예정이니 조금만 기다려 주세요! 그동안 아래 서비스를 이용해 보세요.' },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '20px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      height: '480px',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-alt)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--purple)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontWeight: 700, fontSize: '0.85rem',
          }}>
            AI
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>오늘밤어디 AI</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>준비 중</p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '75%', padding: '0.75rem 1rem',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--purple)' : 'var(--bg-alt)',
              color: msg.role === 'user' ? '#FFF' : 'var(--text)',
              fontSize: '0.9rem', lineHeight: 1.6,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div style={{
        padding: '1rem 1.5rem', borderTop: '1px solid var(--border)',
        background: 'var(--bg-alt)',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            style={{
              flex: 1, padding: '0.75rem 1rem',
              border: '1px solid var(--border)', borderRadius: '12px',
              fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
              background: 'var(--bg-card)', color: 'var(--text)',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '0.75rem 1.25rem', background: 'var(--purple)',
              color: '#FFF', border: 'none', borderRadius: '12px',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem', whiteSpace: 'nowrap',
            }}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
