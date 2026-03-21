'use client';

import { useState } from 'react';

const boards = [
  { id: 'free', name: '자유', icon: '💬' },
  { id: 'review', name: '후기', icon: '⭐' },
  { id: 'party', name: '파티모집', icon: '🎉' },
  { id: 'tips', name: '꿀팁', icon: '💡' },
  { id: 'fashion', name: '패션', icon: '👔' },
  { id: 'qna', name: 'Q&A', icon: '❓' },
];

const samplePosts: Record<string, { title: string; author: string; level: string; likes: number; comments: number; time: string }[]> = {
  free: [
    { title: '금요일 밤 강남 분위기 어떤가요?', author: '밤도둑', level: '클러버', likes: 24, comments: 8, time: '2시간 전' },
    { title: '혼자 나이트 가본 사람 있나요', author: '솔로워커', level: '뉴비', likes: 15, comments: 12, time: '5시간 전' },
    { title: '부산 여행 중인데 밤에 갈 곳 추천', author: '부산댁', level: '파티피플', likes: 31, comments: 6, time: '1일 전' },
  ],
  review: [
    { title: '수원찬스돔나이트 솔직 후기', author: '수원사람', level: '클러버', likes: 42, comments: 15, time: '3시간 전' },
    { title: '강남청담클럽 레이스 금요일 다녀왔습니다', author: '클럽러버', level: 'VIP', likes: 58, comments: 22, time: '1일 전' },
    { title: '일산명월관요정 접대 후기', author: '비즈맨', level: '파티피플', likes: 37, comments: 9, time: '2일 전' },
  ],
  party: [
    { title: '이번주 토요일 강남 같이 갈 분 (3/5명)', author: '파티킹', level: '파티피플', likes: 19, comments: 7, time: '1시간 전' },
    { title: '부산 연산동 N빵 파티 모집', author: '부산보이', level: '클러버', likes: 12, comments: 4, time: '6시간 전' },
  ],
  tips: [
    { title: '나이트 첫방문 필수 체크리스트', author: '나이트마스터', level: '레전드', likes: 89, comments: 31, time: '3일 전' },
    { title: '클럽 드레스코드 완전 정리', author: '패피', level: 'VIP', likes: 67, comments: 18, time: '1주 전' },
  ],
  fashion: [
    { title: '강남 클럽갈 때 이렇게 입어라', author: '스타일러', level: 'VIP', likes: 45, comments: 14, time: '2일 전' },
    { title: '여름 나이트 복장 추천', author: '여름밤', level: '클러버', likes: 28, comments: 7, time: '5일 전' },
  ],
  qna: [
    { title: '나이트 양주 가격 보통 얼마인가요?', author: '궁금이', level: '뉴비', likes: 8, comments: 11, time: '4시간 전' },
    { title: '호빠 처음인데 시스템이 어떻게 되나요?', author: '첫방문녀', level: '뉴비', likes: 14, comments: 9, time: '1일 전' },
  ],
};

const levelColors: Record<string, string> = {
  '뉴비': '#6B7280', '클러버': '#3B82F6', '파티피플': '#8B5CF6', 'VIP': '#F59E0B', '레전드': '#EF4444',
};

