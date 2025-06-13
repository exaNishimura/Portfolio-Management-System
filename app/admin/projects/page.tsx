import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProjectAddForm from './add-form';

// 仮のダミーデータ
const dummyProjects = [
  {
    id: '1',
    title: 'Next.jsポートフォリオ',
    category: 'Next.js',
    year: 2024,
    scale: 'medium',
    is_featured: true,
  },
  {
    id: '2',
    title: 'WordPressコーポレート',
    category: 'WordPress',
    year: 2023,
    scale: 'large',
    is_featured: false,
  },
];

export default function AdminProjectsPage() {
  const handleAdd = (data: any) => {
    // ここでSupabase連携予定
    console.log('追加データ', data);
  };
  return (
    <main className="p-8">
      <ProjectAddForm onSubmit={handleAdd} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">案件管理</h1>
        <Button variant="default">案件を追加</Button>
      </div>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>年度</TableHead>
              <TableHead>規模</TableHead>
              <TableHead>注目</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.year}</TableCell>
                <TableCell>{project.scale}</TableCell>
                <TableCell>{project.is_featured ? '★' : ''}</TableCell>
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