'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Star, 
  User,
  MapPin,
  Calendar,
  Mail
} from 'lucide-react';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { Project } from '@/types';
import { Profile } from '@/lib/types/database';
import { ProjectSkeleton } from '@/components/project-skeleton';
import { ProjectsSection } from '@/components/sections/projects-section';

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



interface HomeClientProps {
  featuredProjects: Project[];
  allProjects?: Project[];
  profile?: Profile;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};



export function HomeClient({ featuredProjects, allProjects = [], profile, isLoading = false }: HomeClientProps) {
  // データが存在しない場合は何も表示しない
  if (!profile) {
    return <div>プロフィール情報がありません</div>;
  }

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* プロフィール情報 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  {profile.title}
                </p>
                <div 
                  className="text-base text-muted-foreground leading-relaxed max-w-lg"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(profile.bio || '') }}
                />
              </div>

              {/* 基本情報 */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.experience_years && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{profile.experience_years}年の経験</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              {/* CTAボタン */}
              <div className="flex gap-4 pt-4">
                <Link href="/contact">
                  <Button size="lg">
                    お問い合わせ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {profile.github_url && (
                  <Button variant="outline" size="lg" asChild>
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>

            {/* プロフィール画像とスキル */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* プロフィール画像 */}
              <div className="relative">
                <div className="w-80 h-80 mx-auto relative rounded-2xl overflow-hidden">
                  <Image
                    src={profile.avatar_url || '/placeholder-avatar.jpg'}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>

              {/* スキル */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">主なスキル</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-2 text-sm flex items-center gap-2">
                      <SkillIcon skill={skill} size={16} />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* 注目プロジェクトセクション */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">注目プロジェクト</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                特に力を入れて取り組んだプロジェクトをご紹介します。
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <ProjectSkeleton key={index} />
                ))
              ) : (
                featuredProjects.slice(0, 3).map((project: Project) => (
                  <Card key={project.id} className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* 画像セクション */}
                    {((project.images && project.images.length > 0) || project.image_url) && (
                      <Link href={`/projects/detail/${project.id}`}>
                        <div className="relative w-full h-48 overflow-hidden cursor-pointer">
                          <Image 
                            src={(project.images && project.images.length > 0) ? project.images[0] : project.image_url!} 
                            alt={project.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          {project.is_featured && (
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="bg-yellow-500 text-white">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                注目
                              </Badge>
                            </div>
                          )}
                        </div>
                      </Link>
                    )}
                    
                    {/* コンテンツセクション */}
                    <div className="flex flex-col flex-1">
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                        <div 
                          className="line-clamp-3 text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(project.description || '') }}
                        />
                      </CardHeader>
                      
                      <CardContent className="pt-0 flex flex-col flex-1">
                        {/* 技術タグ */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech: string) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        {/* ボタンセクション */}
                        <div className="flex gap-2 mt-auto">
                          <Link href={`/projects/detail/${project.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              詳細を見る
                            </Button>
                          </Link>
                          {project.project_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              )}
            </motion.div>

            {/* すべての実績を見るボタン */}
            <motion.div variants={itemVariants} className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <a href="#projects-section">
                  すべての実績を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 固定フィルタータブ - 重複するセクションを削除し、ProjectsSectionコンポーネントを使用 */}
      <ProjectsSection projects={allProjects} isLoading={isLoading} />

      {/* CTAセクション */}
      <section className="py-20 px-4 bg-primary/5">
        <motion.div 
          className="container mx-auto max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              プロジェクトのご相談はお気軽に
            </h2>
            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
              Webサイト制作やアプリケーション開発に関するご相談を承っております。
              お気軽にお問い合わせください。
            </p>
            <Link href="/contact">
              <Button size="lg">
                お問い合わせ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
} 