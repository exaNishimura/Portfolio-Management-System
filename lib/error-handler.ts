import { NextResponse } from 'next/server';
import { errorLog } from '@/lib/utils';

/**
 * APIエラーの種類
 */
export enum ApiErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR'
}

/**
 * API エラークラス
 */
export class ApiError extends Error {
  constructor(
    public type: ApiErrorType,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * エラーレスポンス型
 */
export interface ErrorResponse {
  error: string;
  type: ApiErrorType;
  details?: any;
  timestamp: string;
}

/**
 * エラーをAPIレスポンスに変換
 * @param error - エラーオブジェクト
 * @param context - エラーのコンテキスト情報
 * @returns NextResponse
 */
export function handleApiError(error: unknown, context?: any): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();
  
  if (error instanceof ApiError) {
    errorLog(`API Error - ${error.type}`, error, context);
    
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        details: error.details,
        timestamp
      },
      { status: error.statusCode }
    );
  }

  // Supabase エラーの処理
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as any;
    let statusCode = 500;
    let type = ApiErrorType.DATABASE;
    
    switch (supabaseError.code) {
      case 'PGRST116':
        statusCode = 404;
        type = ApiErrorType.NOT_FOUND;
        break;
      case '23505':
        statusCode = 409;
        type = ApiErrorType.VALIDATION;
        break;
      default:
        statusCode = 500;
        type = ApiErrorType.DATABASE;
    }
    
    errorLog(`Supabase Error - ${supabaseError.code}`, error, context);
    
    return NextResponse.json(
      {
        error: 'データベースエラーが発生しました',
        type,
        details: process.env.NODE_ENV === 'development' ? supabaseError.message : undefined,
        timestamp
      },
      { status: statusCode }
    );
  }

  // 一般的なエラー
  const message = error instanceof Error ? error.message : 'サーバーエラーが発生しました';
  
  errorLog('Unhandled Error', error, context);
  
  return NextResponse.json(
    {
      error: message,
      type: ApiErrorType.INTERNAL,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      timestamp
    },
    { status: 500 }
  );
}

/**
 * API ルートラッパー - エラーハンドリングを自動化
 * @param handler - API ハンドラー関数
 * @returns ラップされたハンドラー
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, { handler: handler.name });
    }
  };
}

/**
 * バリデーションエラーを作成
 * @param message - エラーメッセージ
 * @param details - 詳細情報
 * @returns ApiError
 */
export function createValidationError(message: string, details?: any): ApiError {
  return new ApiError(ApiErrorType.VALIDATION, message, 400, details);
}

/**
 * 404エラーを作成
 * @param resource - 見つからないリソース
 * @returns ApiError
 */
export function createNotFoundError(resource: string): ApiError {
  return new ApiError(ApiErrorType.NOT_FOUND, `${resource}が見つかりません`, 404);
}

/**
 * 認証エラーを作成
 * @param message - エラーメッセージ
 * @returns ApiError
 */
export function createUnauthorizedError(message: string = '認証が必要です'): ApiError {
  return new ApiError(ApiErrorType.UNAUTHORIZED, message, 401);
}

/**
 * データベースエラーを作成
 * @param operation - 実行していた操作
 * @param details - 詳細情報
 * @returns ApiError
 */
export function createDatabaseError(operation: string, details?: any): ApiError {
  return new ApiError(
    ApiErrorType.DATABASE,
    `${operation}中にデータベースエラーが発生しました`,
    500,
    details
  );
} 