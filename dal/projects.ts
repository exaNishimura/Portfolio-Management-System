import { createClient } from '@/utils/supabase/server';
import { Project, ProjectFormData } from '@/lib/types/database';

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('プロジェクト取得エラー:', error);
    throw new Error('プロジェクトの取得に失敗しました');
  }

  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('プロジェクト取得エラー:', error);
    return null;
  }

  return data;
}

export async function createProject(projectData: ProjectFormData): Promise<Project> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...projectData,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('プロジェクト作成エラー:', error);
    throw new Error('プロジェクトの作成に失敗しました');
  }

  return data;
}

export async function updateProject(id: string, projectData: Partial<ProjectFormData>): Promise<Project> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('プロジェクト更新エラー:', error);
    throw new Error('プロジェクトの更新に失敗しました');
  }

  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('プロジェクト削除エラー:', error);
    throw new Error('プロジェクトの削除に失敗しました');
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('注目プロジェクト取得エラー:', error);
    throw new Error('注目プロジェクトの取得に失敗しました');
  }

  return data || [];
} 