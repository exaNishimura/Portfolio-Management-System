import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: '画像URLが指定されていません' },
        { status: 400 }
      );
    }

    console.log('削除開始 URL:', imageUrl);
    
    const supabase = createClient();
    
    // URLからファイルパスを抽出（プロフィール画像削除と同じパターン）
    let fileName: string;
    
    if (imageUrl.includes('/storage/v1/object/public/project-images/')) {
      // Supabase公開URLの場合
      const urlParts = imageUrl.split('/storage/v1/object/public/project-images/');
      fileName = urlParts[1];
      
      // クエリパラメータを除去
      if (fileName.includes('?')) {
        fileName = fileName.split('?')[0];
      }
    } else {
      // フォールバック：最後のスラッシュ以降をファイル名とする
      const urlParts = imageUrl.split('/');
      fileName = urlParts[urlParts.length - 1];
      
      // クエリパラメータを除去
      if (fileName.includes('?')) {
        fileName = fileName.split('?')[0];
      }
    }
    
    console.log('抽出されたファイル名:', fileName);
    
    if (!fileName || fileName.trim() === '') {
      return NextResponse.json(
        { error: '無効な画像URLです' },
        { status: 400 }
      );
    }
    
    console.log('project-imagesバケットからファイル削除を試行:', fileName);
    
    // 最初の削除試行（プロフィール画像削除と同じパターン）
    const { error } = await supabase.storage
      .from('project-images')
      .remove([fileName]);

    if (error) {
      console.error('Supabase削除エラー:', error);
      console.error('エラー詳細:', {
        message: error.message,
        name: error.name
      });
      
      // 代替方法：パスを明示的に指定して再試行
      console.log('代替削除方法を試行...');
      const { error: altError } = await supabase.storage
        .from('project-images')
        .remove([`/${fileName}`]);
      
      if (altError) {
        console.error('代替削除も失敗:', altError);
        
        // さらなる代替方法：ファイル存在確認後削除
        console.log('ファイル存在確認後削除を試行...');
        const { data: fileList, error: listError } = await supabase.storage
          .from('project-images')
          .list('', { search: fileName });
        
        if (listError) {
          console.error('ファイル一覧取得エラー:', listError);
          return NextResponse.json(
            { error: `ファイル一覧取得エラー: ${listError.message}` },
            { status: 500 }
          );
        }
        
        console.log('見つかったファイル:', fileList);
        const fileExists = fileList?.some((file: any) => file.name === fileName);
        
        if (!fileExists) {
          console.log('ファイルが存在しないため、削除成功として扱います');
          return NextResponse.json({
            message: '画像を削除しました（ファイルは既に存在しませんでした）',
            deletedUrl: imageUrl
          });
        }
        
        return NextResponse.json(
          { error: `ファイルの削除に失敗しました: ${altError.message}` },
          { status: 500 }
        );
      } else {
        console.log('代替削除方法が成功');
      }
    } else {
      console.log('ファイル削除成功:', fileName);
    }

    return NextResponse.json({
      message: '画像を削除しました',
      deletedUrl: imageUrl
    });

  } catch (error) {
    console.error('画像削除エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '画像の削除に失敗しました' },
      { status: 500 }
    );
  }
} 