import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const dummyProjects = [
    {
      id: '1',
      title: 'Next.jsポートフォリオ',
      category: 'Next.js',
      project_year: 2024,
      project_scale: 'medium',
      description: 'Next.jsとSupabaseを使ったモダンなポートフォリオサイト。',
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      title: 'WordPressコーポレート',
      category: 'WordPress',
      project_year: 2023,
      project_scale: 'large',
      description: 'WordPressで構築した企業向けコーポレートサイト。',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      title: 'React管理画面',
      category: 'React',
      project_year: 2022,
      project_scale: 'small',
      description: 'Reactとshadcn/uiで作成した管理ダッシュボード。',
      image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    },
  ];
  const project = dummyProjects.find((p) => p.id === id);

  if (!project) {
    return <main className="p-8 text-center text-gray-500">案件が見つかりません</main>;
  }

  return (
    <main className="p-8">
      <Card className="p-6 max-w-xl mx-auto">
        <div className="relative w-full h-56 mb-4 rounded overflow-hidden">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 600px"
            priority={true}
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
        <div className="text-sm text-gray-500 mb-2">{project.category} / {project.project_year} / {project.project_scale}</div>
        <p className="mb-4 whitespace-pre-line">{project.description}</p>
        <a href="/projects" className="text-blue-600 underline text-sm">← 一覧に戻る</a>
      </Card>
    </main>
  );
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
} 