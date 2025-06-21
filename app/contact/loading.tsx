import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ContactLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* 中央にメインローディングスピナー */}
        <div className="flex items-center justify-center min-h-[40vh] mb-8">
          <LoadingSpinner size="sm" text="お問い合わせフォームを読み込み中..." variant="dots" />
        </div>
        
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-5 w-80 mx-auto mb-2" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>

        {/* コンタクトフォーム */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 名前フィールド */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* メールフィールド */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* 件名フィールド */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* メッセージフィールド */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* 送信ボタン */}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* 連絡先情報 */}
        <div className="mt-12 text-center">
          <Skeleton className="h-6 w-32 mx-auto mb-6" />
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 