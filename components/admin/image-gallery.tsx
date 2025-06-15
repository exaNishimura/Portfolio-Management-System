'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trash2, Eye, Download, Calendar, FileImage } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { deleteProfileImage } from '@/lib/upload';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}

interface ImageItem {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  mimetype: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const supabase = createClient();
      
      // ストレージからファイル一覧を取得
      const { data: files, error } = await supabase.storage
        .from('profile-images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('ファイル一覧取得エラー:', error);
        toast.error('画像の読み込みに失敗しました');
        return;
      }

      if (!files || files.length === 0) {
        setImages([]);
        return;
      }

      // 各ファイルの公開URLを取得
      const imageItems: ImageItem[] = files
        .filter(file => file.name && !file.name.includes('.emptyFolderPlaceholder'))
        .map(file => {
          const { data: urlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(file.name);

          return {
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            createdAt: file.created_at,
            mimetype: file.metadata?.mimetype || 'image/jpeg'
          };
        });

      setImages(imageItems);
    } catch (error) {
      console.error('画像読み込みエラー:', error);
      toast.error('画像の読み込み中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageUrl: string, imageName: string) => {
    if (!confirm(`画像「${imageName}」を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    setDeletingImages(prev => new Set(prev).add(imageName));
    
    try {
      const success = await deleteProfileImage(imageUrl);
      
      if (success) {
        setImages(prev => prev.filter(img => img.name !== imageName));
        toast.success('画像を削除しました');
      } else {
        toast.error('画像の削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      toast.error('削除中にエラーが発生しました');
    } finally {
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageName);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">画像を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <FileImage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">画像がありません</h3>
        <p className="text-muted-foreground mb-4">
          まだ画像がアップロードされていません。
        </p>
        <p className="text-sm text-muted-foreground">
          プロフィール管理ページから画像をアップロードしてください。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {images.length}個の画像が見つかりました
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadImages}
          disabled={isLoading}
        >
          更新
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.name} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={image.name}>
                      {image.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(image.size)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {image.mimetype.split('/')[1]?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(image.createdAt)}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(image.url, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    表示
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = image.url;
                      link.download = image.name;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.url, image.name)}
                    disabled={deletingImages.has(image.name)}
                  >
                    {deletingImages.has(image.name) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 