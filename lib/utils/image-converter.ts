import sharp from 'sharp';

export interface ConversionResult {
  buffer: Buffer;
  originalSize: number;
  convertedSize: number;
  format: string;
  quality: number;
}

export interface ConversionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
}

/**
 * 画像をAVIFフォーマットに変換
 */
export async function convertToAVIF(
  inputBuffer: Buffer,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const {
    quality = 80,
    maxWidth = 1920,
    maxHeight = 1080,
    maintainAspectRatio = true
  } = options;

  try {
    let sharpInstance = sharp(inputBuffer);

    // メタデータを取得
    const metadata = await sharpInstance.metadata();
    const originalSize = inputBuffer.length;

    // リサイズ処理（必要な場合）
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
          fit: maintainAspectRatio ? 'inside' : 'fill',
          withoutEnlargement: true
        });
      }
    }

    // AVIFに変換
    const convertedBuffer = await sharpInstance
      .avif({
        quality,
        effort: 6, // 圧縮効率を高める（0-9、高いほど時間がかかるが効率的）
      })
      .toBuffer();

    return {
      buffer: convertedBuffer,
      originalSize,
      convertedSize: convertedBuffer.length,
      format: 'avif',
      quality
    };

  } catch (error) {
    console.error('AVIF変換エラー:', error);
    throw new Error(`画像のAVIF変換に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

/**
 * 画像形式を検証
 */
export function validateImageFormat(buffer: Buffer): Promise<{ format: string; isSupported: boolean }> {
  return new Promise((resolve) => {
    sharp(buffer)
      .metadata()
      .then((metadata) => {
        const format = metadata.format || 'unknown';
        const supportedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'avif', 'tiff', 'bmp'];
        const isSupported = supportedFormats.includes(format.toLowerCase());
        
        resolve({
          format: format.toLowerCase(),
          isSupported
        });
      })
      .catch(() => {
        resolve({
          format: 'unknown',
          isSupported: false
        });
      });
  });
}

/**
 * 画像の基本情報を取得
 */
export async function getImageInfo(buffer: Buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: buffer.length,
      hasAlpha: metadata.hasAlpha,
      channels: metadata.channels
    };
  } catch (error) {
    console.error('画像情報取得エラー:', error);
    throw new Error('画像情報の取得に失敗しました');
  }
}

/**
 * 複数の画像を並行してAVIFに変換
 */
export async function convertMultipleToAVIF(
  files: { buffer: Buffer; name: string }[],
  options: ConversionOptions = {}
): Promise<{ buffer: Buffer; originalName: string; result: ConversionResult }[]> {
  const conversionPromises = files.map(async (file) => {
    const result = await convertToAVIF(file.buffer, options);
    return {
      buffer: result.buffer,
      originalName: file.name,
      result
    };
  });

  return Promise.all(conversionPromises);
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 圧縮率を計算
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
} 