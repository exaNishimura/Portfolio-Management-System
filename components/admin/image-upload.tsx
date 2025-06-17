'use client';

import { useState, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  disabled = false 
}, ref) => {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // 最大枚数チェック
    if (images.length + files.length > maxImages) {
      toast.error(`最大${maxImages}枚まで選択できます`);
      return;
    }

    setUploading(true);

    try {
      // 複数ファイルをまとめて送信
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アップロードに失敗しました');
      }

      const data = await response.json();
      const uploadedUrls = data.files || [];
      
      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length}枚の画像をアップロードしました`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('アップロードに失敗しました');
    } finally {
      setUploading(false);
      // ファイル入力をリセット
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleImageDelete = async (index: number) => {
    const imageToRemove = images[index];
    if (!imageToRemove) return;

    if (!confirm('この画像を削除しますか？')) {
      return;
    }

    setDeletingIndex(index);

    try {
      const response = await fetch('/api/admin/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageToRemove }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '削除に失敗しました');
      }

      // 画像リストから削除
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('画像を削除しました');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('削除に失敗しました');
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div ref={ref} className="space-y-4">
      {/* アップロードボタン */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={disabled || uploading || images.length >= maxImages}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              アップロード中...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              画像を選択
            </>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {images.length}/{maxImages}枚選択済み
        </span>
      </div>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* 画像プレビュー */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={`プロジェクト画像 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {!disabled && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleImageDelete(index)}
                        disabled={deletingIndex === index}
                        className="h-8 w-8 p-0"
                      >
                        {deletingIndex === index ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 説明テキスト */}
      <p className="text-sm text-muted-foreground">
        JPEG、PNG、WebP形式の画像ファイルを最大{maxImages}枚まで選択できます。
      </p>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload'; 