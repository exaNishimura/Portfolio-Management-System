'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminDashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーをログに記録
    console.error('管理ダッシュボードエラー:', error);
  }, [error]);

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理ダッシュボード</h1>
        <p className="text-muted-foreground">
          エラーが発生しました
        </p>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">データの読み込みに失敗しました</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                ダッシュボードデータの取得中にエラーが発生しました。
                しばらく時間をおいてから再試行してください。
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left mb-4">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                    エラー詳細（開発環境）
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={reset} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                再試行
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  管理画面トップに戻る
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                問題が続く場合は、システム管理者にお問い合わせください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 