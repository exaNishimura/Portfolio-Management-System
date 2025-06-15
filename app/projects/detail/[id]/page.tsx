import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Users, 
  Code2,
  Star,
  Globe
} from 'lucide-react';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { getSupabaseClient, createBuildTimeSupabaseClient } from '@/lib/supabase';
import { Project } from '@/types';

// シンプルなマークダウンパーサー（基本的な要素のみ）
const parseMarkdown = (text: string): string => {
  if (!text) return '';
  
  let html = text
    // ヘッダー
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
    
    // 太字・斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // コード
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // リンク
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // リスト
    .replace(/^\* (.+$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^- (.+$)/gim, '<li class="ml-4">• $1</li>')
    
    // 改行
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br>');

  // リストをまとめる
  html = html.replace(/(<li[^>]*>.*?<\/li>)/g, (match) => {
    return `<ul class="mb-3">${match}</ul>`;
  });

  // 段落で囲む
  if (html && !html.startsWith('<h') && !html.startsWith('<ul')) {
    html = `<p class="mb-3">${html}</p>`;
  }

  return html;
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const supabase = createBuildTimeSupabaseClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) {
    return {
      title: 'プロジェクトが見つかりません',
      description: 'お探しのプロジェクトは存在しません。',
    };
  }

  return {
    title: `${project.title} | 実績詳細`,
    description: project.description.slice(0, 160) + '...',
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 160) + '...',
      images: project.image_url ? [
        {
          url: project.image_url,
          width: 1200,
          height: 800,
          alt: project.title,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description.slice(0, 160) + '...',
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  
  // Supabaseからプロジェクト詳細を取得
  const supabase = await getSupabaseClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    console.error('Project not found:', error);
    notFound();
  }

  // 関連プロジェクト（同じカテゴリの他のプロジェクト）を取得
  const { data: relatedProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('category', project.category)
    .neq('id', id)
    .limit(3);

  const projectScaleLabels = {
    small: '小規模',
    medium: '中規模', 
    large: '大規模'
  };

  // 構造化データ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.image_url,
    "url": project.project_url,
    "dateCreated": project.project_year.toString(),
    "creator": {
      "@type": "Person",
      "name": "ポートフォリオ作成者"
    },
    "keywords": project.technologies?.join(', '),
    "genre": project.category
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* ナビゲーション */}
          <div className="mb-8">
            <Link href="/#projects-section">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                実績一覧に戻る
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メインコンテンツ */}
            <div className="lg:col-span-2 space-y-8">
              {/* プロジェクト画像 */}
              <Card className="overflow-hidden">
                {((project.images && project.images.length > 0) || project.image_url) ? (
                  <div className="space-y-4">
                    {/* メイン画像 */}
                    <div className="relative w-full h-96 lg:h-[500px]">
                      <Image
                        src={(project.images && project.images.length > 0) ? project.images[0] : project.image_url!}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                        priority={true}
                      />
                      {project.is_featured && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            注目プロジェクト
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* 追加画像のサムネイル */}
                    {project.images && project.images.length > 1 && (
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-3">その他の画像</h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {project.images.slice(1).map((imageUrl: string, index: number) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                              <Image
                                src={imageUrl}
                                alt={`${project.title} - 画像 ${index + 2}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 200px"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-96 lg:h-[500px] bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">画像がありません</p>
                  </div>
                )}
              </Card>

              {/* プロジェクト詳細 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl lg:text-3xl">{project.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies?.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-sm flex items-center gap-1.5">
                        <SkillIcon skill={tech} size={14} />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Code2 className="h-5 w-5 mr-2" />
                      プロジェクト概要
                    </h3>
                    {project.description ? (
                      <div 
                        className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(project.description) }}
                      />
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        説明がありません
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* プロジェクト詳細情報 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">制作年</p>
                          <p className="font-medium">{project.project_year}年</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">プロジェクト規模</p>
                          <p className="font-medium">
                            {projectScaleLabels[project.project_scale as keyof typeof projectScaleLabels] || project.project_scale}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">カテゴリ</p>
                          <p className="font-medium">{project.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* アクションボタン */}
                  <div className="flex flex-wrap gap-4">
                    {project.project_url && (
                      <Button asChild className="flex-1 min-w-[200px]">
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          サイトを見る
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button variant="outline" asChild className="flex-1 min-w-[200px]">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHubで見る
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* 技術スタック詳細 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">使用技術</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.technologies?.map((tech: string) => (
                      <div key={tech} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <SkillIcon skill={tech} size={16} />
                          <span className="font-medium">{tech}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* プロジェクト情報 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">プロジェクト情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">制作年</span>
                    <span className="font-medium">{project.project_year}年</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">規模</span>
                    <span className="font-medium">
                      {projectScaleLabels[project.project_scale as keyof typeof projectScaleLabels] || project.project_scale}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">カテゴリ</span>
                    <span className="font-medium">{project.category}</span>
                  </div>
                  {project.is_featured && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ステータス</span>
                      <Badge variant="secondary" className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        注目
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 関連プロジェクト */}
              {relatedProjects && relatedProjects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">関連プロジェクト</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedProjects.map((relatedProject: Project) => (
                      <Link key={relatedProject.id} href={`/projects/detail/${relatedProject.id}`}>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          {((relatedProject.images && relatedProject.images.length > 0) || relatedProject.image_url) && (
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={(relatedProject.images && relatedProject.images.length > 0) ? relatedProject.images[0] : relatedProject.image_url!}
                                alt={relatedProject.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">{relatedProject.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedProject.project_year}年 • {relatedProject.category}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const supabase = createBuildTimeSupabaseClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('id');

  if (!projects) return [];

  return projects.map((project) => ({
    id: project.id,
  }));
} 