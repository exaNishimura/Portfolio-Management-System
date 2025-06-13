interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CategoryEditPage({ params }: Props) {
  const { id } = await params;
  // params.id を使ってカテゴリ編集処理を実装
  return <main className="p-8">カテゴリ編集: {id}</main>;
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
} 