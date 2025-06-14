import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

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

// サーバーサイド用のSupabaseクライアント作成関数
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const getAll = async () => {
    const all = [];
    for (const cookie of cookieStore.getAll()) {
      all.push({ name: cookie.name, value: cookie.value });
    }
    return all;
  };
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll } }
  );
}

// サーバーサイド用のSupabaseクライアント（使用時に作成）
export async function getSupabaseClient() {
  return await createServerSupabaseClient();
}

// ビルド時用のSupabaseクライアント（cookiesを使用しない）
export function createBuildTimeSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getSession() {
  const supabaseClient = await createServerSupabaseClient();
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session;
}