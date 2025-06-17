import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromSupabase } from '@/lib/utils/supabase-storage';

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: '画像URLが指定されていません' },
        { status: 400 }
      );
    }

    // Supabaseストレージから画像を削除
    await deleteImageFromSupabase(imageUrl);

    return NextResponse.json({
      success: true,
      message: '画像を削除しました'
    });

  } catch (error) {
    console.error('画像削除API エラー:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '画像の削除に失敗しました',
        success: false 
      },
      { status: 500 }
    );
  }
} 