import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('hoppa');
const venues = getVenuesByCategory('hoppa');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/hoppas/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/hoppas/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/hoppas.png', width: 1200, height: 630 }] },
};

export default function HoppasPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="여성 고객을 위한 프리미엄 엔터테인먼트 공간이다. 호스트가 테이블에서 대화와 서비스를 제공한다. 시스템을 미리 이해하고 가면 첫 방문도 편안하다. 강남, 부산, 장안동, 건대 등 주요 상권에 위치한 곳을 정리했다. 가격은 매장마다 다르니 방문 전 전화로 확인하는 것을 추천한다. 예산을 미리 정해두면 부담 없이 즐길 수 있다. 2차 강요는 없다. 본인이 원하는 만큼만 즐기면 된다."
      guide={{
        title: '처음이세요? 걱정 마세요',
        items: [
          '입장하면 매니저가 시스템을 설명해준다. 모르는 건 바로 물어보자',
          '호스트 지명은 선택사항. 마음에 안 들면 교체 가능',
          '복장: 평소처럼 편하게. 드레스코드 없는 곳이 대부분',
          '예산: 미리 정해두면 부담 없음. 전화로 시스템과 가격을 먼저 확인',
          '안전: 대부분 CCTV와 보안 인력이 상주한다',
          '2차 강요 없음. 본인이 원하는 만큼만 즐기면 된다',
          '친구랑 가도 좋고, 혼자 가도 괜찮다',
        ],
      }}
      timeslots={[
        { time: '금요일 21~23시', level: '활발', bar: '80%' },
        { time: '금요일 23~01시', level: '피크', bar: '95%' },
        { time: '토요일 22~01시', level: '붐빔', bar: '85%' },
        { time: '평일 저녁', level: '여유', bar: '35%' },
      ]}
      venues={venues}
      catLabel="여성 프리미엄"
      year={new Date().getFullYear()}
      isHoppa={true}
    />
  );
}
