import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleImagesToSupabaseFixed as uploadMultipleImagesToSupabase, ensureBucketExists } from '@/lib/utils/supabase-storage-fixed';

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
      // ファイル形式の検証（AVIFを含む）
      const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
        'image/tiff',
        'image/bmp'
      ];
      
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `${file.name} はサポートされていない画像形式です。対応形式: JPEG, PNG, GIF, WebP, AVIF, TIFF, BMP` },
          { status: 400 }
        );
      }

      // ファイルサイズの検証（10MB制限に拡張、変換処理を考慮）
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `${file.name} のファイルサイズが大きすぎます（10MB以下にしてください）` },
          { status: 400 }
        );
      }
    }

    // Supabaseストレージにアップロード（AVIF変換含む）
    const uploadResults = await uploadMultipleImagesToSupabase(files, 'projects');
    const uploadedUrls = uploadResults.map(result => result.url);

    // 変換統計を計算
    const conversionStats = uploadResults.reduce((stats, result) => {
      if (result.originalFormat && result.convertedFormat && result.originalFormat !== result.convertedFormat) {
        stats.converted++;
        stats.totalOriginalSize += result.originalSize || 0;
        stats.totalConvertedSize += result.convertedSize || 0;
      }
      return stats;
    }, { converted: 0, totalOriginalSize: 0, totalConvertedSize: 0 });

    const totalCompressionRatio = conversionStats.totalOriginalSize > 0 
      ? Math.round(((conversionStats.totalOriginalSize - conversionStats.totalConvertedSize) / conversionStats.totalOriginalSize) * 100)
      : 0;

    return NextResponse.json({
      message: `${uploadedUrls.length}個のファイルをアップロードしました`,
      files: uploadedUrls,
      paths: uploadResults.map(result => result.path), // 削除用にパスも返す
      conversionStats: {
        totalFiles: uploadResults.length,
        convertedToAVIF: conversionStats.converted,
        totalCompressionRatio: totalCompressionRatio > 0 ? `${totalCompressionRatio}%` : null
      }
    });

  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
} 