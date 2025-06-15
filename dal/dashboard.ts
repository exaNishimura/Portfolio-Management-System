import { createClient } from '@/utils/supabase/server';

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
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  try {
    // 総案件数を取得
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    // 注目案件数を取得
    const { count: featuredProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true);

    // 最近の案件数（30日以内）を取得
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // 使用されている技術スタックの種類数を取得（カテゴリ数として使用）
    const { data: projects } = await supabase
      .from('projects')
      .select('tech_stack');

    const allTechStacks = new Set<string>();
    projects?.forEach(project => {
      if (project.tech_stack && Array.isArray(project.tech_stack)) {
        project.tech_stack.forEach((tech: string) => allTechStacks.add(tech));
      }
    });

    return {
      totalProjects: totalProjects || 0,
      totalCategories: allTechStacks.size,
      totalContacts: 0, // 将来的にお問い合わせ機能実装時に更新
      featuredProjects: featuredProjects || 0,
      recentProjects: recentProjects || 0,
    };
  } catch (error) {
    console.error('ダッシュボード統計取得エラー:', error);
    return {
      totalProjects: 0,
      totalCategories: 0,
      totalContacts: 0,
      featuredProjects: 0,
      recentProjects: 0,
    };
  }
}

/**
 * 最近の活動ログを取得
 */
export async function getRecentActivity(): Promise<ActivityLog[]> {
  const supabase = await createClient();

  try {
    // 最近更新されたプロジェクトを取得
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('id, title, updated_at, created_at')
      .order('updated_at', { ascending: false })
      .limit(5);

    // プロフィール情報の最終更新を取得
    const { data: profileData } = await supabase
      .from('profiles')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    const activities: ActivityLog[] = [];

    // プロジェクト関連の活動を追加
    recentProjects?.forEach(project => {
      const isNew = new Date(project.created_at).getTime() === new Date(project.updated_at).getTime();
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

    // タイムスタンプでソートして最新5件を返す
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

  } catch (error) {
    console.error('活動ログ取得エラー:', error);
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
} 