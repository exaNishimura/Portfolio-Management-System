'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Github } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Googleログイン
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) {
        setError('Googleログインに失敗しました。');
      }
    } catch (err) {
      setError('Googleログインに失敗しました。');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // GitHubログイン
  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) {
        setError('GitHubログインに失敗しました。');
      }
    } catch (err) {
      setError('GitHubログインに失敗しました。');
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">管理者ログイン</CardTitle>
            <CardDescription>
              ポートフォリオサイトの管理画面にアクセスします
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* ソーシャルログイン */}
            <div className="space-y-3">
              {/* Googleログイン */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isGithubLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Googleでログイン中...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Googleでログイン
                  </>
                )}
              </Button>

              {/* GitHubログイン */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGithubLogin}
                disabled={isGoogleLoading || isGithubLoading}
              >
                {isGithubLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    GitHubでログイン中...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    GitHubでログイン
                  </>
                )}
              </Button>
            </div>

            {/* フッターリンク */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <Link href="/" className="text-primary hover:underline">
                  ← サイトに戻る
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 開発用情報 */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-4 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">開発用情報</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>ソーシャルログインのみ利用可能:</p>
              <p>• Google アカウント</p>
              <p>• GitHub アカウント</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 