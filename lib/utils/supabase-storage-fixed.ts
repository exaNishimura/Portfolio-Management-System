import { createClient } from '@/utils/supabase/server';
import { convertToAVIF, validateImageFormat, getImageInfo, formatFileSize, calculateCompressionRatio } from './image-converter';

const BUCKET_NAME = 'project-images';

export interface UploadResult {
  url: string;
  path: string;
  originalFormat?: string;
  convertedFormat?: string;
  originalSize?: number;
  convertedSize?: number;
  compressionRatio?: number;
}

export async function uploadImageToSupabaseFixed(
  file: File,
  folder: string = 'projects'
): Promise<UploadResult> {
  const supabase = await createClient();
  
  try {
    // ファイルをBufferに変換（型エラー回避）
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 画像形式を検証
    const { format: originalFormat, isSupported } = await validateImageFormat(buffer);
    
    if (!isSupported) {
      throw new Error(`サポートされていない画像形式です: ${originalFormat}`);
    }

    // 画像情報を取得
    const originalInfo = await getImageInfo(buffer);
    const originalSize = buffer.length;

    let finalBuffer = buffer;
    let finalFormat = originalFormat;
    let convertedSize = originalSize;
    let compressionRatio = 0;

    // AVIF以外の形式の場合、AVIFに変換
    if (originalFormat !== 'avif') {
      try {
        console.log(`画像を${originalFormat}からAVIFに変換中...`);
        const conversionResult = await convertToAVIF(buffer, {
          quality: 80,
          maxWidth: 1920,
          maxHeight: 1080
        });
        
        finalBuffer = conversionResult.buffer;
        finalFormat = 'avif';
        convertedSize = conversionResult.convertedSize;
        compressionRatio = calculateCompressionRatio(originalSize, convertedSize);
        
        console.log(`変換完了: ${formatFileSize(originalSize)} → ${formatFileSize(convertedSize)} (${compressionRatio}% 削減)`);
      } catch (conversionError) {
        console.warn('AVIF変換に失敗、元の形式でアップロード:', conversionError);
        // 変換に失敗した場合は元の画像をそのまま使用
      }
    }

    // ファイル名の生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}.${finalFormat}`;
    const filePath = `${folder}/${fileName}`;

    // ファイルをSupabaseストレージにアップロード
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, finalBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: `image/${finalFormat}`
      });

    if (error) {
      console.error('Supabaseアップロードエラー:', error);
      throw new Error(`ファイルのアップロードに失敗しました: ${error.message}`);
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      originalFormat,
      convertedFormat: finalFormat,
      originalSize,
      convertedSize,
      compressionRatio
    };

  } catch (error) {
    console.error('画像アップロードエラー:', error);
    throw error;
  }
}

export async function uploadMultipleImagesToSupabaseFixed(
  files: File[],
  folder: string = 'projects'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadImageToSupabaseFixed(file, folder));
  return Promise.all(uploadPromises);
}

// 他の関数は元のファイルから継承
export async function deleteImageFromSupabase(filePath: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Supabase削除エラー:', error);
    throw new Error(`ファイルの削除に失敗しました: ${error.message}`);
  }
}

export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === BUCKET_NAME);
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function ensureBucketExists(): Promise<void> {
  const supabase = await createClient();
  
  // バケットの存在確認
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('バケット一覧取得エラー:', listError);
    return;
  }

  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  
  if (!bucketExists) {
    // バケットを作成
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (createError) {
      console.error('バケット作成エラー:', createError);
      throw new Error(`バケットの作成に失敗しました: ${createError.message}`);
    }
    
    console.log(`バケット "${BUCKET_NAME}" を作成しました`);
  }
} 