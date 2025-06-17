'use client';

import Link from 'next/link';
import { Github, Mail, ExternalLink, LogIn, Globe, Linkedin, Twitter } from 'lucide-react';
import { Profile } from '@/lib/types/database';
import { useState, useEffect } from 'react';

interface FooterProps {
  profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [slackStatus, setSlackStatus] = useState({
    is_active: profile?.slack_is_active,
    status_text: profile?.slack_status_text,
    status_emoji: profile?.slack_status_emoji,
  });

  // Slackステータスを定期的に更新
  useEffect(() => {
    if (!profile?.slack_user_id) return;

    const updateSlackStatus = async () => {
      try {
        // キャッシュ回避のためにタイムスタンプを追加
        const response = await fetch(`/api/slack/status?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.slack_connected && data.user) {
            setSlackStatus({
              is_active: data.user.is_active,
              status_text: data.user.status_text,
              status_emoji: data.user.status_emoji,
            });
          }
        }
      } catch (error) {
        console.error('Slackステータス更新エラー:', error);
      }
    };

    // 初回実行
    updateSlackStatus();

    // 1分ごとに更新
    const interval = setInterval(updateSlackStatus, 60 * 1000);

    return () => clearInterval(interval);
  }, [profile?.slack_user_id]);

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* サイト情報 */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-2xl md:text-3xl font-yellowtail bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {profile?.name || 'Portfolio Site'}
              </h3>
              {/* Slackアクティブ状態インジケーター */}
              {profile?.slack_user_id && (
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${slackStatus.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {profile.slack_workspace_url ? (
                    <a 
                      href={profile.slack_workspace_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {slackStatus.is_active ? 'オンライン' : '離席中'}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {slackStatus.is_active ? 'オンライン' : '離席中'}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {profile?.title || 'A professional web developer portfolio.'}
            </p>
            {/* Slackステータス詳細表示 */}
            {profile?.slack_user_id && slackStatus.status_text && (
              <div className="flex items-center justify-center gap-2 p-2 bg-white/30 dark:bg-gray-900/30 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  {slackStatus.status_emoji && <span className="text-base">{slackStatus.status_emoji}</span>}
                  <span>{slackStatus.status_text}</span>
                </div>
              </div>
            )}
          </div>

          {/* 連絡先 */}
          <div className="space-y-4 text-center">
            <h3 className="text-base font-semibold">Contact</h3>
            <div className="flex justify-center flex-wrap gap-4">
              {/* メール */}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">{profile.email}</span>
                </a>
              )}

              {/* GitHub */}
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                  <span className="text-sm">GitHub</span>
                </a>
              )}

              {/* LinkedIn */}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}

              {/* Twitter */}
              {profile?.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="text-sm">Twitter</span>
                </a>
              )}

              {/* Website */}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-2"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">Website</span>
                </a>
              )}

              {/* Admin Login */}
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
            © {currentYear} {profile?.name || 'Portfolio Site'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}