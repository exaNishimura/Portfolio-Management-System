// プロジェクト型
export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null; // 後方互換性のため残す
  images: string[]; // 新しい複数画像フィールド
  image_paths?: string[]; // Supabaseストレージのパス情報（削除用）
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



// フォーム用の型
export interface ProjectFormData {
  title: string;
  description?: string | null;
  image_url?: string | null; // 後方互換性のため残す
  images?: string[]; // 新しい複数画像フィールド
  image_paths?: string[]; // Supabaseストレージのパス情報（削除用）
  project_url?: string | null;
  github_url?: string | null;
  technologies: string[];
  category: string;
  is_featured?: boolean;
  project_year?: number;
  project_scale?: string;
}



export interface ProfileFormData {
  name: string;
  title?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  avatar_url?: string | null;
  skills: string[];
  experience_years?: number | null;
}

 