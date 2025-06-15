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
    console.log('Starting delete process for URL:', url);
    
    const supabase = createClient();
    
    // URLからファイルパスを抽出（より堅牢な方法）
    let fileName: string;
    
    if (url.includes('/storage/v1/object/public/profile-images/')) {
      // Supabase公開URLの場合
      const urlParts = url.split('/storage/v1/object/public/profile-images/');
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
      return false;
    }
    
    console.log('Attempting to delete file from storage:', fileName);
    
    // 最初の削除試行
    const { error } = await supabase.storage
      .from('profile-images')
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
        .from('profile-images')
        .remove([`/${fileName}`]);
      
      if (altError) {
        console.error('Alternative delete also failed:', altError);
        
        // さらなる代替方法：ファイル存在確認後削除
        console.log('Checking if file exists before delete...');
        const { data: fileList, error: listError } = await supabase.storage
          .from('profile-images')
          .list('', { search: fileName });
        
        if (listError) {
          console.error('File list error:', listError);
          return false;
        }
        
        console.log('Files found:', fileList);
        const fileExists = fileList?.some(file => file.name === fileName);
        
        if (!fileExists) {
          console.log('File does not exist in storage, considering as successful deletion');
          return true;
        }
        
        return false;
      } else {
        console.log('Alternative delete method succeeded');
        return true;
      }
    }

    console.log('File deleted successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

export async function testStoragePermissions(): Promise<void> {
  try {
    const supabase = createClient();
    
    console.log('Testing storage permissions...');
    
    // ストレージバケットの情報を取得
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError);
    } else {
      console.log('Available buckets:', buckets);
    }
    
    // profile-imagesバケットのファイル一覧を取得
    const { data: files, error: filesError } = await supabase.storage
      .from('profile-images')
      .list('', { limit: 5 });
    
    if (filesError) {
      console.error('Failed to list files in profile-images:', filesError);
    } else {
      console.log('Files in profile-images bucket:', files);
    }
    
  } catch (error) {
    console.error('Storage permissions test error:', error);
  }
} 