'use client';

import { useEffect } from 'react';
import { Project } from '@/types';
import { Profile } from '@/lib/types/database';
import { HeroSection } from '@/components/sections/hero-section';
import { HeroSkeleton } from '@/components/sections/hero-skeleton';
import { ProjectsSection } from '@/components/sections/projects-section';
import { CTASection } from '@/components/sections/cta-section';

// ダミープロジェクトデータ（プロジェクトが存在しない場合のフォールバック用）
const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'サンプルECサイト',
    description: 'モダンなECサイトのフロントエンド開発。レスポンシブデザインとユーザビリティを重視した設計で、快適なショッピング体験を提供。',
    image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'],
    project_url: 'https://example-shop.com/',
    github_url: 'https://github.com/sample/ecommerce',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    category: 'web',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    is_featured: true,
    project_year: 2024,
    project_scale: 'large'
  },
  {
    id: '2',
    title: 'ポートフォリオサイト',
    description: 'クリエイター向けのポートフォリオサイト。作品を美しく展示できるギャラリー機能と、お問い合わせフォームを実装。',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
    project_url: 'https://portfolio-sample.com/',
    github_url: 'https://github.com/sample/portfolio',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    category: 'web',
    created_at: '2023-11-20T00:00:00Z',
    updated_at: '2023-11-20T00:00:00Z',
    is_featured: true,
    project_year: 2023,
    project_scale: 'medium'
  },
  {
    id: '3',
    title: 'コーポレートサイト',
    description: '企業のコーポレートサイト。会社情報の整理と採用情報の充実を図り、ブランドイメージの向上を実現。',
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'],
    project_url: 'https://corporate-sample.com/',
    github_url: '',
    technologies: ['Vue.js', 'Nuxt.js', 'SCSS', 'WordPress'],
    category: 'corporate',
    created_at: '2023-08-10T00:00:00Z',
    updated_at: '2023-08-10T00:00:00Z',
    is_featured: false,
    project_year: 2023,
    project_scale: 'large'
  }
];

interface HomeClientNewProps {
  featuredProjects: Project[];
  allProjects?: Project[];
  profile?: Profile;
  isLoading?: boolean;
}

export function HomeClientNew({ featuredProjects, allProjects = [], profile, isLoading = false }: HomeClientNewProps) {
  // プロジェクトが存在しない場合のフォールバック
  const featuredProjectsToUse = featuredProjects.length > 0 ? featuredProjects : dummyProjects.filter(p => p.is_featured);
  const allProjectsToUse = allProjects.length > 0 ? allProjects : dummyProjects;

  // URLパラメータでプロジェクトセクションへのスクロールを制御
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollToProjects = urlParams.get('scrollTo');
    
    if (scrollToProjects === 'projects' && !isLoading) {
      // ページの読み込みが完了してからスクロール
      const timer = setTimeout(() => {
        const projectsSection = document.getElementById('projects-section');
        if (projectsSection) {
          projectsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // URLからパラメータを削除（履歴を汚さないため）
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }, 500); // 少し待ってからスクロール
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション - プロフィールが存在しない場合はスケルトンを表示 */}
      {profile ? (
        <HeroSection 
          profile={profile}
          featuredProjects={featuredProjectsToUse}
        />
      ) : (
        <HeroSkeleton />
      )}

      {/* プロジェクト一覧セクション */}
      <ProjectsSection 
        projects={allProjectsToUse}
        isLoading={isLoading}
      />

      {/* CTAセクション */}
      <CTASection />
    </div>
  );
} 