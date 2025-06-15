import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, Trash2, Eye } from 'lucide-react';
import ImageGallery from '@/components/admin/image-gallery';

export const dynamic = 'force-dynamic';

export default function ImageManagePage() {
  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">画像管理</h1>
        <p className="text-muted-foreground">
          アップロードした画像の管理と削除を行えます。
        </p>
      </div>

      <div className="space-y-6">
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground">総画像数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Upload className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground">今月のアップロード</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground">使用容量 (MB)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 画像ギャラリー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              アップロード済み画像
            </CardTitle>
            <CardDescription>
              Supabaseストレージにアップロードされた画像の一覧です。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">画像を読み込み中...</p>
                </div>
              </div>
            }>
              <ImageGallery />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 