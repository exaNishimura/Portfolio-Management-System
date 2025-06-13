import { useParams } from 'next/navigation';

export default function ProjectEditPage() {
  const params = useParams();
  const id = params?.id || '';
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">案件編集: {id}</h1>
      {/* 編集フォームをここに表示予定 */}
    </main>
  );
} 