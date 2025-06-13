export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  technologies: string[];
  category: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  project_year: number;
  project_scale: 'small' | 'medium' | 'large';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
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