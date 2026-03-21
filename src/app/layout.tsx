import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SlideUpHook, ScrollBannerHook } from '../components/HookingCTAs';
import { JourneyTimer, SocialProofToast, RetentionRewards } from '../components/AddictionEngine';
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* Pretendard 비동기 로드 — 렌더링 차단 제거 (FCP 3.9s → ~1s 개선) */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          media="print"
          // @ts-expect-error onLoad for async CSS
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          />
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <a href="#main" className="sr-only">본문으로 건너뛰기</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SlideUpHook />
        <ScrollBannerHook />
        <JourneyTimer />
        <SocialProofToast />
        <RetentionRewards />
      </body>
    </html>
  );
}
