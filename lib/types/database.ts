// プロジェクト型
export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  category: string;
  created_at: string | null;
  updated_at: string | null;
  is_featured: boolean | null;
  project_year: number | null;
  project_scale: string | null;
}

// カテゴリ型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string | null;
}

// プロフィール型
export interface Profile {
  id: string;
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
  created_at: string | null;
  updated_at: string | null;
}

// サイト設定型
export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  type: 'text' | 'number' | 'boolean' | 'json';
  created_at: string | null;
  updated_at: string | null;
}

// フォーム用の型
export interface ProjectFormData {
  title: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  technologies: string[];
  category: string;
  is_featured?: boolean;
  project_year?: number;
  project_scale?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface ProfileFormData {
  name: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  avatar_url?: string;
  skills: string[];
  experience_years?: number;
}

export interface SiteSettingFormData {
  key: string;
  value?: string;
  description?: string;
  type: 'text' | 'number' | 'boolean' | 'json';
} 