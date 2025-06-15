import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromSupabase, extractFilePathFromUrl } from '@/lib/utils/supabase-storage';

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: '画像URLが指定されていません' },
        { status: 400 }
      );
    }

    // URLからファイルパスを抽出
    const filePath = extractFilePathFromUrl(imageUrl);
    
    if (!filePath) {
      return NextResponse.json(
        { error: '無効な画像URLです' },
        { status: 400 }
      );
    }

    // Supabaseストレージから削除
    await deleteImageFromSupabase(filePath);

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