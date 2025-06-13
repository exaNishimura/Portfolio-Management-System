export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">404 - ページが見つかりません</h1>
      <p className="mb-6">お探しのページは存在しないか、移動しました。</p>
      <a href="/" className="text-blue-600 underline">トップページへ戻る</a>
    </main>
  );
} 