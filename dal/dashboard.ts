import { createClient } from '@/utils/supabase/server';
import { debugLog, errorLog, safeAsync } from '@/lib/utils';

export interface DashboardStats {
  totalProjects: number;
  totalCategories: number;
  totalContacts: number;
  featuredProjects: number;
  recentProjects: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'project' | 'profile' | 'system';
}

/**
 * ダッシュボード統計データを取得
 * @returns ダッシュボード統計情報
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  debugLog('getDashboardStats called');
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();

    // 並列でデータを取得して高速化
    const [
      { count: totalProjects },
      { count: featuredProjects },
      { count: recentProjects },
      { data: projects }
    ] = await Promise.all([
      // 総案件数を取得
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true }),
      
      // 注目案件数を取得
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true),
      
      // 最近の案件数（30日以内）を取得
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // 技術スタック取得用のプロジェクトデータ
      supabase
        .from('projects')
        .select('technologies')
    ]);

    // 使用されている技術スタックの種類数を取得
    const allTechStacks = new Set<string>();
    projects?.forEach(project => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach((tech: string) => allTechStacks.add(tech));
      }
    });

    const stats: DashboardStats = {
      totalProjects: totalProjects || 0,
      totalCategories: allTechStacks.size,
      totalContacts: 0, // 将来的にお問い合わせ機能実装時に更新
      featuredProjects: featuredProjects || 0,
      recentProjects: recentProjects || 0,
    };

    return stats;
  });

  if (error) {
    errorLog('Failed to get dashboard stats', error);
    return {
      totalProjects: 0,
      totalCategories: 0,
      totalContacts: 0,
      featuredProjects: 0,
      recentProjects: 0,
    };
  }

  debugLog('getDashboardStats result', result);
  return result!;
}

/**
 * 最近の活動ログを取得
 * @param limit - 取得件数（デフォルト: 5）
 * @returns 活動ログ配列
 */
export async function getRecentActivity(limit: number = 5): Promise<ActivityLog[]> {
  debugLog('getRecentActivity called', { limit });
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();

    // 並列でデータを取得
    const [
      { data: recentProjects },
      { data: profileData }
    ] = await Promise.all([
      // 最近更新されたプロジェクトを取得
      supabase
        .from('projects')
        .select('id, title, updated_at, created_at')
        .order('updated_at', { ascending: false })
        .limit(limit),
      
      // プロフィール情報の最終更新を取得
      supabase
        .from('profiles')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
    ]);

    const activities: ActivityLog[] = [];

    // プロジェクト関連の活動を追加
    recentProjects?.forEach(project => {
      const createdAt = new Date(project.created_at);
      const updatedAt = new Date(project.updated_at);
      const isNew = Math.abs(createdAt.getTime() - updatedAt.getTime()) < 1000; // 1秒以内の差は新規作成と判定
      
      activities.push({
        id: `project-${project.id}`,
        action: isNew ? 'プロジェクト作成' : 'プロジェクト更新',
        description: `「${project.title}」が${isNew ? '作成' : '更新'}されました`,
        timestamp: project.updated_at,
        type: 'project'
      });
    });

    // プロフィール更新の活動を追加
    if (profileData && profileData[0]) {
      activities.push({
        id: 'profile-update',
        action: 'プロフィール更新',
        description: 'プロフィール情報が更新されました',
        timestamp: profileData[0].updated_at,
        type: 'profile'
      });
    }

    // システム稼働状況を追加
    activities.push({
      id: 'system-status',
      action: 'システム稼働',
      description: 'システムが正常に動作しています',
      timestamp: new Date().toISOString(),
      type: 'system'
    });

    // タイムスタンプでソートして指定件数を返す
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  });

  if (error) {
    errorLog('Failed to get recent activity', error, { limit });
    return [
      {
        id: 'system-status',
        action: 'システム稼働',
        description: 'システムが正常に動作しています',
        timestamp: new Date().toISOString(),
        type: 'system'
      }
    ];
  }

  debugLog('getRecentActivity result', { count: result?.length });
  return result || [];
} 