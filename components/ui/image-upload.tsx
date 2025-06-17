'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { uploadProfileImage, deleteProfileImage, testStoragePermissions } from '@/lib/upload';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  onDeleteSuccess?: () => void;
  updateDatabase?: boolean;
}

export function ImageUpload({ value, onChange, disabled, className, onDeleteSuccess, updateDatabase }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value.trim() !== '') {
      setImageError(false);
    }
  }, [value]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      testStoragePermissions();
    }
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImageError(false);
    
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!value) {
      return;
    }
    
    if (!confirm('画像を削除しますか？この操作は取り消せません。')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const success = await deleteProfileImage(value);
      
      if (success) {
        clearImageCache(value);
        
        onChange(undefined);
        onChange('');
        onChange(undefined);
        
        if (updateDatabase) {
          const dbUpdateSuccess = await updateProfileInDatabase();
          if (!dbUpdateSuccess) {
            console.warn('Database update failed, but storage deletion was successful');
          }
        }
        
        toast.success('画像を削除しました');
        setImageError(false);
        
        if (onDeleteSuccess) {
          setTimeout(() => {
            onDeleteSuccess();
          }, 100);
        }
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

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const hasValidImageUrl = value && value.trim() !== '';

  const clearImageCache = (imageUrl: string) => {
    try {
      if (typeof window !== 'undefined') {
        const img = document.createElement('img');
        img.src = imageUrl + '?cache-bust=' + Date.now();
        
        if ('serviceWorker' in navigator && 'caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.open(cacheName).then(cache => {
                cache.delete(imageUrl);
              });
            });
          });
        }
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  };

  const updateProfileInDatabase = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_url: null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Database update failed:', errorData);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Database update error:', error);
      return false;
    }
  };

  return (
    <div className={className}>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileSelect} className="hidden" disabled={disabled || isUploading} />

      {hasValidImageUrl ? (
        <div className="space-y-4">
          <Card className="relative w-48 h-48 mx-auto group">
            <CardContent className="p-0 h-full">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted">
                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <p className="text-xs text-destructive">読み込み失敗</p>
                      <Button variant="outline" size="sm" onClick={handleUploadClick} className="mt-2">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        再選択
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Image src={value} alt="プロフィール画像" fill className="object-cover" sizes="192px" onError={handleImageError} onLoad={handleImageLoad} priority />
                )}

                {!disabled && !imageError && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     <Button type="button" variant="secondary" size="sm" onClick={handleUploadClick} disabled={isUploading || isDeleting} className="h-8 w-8 p-0 bg-background/90 hover:bg-background border shadow-lg" title="画像を差し替え">
                       {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                     </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting || isUploading} className="h-8 w-8 p-0 shadow-lg" title="画像を削除">
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              {imageError ? "画像読み込みエラー" : "アップロード済み画像"}：
              {value.split("/").pop()}
            </p>
          </div>
        </div>
      ) : (
        <Card className="w-48 h-48 mx-auto border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-0 h-full">
            <Button type="button" variant="ghost" onClick={handleUploadClick} disabled={disabled || isUploading} className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
              {isUploading ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin" />
                  <span className="text-sm">アップロード中...</span>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12" />
                  <span className="text-sm">画像を選択</span>
                  <span className="text-xs text-muted-foreground">クリックしてファイルを選択</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 