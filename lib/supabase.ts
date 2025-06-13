import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
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
          project_scale: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url?: string;
          project_url?: string;
          github_url?: string;
          technologies?: string[];
          category: string;
          created_at?: string;
          updated_at?: string;
          is_featured?: boolean;
          project_year?: number;
          project_scale?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          project_url?: string;
          github_url?: string;
          technologies?: string[];
          category?: string;
          updated_at?: string;
          is_featured?: boolean;
          project_year?: number;
          project_scale?: string;
        };
      };
    };
  };
};