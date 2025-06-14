import { getCategories } from '@/dal/categories';
import CategoriesList from '@/components/admin/categories-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CategoriesManagePage() {
  const categories = await getCategories();

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">カテゴリ管理</h1>
          <p className="text-muted-foreground">
            案件を分類するためのカテゴリを管理します。
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規カテゴリ追加
          </Button>
        </Link>
      </div>

      <CategoriesList categories={categories} />
    </main>
  );
} 