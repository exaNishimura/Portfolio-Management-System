import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectCreateForm from '@/components/admin/project-create-form';

export const dynamic = 'force-dynamic';

export default function CreateProjectPage() {
  return (
    <main className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">新規プロジェクト作成</h1>
        <p className="text-muted-foreground">
          新しいプロジェクトをポートフォリオに追加します。
        </p>
      </div>

      <div className="max-w-4xl">
        <ProjectCreateForm />
      </div>
    </main>
  );
} 