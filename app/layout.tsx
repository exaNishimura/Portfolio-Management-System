import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP, Pacifico, Yellowtail } from 'next/font/google';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Skeleton } from '@/components/ui/skeleton';
import { getProfile } from '@/dal/profiles';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  variable: '--font-noto-sans-jp',
  weight: ['300', '400', '500', '700']
});
const pacifico = Pacifico({ 
  subsets: ['latin'], 
  variable: '--font-pacifico',
  weight: '400'
});
const yellowtail = Yellowtail({ 
  subsets: ['latin'], 
  variable: '--font-yellowtail',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'Portfolio Site - Web Developer',
  description: 'Web開発者のポートフォリオサイト。WordPress、Next.js、Reactを使用した制作実績をご覧いただけます。',
  keywords: 'Web開発, ポートフォリオ, WordPress, Next.js, React, TypeScript',
  authors: [{ name: 'Portfolio Site' }],
  openGraph: {
    title: 'Portfolio Site - Web Developer',
    description: 'Web開発者のポートフォリオサイト',
    type: 'website',
    locale: 'ja_JP',
  },
};

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
  const profile = await getProfile();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} ${pacifico.variable} ${yellowtail.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Suspense>
                {children}
              </Suspense>
            </main>
            <Suspense fallback={<FooterLoading />}>
              <Footer profile={profile} />
            </Suspense>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}