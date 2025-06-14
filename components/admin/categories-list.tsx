'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '@/lib/types/database';
import { toast } from 'sonner';

interface CategoriesListProps {
  categories: Category[];
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`「${categoryName}」を削除してもよろしいですか？`)) {
      return;
    }

    setIsDeleting(categoryId);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      toast.success('カテゴリを削除しました');
      // ページをリロードして最新データを取得
      window.location.reload();
    } catch (error) {
      console.error('削除エラー:', error);
      toast.error('カテゴリの削除に失敗しました');
    } finally {
      setIsDeleting(null);
    }
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">まだカテゴリが登録されていません。</p>
          <Link href="/admin/categories/new">
            <Button>最初のカテゴリを追加</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>カテゴリ一覧 ({categories.length}件)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>スラッグ</TableHead>
                <TableHead>説明</TableHead>
                <TableHead>アイコン</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.description || '-'}
                  </TableCell>
                  <TableCell>
                    {category.icon || '-'}
                  </TableCell>
                  <TableCell>
                    {category.created_at 
                      ? new Date(category.created_at).toLocaleDateString('ja-JP')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={isDeleting === category.id}
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