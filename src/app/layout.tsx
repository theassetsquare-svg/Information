import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import KakaoFloat from '../components/KakaoFloat';
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
      <body>
        <a href="#main" className="sr-only">본문으로 건너뛰기</a>
        <Header />
        <Banner />
        <main id="main">{children}</main>
        <Banner />
        <Footer />
        <KakaoFloat />
      </body>
    </html>
  );
}
