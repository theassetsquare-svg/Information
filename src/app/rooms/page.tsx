import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('room');
const venues = getVenuesByCategory('room');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/rooms/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/rooms/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/rooms.png', width: 1200, height: 630 }] },
};

export default function RoomsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="문이 닫히면 오롯이 프라이빗한 공간이 된다. 단체 모임, 비즈니스 접대, 가족 행사 등 격식과 프라이버시가 동시에 필요한 자리에 적합하다. 인원수에 맞는 사이즈를 고르는 것이 핵심이다. 일산룸은 수도권 접근성이 뛰어나고 신실장이 총괄한다. 정찰제로 운영되는 곳은 가격이 투명해서 예산 계획이 수월하다. 주말 저녁은 빨리 차니 사전 예약이 필수다."
      guide={{
        title: '처음이세요?',
        items: [
          '전화로 인원수, 예산, 목적을 미리 알리면 맞춤 안내를 받을 수 있다',
          '정찰제인 곳은 가격이 투명하다. 미리 확인하자',
          '주말 저녁은 빨리 찬다. 사전 예약 필수',
          '접대 목적이면 사이즈와 분위기를 미리 확인하고 가는 게 좋다',
          '픽업 서비스가 있는 곳도 있다. 전화로 문의하자',
        ],
      }}
      timeslots={[
        { time: '평일 저녁', level: '여유', bar: '40%' },
        { time: '금요일 19~22시', level: '활발', bar: '85%' },
        { time: '토요일 19~22시', level: '피크', bar: '95%' },
        { time: '일요일', level: '한산', bar: '15%' },
      ]}
      venues={venues}
      catLabel="프라이빗"
      year={new Date().getFullYear()}
    />
  );
}
