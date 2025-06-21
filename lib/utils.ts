import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS クラスをマージするユーティリティ関数
 * @param inputs - クラス値の配列
 * @returns マージされたクラス文字列
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 安全な JSON パース関数
 * @param json - パースする JSON 文字列
 * @param fallback - パース失敗時のフォールバック値
 * @returns パース結果またはフォールバック値
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn('JSON parse failed:', error);
    return fallback;
  }
}

/**
 * 非同期関数の実行結果を安全に処理する関数
 * @param fn - 実行する非同期関数
 * @returns [error, data] のタプル
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[Error | null, T | null]> {
  try {
    const data = await fn();
    return [null, data];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
}

/**
 * デバッグ用ログ出力関数
 * @param label - ログのラベル
 * @param data - ログに出力するデータ
 */
export function debugLog(label: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${label}:`, data);
  }
}

/**
 * エラーログ出力関数
 * @param label - エラーのラベル
 * @param error - エラーオブジェクト
 * @param context - 追加のコンテキスト情報
 */
export function errorLog(label: string, error: unknown, context?: any) {
  console.error(`[ERROR] ${label}:`, error);
  if (context) {
    console.error(`[ERROR] Context:`, context);
  }
}

/**
 * 文字列を安全に切り詰める関数
 * @param str - 切り詰める文字列
 * @param length - 最大長
 * @returns 切り詰められた文字列
 */
export function truncateString(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * オブジェクトから undefined 値を除去する関数
 * @param obj - 処理するオブジェクト
 * @returns undefined 値が除去されたオブジェクト
 */
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  return result;
}

/**
 * 配列を安全にソートする関数
 * @param array - ソートする配列
 * @param compareFn - 比較関数
 * @returns ソートされた新しい配列
 */