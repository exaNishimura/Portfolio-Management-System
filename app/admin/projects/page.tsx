import { getProjects } from '@/dal/projects';
import { getCategories } from '@/dal/categories';
import ProjectsList from '@/components/admin/projects-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProjectsManagePage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories()
  ]);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">案件管理</h1>
          <p className="text-muted-foreground">
            ポートフォリオに表示する案件を管理します。
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規案件追加
          </Button>
        </Link>
      </div>

      <ProjectsList projects={projects} categories={categories} />
    </main>
  );
} 