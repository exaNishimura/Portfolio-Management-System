export default function CategoriesNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">404 - カテゴリ管理ページが見つかりません</h1>
      <p className="mb-6">お探しのカテゴリ管理ページは存在しないか、移動しました。</p>
      <a href="/admin/categories" className="text-blue-600 underline">カテゴリ管理トップへ戻る</a>
    </main>
  );
} 