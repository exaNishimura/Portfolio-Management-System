import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ナビゲーション */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            実績一覧に戻る
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* プロジェクト画像 */}
            <Card className="overflow-hidden">
              <Skeleton className="w-full h-96 lg:h-[500px]" />
            </Card>

            {/* プロジェクト詳細 */}
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-2/3 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-40 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-10 flex-1 min-w-[200px]" />
                  <Skeleton className="h-10 flex-1 min-w-[200px]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 技術スタック */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* プロジェクト情報 */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>

            {/* 関連プロジェクト */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 