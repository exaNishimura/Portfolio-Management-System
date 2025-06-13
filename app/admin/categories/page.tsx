import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CategoryAddForm from './add-form';

// 仮のダミーデータ
const dummyCategories = [
  {
    id: '1',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Next.js案件',
    icon: 'rocket',
  },
  {
    id: '2',
    name: 'WordPress',
    slug: 'wordpress',
    description: 'WordPress案件',
    icon: 'wordpress',
  },
];

export default function AdminCategoriesPage() {
  const handleAdd = (data: any) => {
    // ここでSupabase連携予定
    console.log('追加データ', data);
  };
  return (
    <main className="p-8">
      <CategoryAddForm onSubmit={handleAdd} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">カテゴリ管理</h1>
        <Button variant="default">カテゴリを追加</Button>
      </div>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>スラッグ</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>アイコン</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyCategories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>{cat.icon}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" className="mr-2">編集</Button>
                  <Button size="sm" variant="destructive">削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
} 