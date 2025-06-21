import { motion } from 'framer-motion';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { parseMarkdown } from '@/lib/utils/markdown-parser';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  selectedTechnologies: string[];
  shouldShowEffect: boolean;
  onTechnologyChange: (tech: string, checked: boolean) => void;
}

export function ProjectCard({ 
  project, 
  selectedTechnologies, 
  shouldShowEffect, 
  onTechnologyChange 
}: ProjectCardProps) {
  return (
    <motion.div 
      key={project.id} 
      data-project-id={project.id}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      layout
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <Card className={`group h-full flex flex-col overflow-hidden transition-all duration-300 ease-out ${
        shouldShowEffect 
          ? 'hover:shadow-2xl hover:scale-105 shadow-2xl scale-105' 
          : 'hover:shadow-2xl hover:scale-105'
      }`}>
        {/* 画像セクション */}
        {((project.images && project.images.length > 0) || project.image_url) && (
          <Link href={`/projects/detail/${project.id}`}>
            <div className="relative w-full h-64 overflow-hidden">
              <Image 
                src={(project.images && project.images.length > 0) ? project.images[0] : project.image_url!} 
                alt={project.title} 
                fill 
                className={`object-cover transition-all duration-300 ${
                  shouldShowEffect 
                    ? 'grayscale-0' 
                    : 'grayscale group-hover:grayscale-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              {/* 注目バッジ - 画像右上に配置 */}
              {project.is_featured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge 
                    variant="secondary" 
                    className="bg-amber-600 text-white shadow-lg backdrop-blur-sm border-0 font-semibold"
                  >
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    注目
                  </Badge>
                </div>
              )}
            </div>
          </Link>
        )}
        
        {/* コンテンツセクション */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {project.title}
            </CardTitle>
            <div 
              className="line-clamp-3 text-sm mt-2 text-muted-foreground mb-4"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(project.description || '') }}
            />
          </div>
          
          {/* 技術タグ */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 6).map((tech: string) => (
              <Badge 
                key={tech} 
                variant={selectedTechnologies.includes(tech) ? "default" : "outline"} 
                className="text-xs px-3 py-1 cursor-pointer flex items-center gap-1.5"
                onClick={() => {
                  onTechnologyChange(tech, !selectedTechnologies.includes(tech));
                }}
              >
                <SkillIcon skill={tech} size={12} />
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 6 && (
              <Badge variant="outline" className="text-xs px-3 py-1">
                +{project.technologies.length - 6}
              </Badge>
            )}
          </div>
          
          {/* ボタンセクション - 最下部に固定 */}
          <div className="flex gap-2 mt-auto">
            <Link href={`/projects/detail/${project.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                詳細を見る
              </Button>
            </Link>
            {project.project_url && (
              <Button variant="outline" size="icon" asChild>
                <a 
                  href={project.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`${project.title}のサイトを見る`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button variant="outline" size="icon" asChild>
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`${project.title}のGitHubリポジトリを見る`}
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 