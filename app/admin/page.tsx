import AdminLinkCards from '@/components/admin/admin-link-cards';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理ダッシュボード</h1>
        <p className="text-muted-foreground">
          ポートフォリオサイトの管理機能にアクセスできます。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側エリア - 概要情報 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">サイト概要</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">総案件数</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">カテゴリ数</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">お問い合わせ</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">最近の活動</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">システムが正常に動作しています</span>
                <span className="text-xs text-muted-foreground">今</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右側エリア - 管理機能リンク */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">管理機能</h2>
            <AdminLinkCards />
          </div>
        </div>
      </div>
    </main>
  );
} 