import Link from 'next/link';
import { Github, Mail, ExternalLink, LogIn } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* サイト情報 */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Portfolio Site</h3>
            <p className="text-sm text-muted-foreground">
              A professional web developer portfolio.
            </p>
          </div>

          {/* 連絡先 */}
          <div className="space-y-4 text-center">
            <h3 className="text-base font-semibold">Contact</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto:exasolcojp@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">exasolcojp@gmail.com</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm">GitHub</span>
              </a>
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                aria-label="Admin Login"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-sm">Admin Login</span>
              </Link>
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