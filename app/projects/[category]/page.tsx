interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryProjectsPage({ params }: Props) {
  const { category } = await params;
  // params.category を使ってカテゴリ別プロジェクト一覧を実装
  return <main className="p-8">カテゴリ別プロジェクト一覧: {category}</main>;
}

export async function generateStaticParams() {
  return [
    { category: 'nextjs' },
    { category: 'wordpress' },
    { category: 'react' },
    { category: 'other' },
  ];
} 