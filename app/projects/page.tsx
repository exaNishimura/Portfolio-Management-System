
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

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

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setProjects(dummyProjects);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8">案件一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 flex flex-col gap-2">
              <Skeleton className="h-40 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="p-6 flex flex-col gap-2">
              <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={true}
                />
              </div>
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <div className="text-sm text-gray-500 mb-2">{project.category} / {project.project_year} / {project.project_scale}</div>
              <p className="mb-2 line-clamp-3">{project.description}</p>
              <a href={`/projects/detail/${project.id}`} className="text-blue-600 underline text-sm">詳細を見る</a>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-gray-500">案件がありません</div>
        )}
      </div>
    </main>
  );
} 