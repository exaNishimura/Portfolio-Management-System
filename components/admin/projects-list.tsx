'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, ExternalLink, Github, Star } from 'lucide-react';
import { Project } from '@/lib/types/database';
import { toast } from 'sonner';

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (!confirm(`「${projectTitle}」を削除してもよろしいですか？`)) {
      return;
    }

    setIsDeleting(projectId);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      toast.success('案件を削除しました');
      // ページをリロードして最新データを取得
      window.location.reload();
    } catch (error) {
      console.error('削除エラー:', error);
      toast.error('案件の削除に失敗しました');
    } finally {
      setIsDeleting(null);
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">まだ案件が登録されていません。</p>
          <Link href="/admin/projects/new">
            <Button>最初の案件を追加</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>案件一覧 ({projects.length}件)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>年度</TableHead>
                <TableHead>規模</TableHead>
                <TableHead>注目</TableHead>
                <TableHead>技術</TableHead>
                <TableHead>リンク</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.project_year || '-'}
                  </TableCell>
                  <TableCell>
                    {project.project_scale || '-'}
                  </TableCell>
                  <TableCell>
                    {project.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id, project.title)}
                        disabled={isDeleting === project.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 