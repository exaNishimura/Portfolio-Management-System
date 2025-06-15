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

export interface Profile {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  image_url?: string;
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
  location?: string;
  skills: string[];
  experience_years?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSettings {
  id: string;
  site_title: string;
  site_icon: string;
  site_image_url: string;
  contact_email: string;
  contact_github: string;
  contact_website: string;
  contact_phone: string;
  contact_address: string;
  created_at: string;
  updated_at: string;
}