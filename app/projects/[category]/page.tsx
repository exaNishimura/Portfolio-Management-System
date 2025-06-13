import { useParams } from 'next/navigation';

export default function CategoryProjectsPage() {
  const params = useParams();
  const category = params?.category || '';
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{category} の案件一覧</h1>
      {/* カテゴリ別案件リストをここに表示予定 */}
    </main>
  );
} 