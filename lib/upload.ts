import { createClient } from '@/utils/supabase/client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadProfileImage(file: File): Promise<UploadResult> {
  try {
    console.log('Starting upload process for file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // ファイルサイズチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('File size exceeded:', file.size, 'Max:', maxSize);
      return {
        success: false,
        error: 'ファイルサイズが5MBを超えています'
      };
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type, 'Allowed:', allowedTypes);
      return {
        success: false,
        error: 'サポートされていないファイル形式です（JPEG、PNG、WebPのみ）'
      };
    }

    const supabase = createClient();
    console.log('Supabase client created');
    
    // ファイル名を生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${timestamp}_${randomString}.${fileExtension}`;
    console.log('Generated filename:', fileName);

    // Supabaseストレージにアップロード
    console.log('Starting upload to Supabase storage...');
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: `アップロードに失敗しました: ${error.message}`
      };
    }

    console.log('Upload successful, data:', data);

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(data.path);

    console.log('Public URL generated:', urlData.publicUrl);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'アップロード処理中にエラーが発生しました'
    };
  }
}

export async function deleteProfileImage(url: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // URLからファイルパスを抽出
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    const { error } = await supabase.storage
      .from('profile-images')
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
} 