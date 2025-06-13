interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProjectEditPage({ params }: Props) {
  const { id } = await params;
  // params.id を使ってプロジェクト編集処理を実装
  return <main className="p-8">プロジェクト編集: {id}</main>;
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
} 