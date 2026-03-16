import type { Metadata } from 'next';
import { SITE_URL } from '../../../lib/venues';
import { SITE_NAME } from '../../../lib/gold-content';

export const metadata: Metadata = {
  title: `커뮤니티 이용규칙 | ${SITE_NAME}`,
  description: '커뮤니티 이용규칙과 신고 정책 안내.',
  alternates: { canonical: SITE_URL + '/community/guidelines/' },
};

export default function GuidelinesPage() {
  return (
    <section className="section">
      <div className="container narrow">
        <div className="breadcrumb">
          <a href="/" target="_blank" rel="noopener noreferrer">홈</a>
          <span>&rsaquo;</span>
          <a href="/community/" target="_blank" rel="noopener noreferrer">커뮤니티</a>
          <span>&rsaquo;</span> 이용규칙
        </div>
        <h1 style={{ marginTop: '1rem' }}>커뮤니티 이용규칙</h1>

        <div style={{ marginTop: '2rem' }}>
          <h2>기본 원칙</h2>
          <ul className="checklist">
            <li>서로 존중하는 대화. 욕설, 비하, 혐오 표현 금지</li>
            <li>허위 정보 게시 금지. 확인된 사실만 공유하자</li>
            <li>개인정보 노출 금지. 타인의 연락처나 사진 무단 게시 불가</li>
            <li>광고·스팸 금지. 반복 홍보 글은 삭제 대상</li>
            <li>불법 행위 조장 금지. 미성년자 관련 내용 즉시 삭제</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>게시판 종류</h2>
          <table className="info-table">
            <tbody>
              <tr><th>자유</th><td>일상 대화, 잡담, 자유로운 이야기</td></tr>
              <tr><th>후기</th><td>방문 후기. 업소 태그 필수. 솔직하게</td></tr>
              <tr><th>파티모집</th><td>동행 구하기, N빵 파티, 같이 갈 사람 모집</td></tr>
              <tr><th>꿀팁</th><td>방문 팁, 복장 가이드, 예산 정리 등 실용 정보</td></tr>
              <tr><th>패션</th><td>밤문화 패션, 드레스코드 참고, 코디 공유</td></tr>
              <tr><th>Q&amp;A</th><td>궁금한 거 물어보기. 경험자가 답변</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>신고 정책</h2>
          <p>규칙 위반 게시물은 신고 버튼으로 신고할 수 있다. 관리자가 검토 후 삭제 여부를 결정한다.</p>
          <ul className="checklist">
            <li>1차 위반: 경고</li>
            <li>2차 위반: 7일 활동 제한</li>
            <li>3차 위반: 영구 차단</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>레벨 시스템</h2>
          <table className="info-table">
            <tbody>
              <tr><th>뉴비</th><td>가입 직후. 기본 기능 사용 가능</td></tr>
              <tr><th>클러버</th><td>활동 100점 이상. 이미지 첨부 가능</td></tr>
              <tr><th>파티피플</th><td>활동 500점 이상. 파티모집 게시 가능</td></tr>
              <tr><th>VIP</th><td>활동 2000점 이상. 특별 뱃지</td></tr>
              <tr><th>레전드</th><td>활동 5000점 이상. 커뮤니티 명예의 전당</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            포인트: 글 작성 +20, 리뷰 +50, 댓글 +5, 출석 +10
          </p>
        </div>
      </div>
    </section>
  );
}
