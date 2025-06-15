import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleImagesToSupabase, ensureBucketExists } from '@/lib/utils/supabase-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // バケットの存在確認・作成
    await ensureBucketExists();

    const uploadedFiles: string[] = [];

    for (const file of files) {
      // ファイル形式の検証
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `${file.name} は画像ファイルではありません` },
          { status: 400 }
        );
      }

      // ファイルサイズの検証（5MB制限）
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `${file.name} のファイルサイズが大きすぎます（5MB以下にしてください）` },
          { status: 400 }
        );
      }
    }

    // Supabaseストレージにアップロード
    const uploadResults = await uploadMultipleImagesToSupabase(files, 'projects');
    const uploadedUrls = uploadResults.map(result => result.url);

    return NextResponse.json({
      message: `${uploadedUrls.length}個のファイルをアップロードしました`,
      files: uploadedUrls,
      paths: uploadResults.map(result => result.path) // 削除用にパスも返す
    });

  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
} 