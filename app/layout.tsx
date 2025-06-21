import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP, Pacifico, Yellowtail } from 'next/font/google';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PerformanceOptimizations } from '@/components/performance-optimizations';
import { getProfile } from '@/dal/profiles';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true
});
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  variable: '--font-noto-sans-jp',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  preload: true
});
const pacifico = Pacifico({ 
  subsets: ['latin'], 
  variable: '--font-pacifico',
  weight: '400',
  display: 'swap'
});
const yellowtail = Yellowtail({ 
  subsets: ['latin'], 
  variable: '--font-yellowtail',
  weight: '400',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Portfolio Site - Web Developer',
    template: '%s | Portfolio Site'
  },
  description: 'Web開発者のポートフォリオサイト。WordPress、Next.js、Reactを使用した制作実績をご覧いただけます。',
  keywords: ['Web開発', 'ポートフォリオ', 'WordPress', 'Next.js', 'React', 'TypeScript', 'フロントエンド開発'],
  authors: [{ name: 'Portfolio Site', url: 'https://portfolio.exa-sol.co.jp' }],
  creator: 'Portfolio Site',
  publisher: 'Portfolio Site',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://portfolio.exa-sol.co.jp',
    siteName: 'Portfolio Site',
    title: 'Portfolio Site - Web Developer',
    description: 'Web開発者のポートフォリオサイト。WordPress、Next.js、Reactを使用した制作実績をご覧いただけます。',
    images: [
      {
        url: '/placeholder-avatar.webp',
        width: 1200,
        height: 630,
        alt: 'Portfolio Site',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Site - Web Developer',
    description: 'Web開発者のポートフォリオサイト。WordPress、Next.js、Reactを使用した制作実績をご覧いただけます。',
    images: ['/placeholder-avatar.webp'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://portfolio.exa-sol.co.jp',
  },
  other: {
    'theme-color': '#ffffff',
    'color-scheme': 'light dark',
  },
};

// ヘッダー用のローディングコンポーネント
function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Skeleton className="h-6 w-32" />
      </div>
    </header>
  );
}

// フッター用のローディングコンポーネント
function FooterLoading() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // プロファイル取得（エラー時はnullを返す）
  let profile = null;
  try {
    profile = await getProfile();
  } catch (error) {
    // 認証エラーや接続エラーの場合は無視してnullのまま続行
    console.warn('Profile fetch failed in layout:', error);
  }

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Critical CSS プリロード */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS Prefetch for critical domains */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Theme color for PWA */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable} ${pacifico.variable} ${yellowtail.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<HeaderFallback />}>
              <Header />
            </Suspense>
            <main className="flex-1">
              <Suspense fallback={
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                  <LoadingSpinner size="sm" text="読み込み中..." variant="dots" />
                </div>
              }>
                {children}
              </Suspense>
            </main>
            <Suspense fallback={<FooterLoading />}>
              <Footer profile={profile} />
            </Suspense>
          </div>
          <Toaster />
          <PerformanceOptimizations />
        </ThemeProvider>
      </body>
    </html>
  );
}