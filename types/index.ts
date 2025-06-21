/**
 * 基本的なタイムスタンプフィールド
 */
export interface BaseEntity {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * プロジェクトスケール
 */
export type ProjectScale = 'small' | 'medium' | 'large';

/**
 * プロジェクトカテゴリ
 */
export type ProjectCategory = 
  | 'Web Development'
  | 'Mobile App'
  | 'Desktop App' 
  | 'API/Backend'
  | 'E-Commerce'
  | 'SaaS'
  | 'Portfolio'
  | 'web'
  | 'corporate'
  | 'Other';

/**
 * プロジェクト
 */
export interface Project extends BaseEntity {
  title: string;
  description: string | null;
  image_url: string | null;
  images: string[];
  image_paths: string[];
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  category: ProjectCategory;
  is_featured: boolean;
  project_year: number | null;
  project_scale: ProjectScale | null;
}

/**
 * プロフィール
 */
export interface Profile extends BaseEntity {
  name: string;
  title: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  avatar_url: string | null;
  skills: string[];
  experience_years: number | null;
  // Slack連携フィールド
  slack_user_id: string | null;
  slack_workspace_url: string | null;
  slack_display_name: string | null;
  slack_status_text: string | null;
  slack_status_emoji: string | null;
  slack_is_active: boolean | null;
  slack_last_activity: string | null;
  slack_webhook_url: string | null;
}

/**
 * ポートフォリオ設定
 */
export interface PortfolioSettings extends BaseEntity {
  site_title: string;
  site_image_url: string;
  contact_email: string;
  contact_github: string;
  contact_website: string;
  contact_phone: string;
  contact_address: string;
}

/**
 * APIレスポンス基本型
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * ページネーション情報
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * ソートオプション
 */
export interface SortOption<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

/**
 * フィルターオプション
 */
export interface FilterOption<T = any> {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
  value: T;
}

/**
 * クエリオプション
 */
export interface QueryOptions<T = string> {
  sort?: SortOption<T>;
  filters?: FilterOption[];
  pagination?: {
    page: number;
    limit: number;
  };
  select?: string[];
}

/**
 * フォームの状態
 */
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * アップロードファイル情報
 */
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

/**
 * Slack統合状態
 */
export interface SlackIntegration {
  isConnected: boolean;
  workspaceName?: string;
  userId?: string;
  lastSync?: string;
  status: {
    isActive: boolean;
    text: string;
    emoji: string;
    lastActivity: string;
  };
}

/**
 * ダッシュボード統計
 */
export interface DashboardMetrics {
  projects: {
    total: number;
    featured: number;
    recent: number;
    byCategory: Record<ProjectCategory, number>;
    byYear: Record<string, number>;
  };
  technologies: {
    total: number;
    popular: Array<{ name: string; count: number }>;
  };
  activity: {
    lastUpdated: string;
    recentChanges: number;
  };
}

/**
 * 環境変数型
 */
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SLACK_BOT_TOKEN?: string;
  SLACK_USER_TOKEN?: string;
  RESEND_API_KEY?: string;
}

/**
 * テーマ設定
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * ナビゲーション項目
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  isExternal?: boolean;
}

/**
 * SEOメタデータ
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export interface FilterOptions {
  category?: string;
  technologies?: string[];
  year?: number;
  scale?: string;
  featured?: boolean;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}