export default function CommunityBoard() {
  const [activeBoard, setActiveBoard] = useState('free');
  const [showWrite, setShowWrite] = useState(false);

  const posts = samplePosts[activeBoard] || [];

  return (
    <div>
      {/* 게시판 탭 */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {boards.map(b => (
          <button
            key={b.id}
            onClick={() => setActiveBoard(b.id)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem',
              border: activeBoard === b.id ? '2px solid var(--purple)' : '1px solid var(--border)',
              background: activeBoard === b.id ? 'rgba(139,92,246,0.06)' : 'var(--bg-card)',
              color: activeBoard === b.id ? 'var(--purple)' : 'var(--text-sub)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: activeBoard === b.id ? 700 : 400,
              transition: 'all 0.2s',
            }}
          >
            {b.icon} {b.name}
          </button>
        ))}
      </div>

      {/* 글쓰기 버튼 + 이용규칙 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowWrite(!showWrite)}
          style={{
            background: 'var(--purple)', color: '#FFF', border: 'none',
            padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 700,
            cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
          }}
        >
          글쓰기
        </button>
        <a href="/community/guidelines/" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          이용규칙 →
        </a>
      </div>

      {/* 글쓰기 폼 */}
      {showWrite && (
        <div style={{
          padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: '12px',
          marginBottom: '1.5rem', border: '1px solid var(--border)',
        }}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            style={{
              width: '100%', padding: '0.75rem 1rem', fontSize: '1rem',
              border: '1px solid var(--border)', borderRadius: '8px',
              background: 'var(--bg-card)', color: 'var(--text)', marginBottom: '0.75rem',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <textarea
            placeholder="내용을 입력하세요"
            rows={4}
            style={{
              width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem',
              border: '1px solid var(--border)', borderRadius: '8px',
              background: 'var(--bg-card)', color: 'var(--text)', marginBottom: '0.75rem',
              fontFamily: 'var(--font-sans)', resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{
              background: 'var(--border)', color: 'var(--text-sub)', border: 'none',
              padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
              fontFamily: 'var(--font-sans)',
            }}>
              📷 이미지 첨부
            </button>
            <button style={{
              background: 'var(--purple)', color: '#FFF', border: 'none',
              padding: '0.5rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700,
              fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
            }}>
              등록
            </button>
          </div>
        </div>
      )}

      {/* N빵 계산기 (파티모집 탭) */}
      {activeBoard === 'party' && <NbbangCalc />}

      {/* 게시글 목록 */}
      <div>
        {posts.map((post, i) => (
          <div key={i} style={{
            padding: '1.25rem 0', borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.4rem',
                borderRadius: '4px', color: '#FFF',
                background: levelColors[post.level] || '#6B7280',
              }}>
                {post.level}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>{post.author}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.time}</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text)' }}>{post.title}</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments}</span>
              <span>🔖 저장</span>
              <span>🚨 신고</span>
            </div>
          </div>
        ))}
      </div>

      {/* 더 많은 글 */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          더 많은 글은 로그인 후 확인할 수 있다.
        </p>
        <a href="https://ilsanroom.pages.dev" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-block', marginTop: '1rem',
            background: 'var(--purple)', color: '#FFF',
            padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700,
            textDecoration: 'none', fontSize: '0.95rem',
          }}>
          오늘밤어디에서 전체 커뮤니티 보기 →
        </a>
      </div>
    </div>
  );
}

function NbbangCalc() {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState('');
  const perPerson = total && people && Number(people) > 0 ? Math.ceil(Number(total) / Number(people)) : 0;

  return (
    <div style={{
      padding: '1.25rem', background: 'var(--bg-alt)', borderRadius: '12px',
      marginBottom: '1.5rem', border: '1px solid var(--border)',
    }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>N빵 계산기</h3>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="number"
          placeholder="총 금액 (원)"
          value={total}
          onChange={e => setTotal(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem', border: '1px solid var(--border)',
            borderRadius: '8px', fontSize: '0.9rem', width: '140px',
            background: 'var(--bg-card)', color: 'var(--text)', fontFamily: 'var(--font-sans)',
          }}
        />
        <span style={{ color: 'var(--text-muted)' }}>÷</span>
        <input
          type="number"
          placeholder="인원 수"
          value={people}
          onChange={e => setPeople(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem', border: '1px solid var(--border)',
            borderRadius: '8px', fontSize: '0.9rem', width: '100px',
            background: 'var(--bg-card)', color: 'var(--text)', fontFamily: 'var(--font-sans)',
          }}
        />
        <span style={{ color: 'var(--text-muted)' }}>=</span>
        <span style={{ fontWeight: 700, color: 'var(--purple)', fontSize: '1.1rem' }}>
          {perPerson > 0 ? `${perPerson.toLocaleString()}원` : '—'}
        </span>
      </div>
    </div>
  );
}
