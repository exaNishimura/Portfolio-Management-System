'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  MapPin,
  Calendar,
  Mail
} from 'lucide-react';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { Project } from '@/types';
import { Profile } from '@/lib/types/database';

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

interface HeroSectionProps {
  profile: Profile;
  featuredProjects: Project[];
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

export function HeroSection({ profile, featuredProjects }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <motion.div 
        className="container mx-auto max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* プロフィール情報 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image 
                  src={profile.avatar_url || '/placeholder-avatar.jpg'} 
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                <p className="text-lg text-muted-foreground">{profile.title}</p>
              </div>
            </div>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              {profile.experience_years && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {profile.experience_years}年の経験
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
              )}
            </div>
            
            {/* スキルバッジ */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">主要スキル</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1.5">
                    <SkillIcon skill={skill} size={14} />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* SNSリンク */}
            <div className="flex gap-4">
              {profile.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {profile.linkedin_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ウェブサイト
                  </a>
                </Button>
              )}
              {profile.twitter_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </motion.div>

          {/* 注目プロジェクト */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold">注目のプロジェクト</h2>
            <div className="space-y-4">
              {featuredProjects.slice(0, 3).map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {((project.images && project.images.length > 0) || project.image_url) && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image 
                            src={(project.images && project.images.length > 0) ? project.images[0] : project.image_url!} 
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{project.title}</h3>
                        <div 
                          className="text-xs text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(project.description || '') }}
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs flex items-center gap-1">
                              <SkillIcon skill={tech} size={12} />
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link href="#projects-section">
              <Button className="w-full mt-5">
                全ての実績を見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 