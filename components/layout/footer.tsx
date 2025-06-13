"use client";

import Link from 'next/link';
import { Github, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左側: サイト情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Portfolio Site</h3>
            <p className="text-sm text-muted-foreground">
              Web開発者のポートフォリオサイトです。<br />
              これまでの制作実績をご覧いただけます。
            </p>
          </div>

          {/* 中央: ナビゲーション */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ナビゲーション</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                ホーム
              </Link>
              <Link 
                href="/projects" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                プロジェクト
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                お問い合わせ
              </Link>
            </nav>
          </div>

          {/* 右側: 連絡先 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">連絡先</h3>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="メール"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="外部リンク"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* 下部: コピーライト */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Portfolio Site. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}