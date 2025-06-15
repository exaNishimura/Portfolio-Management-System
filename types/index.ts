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