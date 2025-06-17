'use client';

import { useState, forwardRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // 最大枚数チェック
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`最大${maxImages}枚まで選択できます`);
      return;
    }

    setUploading(true);

    try {
      // 複数ファイルをまとめて送信
      const formData = new FormData();
      acceptedFiles.forEach(file => {
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
    }
  }, [images, onImagesChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.avif', '.tiff', '.bmp', '.heif', '.heic']
    },
    multiple: true,
    disabled: disabled || uploading || images.length >= maxImages
  });

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
      {/* 画像プレビュー */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
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

      {/* ドラッグ&ドロップエリア */}
      {images.length < maxImages && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4">
                {uploading ? (
                  <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {uploading 
                      ? 'アップロード中...' 
                      : isDragActive 
                        ? 'ファイルをドロップしてください' 
                        : '画像をドラッグ&ドロップ'
                    }
                  </p>
                  {!uploading && (
                    <p className="text-sm text-muted-foreground">
                      または <span className="text-primary font-medium">クリックして選択</span>
                    </p>
                  )}
                </div>

                {!uploading && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>対応形式: JPEG, PNG, GIF, WebP, AVIF, TIFF, BMP, HEIF, HEIC</p>
                    <p>最大ファイルサイズ: 10MB（自動的にAVIFに変換されます）</p>
                    <p>最大{maxImages}枚まで選択可能 (残り{maxImages - images.length}枚)</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {images.length >= maxImages && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              最大枚数({maxImages}枚)に達しました。追加するには既存の画像を削除してください。
            </p>
          </CardContent>
        </Card>
      )}

      {/* 現在の状況表示 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{images.length}/{maxImages}枚選択済み</span>
        {images.length > 0 && (
          <span>ドラッグで並び替え可能</span>
        )}
      </div>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload'; 