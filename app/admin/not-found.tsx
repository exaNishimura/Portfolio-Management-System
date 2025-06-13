export default function AdminNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">404 - 管理ページが見つかりません</h1>
      <p className="mb-6">お探しの管理ページは存在しないか、移動しました。</p>
      <a href="/admin" className="text-blue-600 underline">ダッシュボードトップへ戻る</a>
    </main>
  );
} 