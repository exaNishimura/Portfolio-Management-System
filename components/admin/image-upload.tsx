'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  className 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`最大${maxImages}枚まで選択できます`);
      return;
    }

    setIsUploading(true);
    try {
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
      const newImages = [...images, ...data.files];
      onImagesChange(newImages);
      toast.success(data.message);
    } catch (error) {
      console.error('アップロードエラー:', error);
      toast.error(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  }, [images, onImagesChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: isUploading || images.length >= maxImages
  });

  const removeImage = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    
    // Supabaseストレージから画像を削除
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
        throw new Error(errorData.error || '画像の削除に失敗しました');
      }

      // 成功した場合、ローカルの状態からも削除
      const newImages = images.filter((_, index) => index !== indexToRemove);
      onImagesChange(newImages);
      toast.success('画像を削除しました');
    } catch (error) {
      console.error('画像削除エラー:', error);
      toast.error(error instanceof Error ? error.message : '画像の削除に失敗しました');
    }
  };

  return (
    <div className={className}>
      {/* アップロード済み画像の表示 */}
      {images.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              アップロード済み画像 ({images.length}/{maxImages})
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <Image
                      src={imageUrl}
                      alt={`アップロード画像 ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {index + 1}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
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
                ${isUploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4">
                {isUploading ? (
                  <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isUploading 
                      ? 'アップロード中...' 
                      : isDragActive 
                        ? 'ファイルをドロップしてください' 
                        : '画像をドラッグ&ドロップ'
                    }
                  </p>
                  {!isUploading && (
                    <p className="text-sm text-muted-foreground">
                      または <span className="text-primary font-medium">クリックして選択</span>
                    </p>
                  )}
                </div>

                {!isUploading && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>対応形式: JPEG, PNG, GIF, WebP</p>
                    <p>最大ファイルサイズ: 5MB</p>
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
    </div>
  );
} 