import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP, Pacifico } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} ${pacifico.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}