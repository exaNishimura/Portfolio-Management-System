'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadProfileImage, deleteProfileImage } from '@/lib/upload';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const result = await uploadProfileImage(file);
      
      if (result.success && result.url) {
        onChange(result.url);
        toast.success('画像をアップロードしました');
      } else {
        toast.error(result.error || 'アップロードに失敗しました');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('アップロード中にエラーが発生しました');
    } finally {
      setIsUploading(false);
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    setIsDeleting(true);
    
    try {
      const success = await deleteProfileImage(value);
      
      if (success) {
        onChange(undefined);
        toast.success('画像を削除しました');
      } else {
        toast.error('画像の削除に失敗しました');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('削除中にエラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      {value ? (
        <Card className="relative w-32 h-32 mx-auto">
          <CardContent className="p-0">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={value}
                alt="プロフィール画像"
                fill
                className="object-cover"
                sizes="128px"
              />
              {!disabled && (
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-6 w-6 p-0"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-32 h-32 mx-auto border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-0 h-full">
            <Button
              type="button"
              variant="ghost"
              onClick={handleUploadClick}
              disabled={disabled || isUploading}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-xs">アップロード中...</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span className="text-xs">画像を選択</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-2 text-center">
        <p className="text-xs text-muted-foreground">
          JPEG、PNG、WebP形式（最大5MB）
        </p>
      </div>
    </div>
  );
} 