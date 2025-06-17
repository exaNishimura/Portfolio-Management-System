import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

export async function uploadProfileImage(file: File): Promise<UploadResult> {
  try {
    // ファイルサイズチェック (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'ファイルサイズが大きすぎます（最大10MB）'
      };
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'サポートされていないファイル形式です'
      };
    }

    // ファイル名を生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `profile_${timestamp}_${randomString}.${extension}`;

    // Supabaseストレージにアップロード
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabaseアップロードエラー:', error);
      return {
        success: false,
        error: 'アップロードに失敗しました'
      };
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: fileName
    };

  } catch (error) {
    console.error('アップロード処理エラー:', error);
    return {
      success: false,
      error: 'アップロード中にエラーが発生しました'
    };
  }
}

export async function deleteProfileImage(url: string): Promise<boolean> {
  try {
    if (!url) {
      return false;
    }

    // URLからファイル名を抽出
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

    if (!fileName || fileName.trim() === '') {
      console.error('ファイル名の抽出に失敗しました:', url);
      return false;
    }

    // ファイルを削除
    const { error } = await supabase.storage
      .from('profile-images')
      .remove([fileName]);

    if (error) {
      console.error('Supabase削除エラー:', error);
      
      // 代替方法：パスを明示的に指定して再試行
      const { error: altError } = await supabase.storage
        .from('profile-images')
        .remove([`/${fileName}`]);
      
      if (altError) {
        console.error('代替削除方法も失敗:', altError);
        
        // さらなる代替方法：ファイル存在確認後削除
        const { data: fileList, error: listError } = await supabase.storage
          .from('profile-images')
          .list('', { search: fileName });
        
        if (listError) {
          console.error('ファイル一覧取得エラー:', listError);
          return false;
        }
        
        const fileExists = fileList?.some((file: any) => file.name === fileName);
        
        if (!fileExists) {
          return true; // ファイルが存在しない場合は成功として扱う
        }
        
        return false;
      }
    }

    return true;

  } catch (error) {
    console.error('削除処理エラー:', error);
    return false;
  }
}

export async function testStoragePermissions(): Promise<void> {
  try {
    // バケット一覧を取得してストレージ権限をテスト
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('ストレージ権限テストエラー:', bucketError);
      return;
    }

    // profile-imagesバケット内のファイル一覧を取得
    const { data: files, error: filesError } = await supabase.storage
      .from('profile-images')
      .list('', { limit: 5 });
    
    if (filesError) {
      console.error('ファイル一覧取得エラー:', filesError);
      return;
    }

  } catch (error) {
    console.error('ストレージ権限テストエラー:', error);
  }
} 