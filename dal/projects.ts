import { createClient } from '@/utils/supabase/server';
import { Project } from '@/types';
import { debugLog, errorLog, safeAsync } from '@/lib/utils';

/**
 * プロジェクト取得オプション
 */
export interface GetProjectsOptions {
  /** 注目プロジェクトのみ取得 */
  featured?: boolean;
  /** 取得件数制限 */
  limit?: number;
  /** ソート順序 */
  orderBy?: {
    column: 'created_at' | 'updated_at' | 'project_year' | 'title';
    ascending?: boolean;
  };
  /** 特定のカテゴリでフィルタ */
  category?: string;
}

/**
 * プロジェクト一覧を取得
 * @param options - 取得オプション
 * @returns プロジェクト配列
 */
export async function getProjects(options: GetProjectsOptions = {}): Promise<Project[]> {
  const { featured, limit, orderBy, category } = options;
  
  debugLog('getProjects called', options);
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    let query = supabase
      .from('projects')
      .select('*');

    // フィルタリング
    if (featured) {
      query = query.eq('is_featured', true);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    // ソート
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
    } else {
      // デフォルトソート
      query = query.order('project_year', { ascending: false })
                   .order('created_at', { ascending: false });
    }

    // 件数制限
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return data || [];
  });

  if (error) {
    errorLog('Failed to fetch projects', error, options);
    return [];
  }

  debugLog('getProjects result', { count: result?.length });
  return result || [];
}

/**
 * プロジェクト詳細を取得
 * @param id - プロジェクトID
 * @returns プロジェクト詳細またはnull
 */
export async function getProjectById(id: string): Promise<Project | null> {
  debugLog('getProjectById called', { id });
  
  if (!id || typeof id !== 'string') {
    errorLog('Invalid project ID', new Error('ID is required and must be a string'), { id });
    return null;
  }

  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // プロジェクトが見つからない場合
        return null;
      }
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return data;
  });

  if (error) {
    errorLog('Failed to fetch project by ID', error, { id });
    return null;
  }

  debugLog('getProjectById result', { found: !!result });
  return result;
}

/**
 * 関連プロジェクトを取得
 * @param category - カテゴリ
 * @param excludeId - 除外するプロジェクトID
 * @param limit - 取得件数（デフォルト: 3）
 * @returns 関連プロジェクト配列
 */
export async function getRelatedProjects(
  category: string,
  excludeId: string,
  limit: number = 3
): Promise<Project[]> {
  debugLog('getRelatedProjects called', { category, excludeId, limit });
  
  return getProjects({
    category,
    limit,
    orderBy: { column: 'created_at', ascending: false }
  }).then(projects => 
    projects.filter(project => project.id !== excludeId)
  );
}

/**
 * プロジェクト統計情報を取得
 * @returns 統計情報
 */
export async function getProjectStats(): Promise<{
  total: number;
  featured: number;
  byCategory: Record<string, number>;
  byYear: Record<string, number>;
}> {
  debugLog('getProjectStats called');
  
  const [error, result] = await safeAsync(async () => {
    const projects = await getProjects();
    
    const stats = {
      total: projects.length,
      featured: projects.filter(p => p.is_featured).length,
      byCategory: {} as Record<string, number>,
      byYear: {} as Record<string, number>
    };

    // カテゴリ別統計
    projects.forEach(project => {
      stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
      
      const year = project.project_year?.toString() || 'Unknown';
      stats.byYear[year] = (stats.byYear[year] || 0) + 1;
    });

    return stats;
  });

  if (error) {
    errorLog('Failed to get project stats', error);
    return {
      total: 0,
      featured: 0,
      byCategory: {},
      byYear: {}
    };
  }

  debugLog('getProjectStats result', result);
  return result || {
    total: 0,
    featured: 0,
    byCategory: {},
    byYear: {}
  };
}

/**
 * プロジェクト作成用データ型
 */
export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

/**
 * プロジェクトを作成
 * @param projectData - プロジェクトデータ
 * @returns 作成されたプロジェクト
 */
export async function createProject(projectData: ProjectFormData): Promise<Project> {
  debugLog('createProject called', { title: projectData.title });
  
  const [error, result] = await safeAsync(async () => {
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
      throw new Error(`Project creation failed: ${error.message}`);
    }

    return data;
  });

  if (error) {
    errorLog('Failed to create project', error, projectData);
    throw error;
  }

  debugLog('createProject result', { id: result?.id });
  return result!;
}

/**
 * プロジェクトを更新
 * @param id - プロジェクトID
 * @param projectData - 更新データ
 * @returns 更新されたプロジェクト
 */
export async function updateProject(id: string, projectData: Partial<ProjectFormData>): Promise<Project> {
  debugLog('updateProject called', { id, fields: Object.keys(projectData) });
  
  const [error, result] = await safeAsync(async () => {
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
      throw new Error(`Project update failed: ${error.message}`);
    }

    return data;
  });

  if (error) {
    errorLog('Failed to update project', error, { id, projectData });
    throw error;
  }

  debugLog('updateProject result', { id: result?.id });
  return result!;
}

/**
 * プロジェクトを削除
 * @param id - プロジェクトID
 */
export async function deleteProject(id: string): Promise<void> {
  debugLog('deleteProject called', { id });
  
  const [error] = await safeAsync(async () => {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Project deletion failed: ${error.message}`);
    }
  });

  if (error) {
    errorLog('Failed to delete project', error, { id });
    throw error;
  }

  debugLog('deleteProject completed', { id });
}

/**
 * 注目プロジェクト一覧を取得
 * @returns 注目プロジェクト配列
 * @deprecated getProjects({ featured: true }) を使用してください
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  debugLog('getFeaturedProjects called (deprecated)');
  return getProjects({ featured: true });
} 