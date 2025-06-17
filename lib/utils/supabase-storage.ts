import { createClient } from '@/utils/supabase/client';
import { convertToAVIF } from './image-converter';

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

// ファイルサイズをフォーマットする関数
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 圧縮率を計算する関数
function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

export async function uploadImageToSupabase(
  file: File,
  folder: string = 'projects'
): Promise<UploadResult> {
  const supabase = createClient();
  await ensureBucketExists();

  // ファイル情報を取得
  const originalFormat = file.type.split('/')[1];
  const originalSize = file.size;
  
  // ファイルをBufferに変換
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  let finalBuffer = buffer;
  let finalFormat = originalFormat;
  let convertedSize = originalSize;
  let compressionRatio = 0;

  // AVIF以外の形式の場合、AVIFに変換
  if (originalFormat !== 'avif') {
    try {
      const conversionResult = await convertToAVIF(buffer, {
        quality: 80,
        maxWidth: 1920,
        maxHeight: 1080
      });
      
      finalBuffer = Buffer.from(conversionResult.buffer);
      finalFormat = 'avif';
      convertedSize = conversionResult.convertedSize;
      compressionRatio = calculateCompressionRatio(originalSize, convertedSize);
    } catch (conversionError) {
      console.warn('AVIF変換に失敗、元の形式でアップロード:', conversionError);
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
}

export async function deleteImageFromSupabase(filePath: string): Promise<void> {
  try {
    const supabase = createClient();
    
    // ファイルパスを正規化
    let fileName = filePath;
    
    if (fileName.startsWith('/')) {
      fileName = fileName.substring(1);
    }
    
    if (!fileName || fileName.trim() === '') {
      throw new Error('ファイル名が無効です');
    }
    
    // 最初の削除試行
    const { error } = await supabase.storage
      .from('project-images')
      .remove([fileName]);

    if (error) {
      console.error('Supabase delete error:', error);
      
      // 代替方法：パスを明示的に指定して再試行
      const { error: altError } = await supabase.storage
        .from('project-images')
        .remove([`/${fileName}`]);
      
      if (altError) {
        console.error('Alternative delete also failed:', altError);
        
        // さらなる代替方法：ファイル存在確認後削除
        const { data: fileList, error: listError } = await supabase.storage
          .from('project-images')
          .list('', { search: fileName });
        
        if (listError) {
          console.error('File list error:', listError);
          throw new Error(`ファイル一覧取得エラー: ${listError.message}`);
        }
        
        const fileExists = fileList?.some((file: any) => file.name === fileName);
        
        if (!fileExists) {
          return; // 成功として扱う
        }
        
        throw new Error(`ファイルの削除に失敗しました: ${altError.message}`);
      }
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

export async function uploadMultipleImagesToSupabase(
  files: File[],
  folder: string = 'projects'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadImageToSupabase(file, folder));
  return Promise.all(uploadPromises);
}

// URLからファイルパスを抽出する関数
export function extractFilePathFromUrl(url: string): string | null {
  try {
    let fileName: string;
    
    if (url.includes('/storage/v1/object/public/project-images/')) {
      // Supabase公開URLの場合
      const urlParts = url.split('/storage/v1/object/public/project-images/');
      fileName = urlParts[1];
      
      // クエリパラメータを除去
      if (fileName.includes('?')) {
        fileName = fileName.split('?')[0];
      }
    } else {
      // フォールバック：最後のスラッシュ以降をファイル名とする
      const urlParts = url.split('/');
      fileName = urlParts[urlParts.length - 1];
      
      // クエリパラメータを除去
      if (fileName.includes('?')) {
        fileName = fileName.split('?')[0];
      }
    }
    
    if (!fileName || fileName.trim() === '') {
      console.error('Failed to extract filename from URL:', url);
      return null;
    }
    
    return fileName;
  } catch (error) {
    console.error('Error extracting file path:', error);
    return null;
  }
}

// バケットが存在するかチェックし、なければ作成する関数
export async function ensureBucketExists(): Promise<void> {
  const supabase = createClient();
  
  // バケットの存在確認
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('バケット一覧取得エラー:', listError);
    return;
  }

  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  
  if (bucketExists) {
    return;
  }

  // バケットが存在しない場合は作成
  const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
    fileSizeLimit: 10485760, // 10MB
  });

  if (createError) {
    console.warn(`バケットの作成に失敗しましたが、既存バケットの使用を試行します: ${createError.message}`);
  }
} 