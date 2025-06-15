import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from './supabase-admin';
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

export async function uploadImageToSupabase(
  file: File,
  folder: string = 'projects'
): Promise<UploadResult> {
  const supabase = createClient();
  
  // ファイルをBufferに変換
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer as ArrayBuffer);
  
  // 画像形式を検証
  const { format: originalFormat, isSupported } = await validateImageFormat(buffer);
  
  if (!isSupported) {
    throw new Error(`サポートされていない画像形式です: ${originalFormat}`);
  }

  // 画像情報を取得
  const originalInfo = await getImageInfo(buffer);
  const originalSize = buffer.length;

      let finalBuffer: Buffer = buffer;
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
        
        finalBuffer = Buffer.from(conversionResult.buffer);
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
}

export async function deleteImageFromSupabase(filePath: string): Promise<void> {
  try {
    console.log('Starting delete process for file path:', filePath);
    
    const supabase = createClient();
    
    // ファイルパスを正規化（プロフィール画像削除の成功パターンを適用）
    let fileName = filePath;
    
    // パスの先頭のスラッシュを除去
    if (fileName.startsWith('/')) {
      fileName = fileName.substring(1);
    }
    
    console.log('Normalized filename:', fileName);
    
    if (!fileName || fileName.trim() === '') {
      throw new Error('ファイル名が無効です');
    }
    
    console.log('Attempting to delete file from project-images bucket:', fileName);
    
    // 最初の削除試行（プロフィール画像削除と同じパターン）
    const { error } = await supabase.storage
      .from('project-images')
      .remove([fileName]);

    if (error) {
      console.error('Supabase delete error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name
      });
      
      // 代替方法：パスを明示的に指定して再試行
      console.log('Trying alternative delete method...');
      const { error: altError } = await supabase.storage
        .from('project-images')
        .remove([`/${fileName}`]);
      
      if (altError) {
        console.error('Alternative delete also failed:', altError);
        
        // さらなる代替方法：ファイル存在確認後削除
        console.log('Checking if file exists before delete...');
        const { data: fileList, error: listError } = await supabase.storage
          .from('project-images')
          .list('', { search: fileName });
        
        if (listError) {
          console.error('File list error:', listError);
          throw new Error(`ファイル一覧取得エラー: ${listError.message}`);
        }
        
        console.log('Files found:', fileList);
        const fileExists = fileList?.some((file: any) => file.name === fileName);
        
        if (!fileExists) {
          console.log('File does not exist in storage, considering as successful deletion');
          return; // 成功として扱う
        }
        
        throw new Error(`ファイルの削除に失敗しました: ${altError.message}`);
      } else {
        console.log('Alternative delete method succeeded');
        return;
      }
    }

    console.log('File deleted successfully:', fileName);
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
    console.log('Extracting file path from URL:', url);
    
    // プロフィール画像削除と同じパターンを適用
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
    
    console.log('Extracted filename:', fileName);
    
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
    // バケット一覧の取得に失敗した場合でも、アップロード処理は続行
    console.log('バケット一覧の取得に失敗しましたが、処理を続行します');
    return;
  }

  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  
  if (bucketExists) {
    console.log(`バケット "${BUCKET_NAME}" は既に存在します`);
    return;
  }
  
  // バケットが存在しない場合のみ作成を試行
  console.log(`バケット "${BUCKET_NAME}" が存在しないため、作成を試行します`);
  const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/tiff', 'image/bmp', 'image/heif', 'image/heic'],
    fileSizeLimit: 10485760 // 10MB
  });

  if (createError) {
    console.error('バケット作成エラー:', createError);
    // バケット作成に失敗した場合でも、既存バケットが使用できる可能性があるため警告のみ
    console.warn(`バケットの作成に失敗しましたが、既存バケットの使用を試行します: ${createError.message}`);
    return;
  }
  
  console.log(`バケット "${BUCKET_NAME}" を作成しました`);
} 