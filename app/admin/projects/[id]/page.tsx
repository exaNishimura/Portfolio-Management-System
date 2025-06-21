import { notFound } from 'next/navigation';
import { getProjectById } from '@/dal/projects';
import ProjectEditForm from '@/components/admin/project-edit-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProjectEditPage({ params }: Props) {
  const { id } = await params;
  
  const project = await getProjectById(id);
  
  if (!project) {
    notFound();
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              案件管理に戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">案件編集</h1>
            <p className="text-muted-foreground mt-1">
              「{project.title}」の情報を編集します
            </p>
          </div>
        </div>

        {/* 編集フォーム */}
        <ProjectEditForm project={project} />
      </div>
    </main>
  );
}

// 静的パラメータ生成を削除（動的ルートとして扱う）
export async function generateStaticParams() {
  return [];
} 