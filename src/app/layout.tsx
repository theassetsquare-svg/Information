import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SlideUpHook, ScrollBannerHook } from '../components/HookingCTAs';
import KakaoFloat from '../components/KakaoFloat';
import { JourneyTimer } from '../components/AddictionEngine';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://informationa.pages.dev'),
  icons: { icon: '/favicon.ico' },
  verification: {
    google: 'HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88',
    other: { 'naver-site-verification': '1179edfcfa456f3ab7573e53979cfe0932a148d3' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
          as="style"
        />
      </head>
      <body>
        <a href="#main" className="sr-only">본문으로 건너뛰기</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* [후킹6] 3분 체류 후 슬라이드업 */}
        <SlideUpHook />
        {/* [후킹7] 스크롤 80% 배너 */}
        <ScrollBannerHook />
        {/* 카카오톡 상담 */}
        <KakaoFloat />
        {/* 체류시간 타이머 — 도파민 마일스톤 */}
        <JourneyTimer />
        {/* 폰트 CSS — 렌더링 후 비동기 로드 */}
        <Script id="load-pretendard" strategy="afterInteractive">
          {`var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css';document.head.appendChild(l);`}
        </Script>
      </body>
    </html>
  );
}
