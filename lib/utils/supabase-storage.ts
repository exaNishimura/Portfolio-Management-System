import { createClient } from '@/utils/supabase/server';

const BUCKET_NAME = 'project-images';

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadImageToSupabase(
  file: File,
  folder: string = 'projects'
): Promise<UploadResult> {
  const supabase = await createClient();
  
  // ファイル名の生成（タイムスタンプ + ランダム文字列）
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  const fileName = `${timestamp}_${randomString}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  // ファイルをSupabaseストレージにアップロード
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
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
    path: filePath
  };
}

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

// バケットが存在するかチェックし、なければ作成する関数
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
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('バケット作成エラー:', createError);
      throw new Error(`バケットの作成に失敗しました: ${createError.message}`);
    }
    
    console.log(`バケット "${BUCKET_NAME}" を作成しました`);
  }
} 