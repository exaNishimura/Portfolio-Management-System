import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardStatsComponent from '@/components/admin/dashboard-stats';
import ActivityLogComponent from '@/components/admin/activity-log';
import { getDashboardStats, getRecentActivity } from '@/dal/dashboard';
import { BarChart3, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

// ローディングコンポーネント
function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivityLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の活動</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// データ取得コンポーネント
async function DashboardContent() {
  const [stats, activities] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

  return (
    <>
      {/* 統計情報セクション */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-6 w-6" />
          <h2 className="text-xl font-semibold">サイト概要</h2>
        </div>
        <DashboardStatsComponent stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 活動ログ */}
        <div className="lg:col-span-2">
          <ActivityLogComponent activities={activities} />
        </div>

        {/* ポートフォリオ状況カード */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                ポートフォリオ状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">注目プロジェクト</span>
                  <span className="text-sm font-medium">{stats.featuredProjects}件</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">最近の更新</span>
                  <span className="text-sm font-medium">{stats.recentProjects}件</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {stats.totalProjects > 0 
                      ? 'ポートフォリオが構築されています' 
                      : 'プロジェクトを追加してポートフォリオを構築しましょう'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理ダッシュボード</h1>
        <p className="text-muted-foreground">
          ポートフォリオサイトの管理機能にアクセスできます。
        </p>
      </div>

      <Suspense fallback={
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-6 w-6" />
              <h2 className="text-xl font-semibold">サイト概要</h2>
            </div>
            <StatsLoading />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ActivityLoading />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </main>
  );
} 