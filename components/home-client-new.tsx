'use client';

import { Project } from '@/types';
import { Profile } from '@/lib/types/database';
import { HeroSection } from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { CTASection } from '@/components/sections/cta-section';

// ダミーデータ
const dummyProfile: Profile = {
  id: '1',
  name: 'サンプル 太郎',
  title: 'Webデベロッパー',
  bio: 'モダンなWeb技術を使用したアプリケーション開発を行っています。ユーザー体験を重視した設計と実装を得意としています。',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  location: '日本',
  experience_years: 3,
  email: 'sample@example.com',
  phone: null,
  website: 'https://example.com',
  github_url: 'https://github.com/sample',
  linkedin_url: 'https://linkedin.com/in/sample',
  twitter_url: 'https://twitter.com/sample',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'],
  slack_user_id: null,
  slack_workspace_url: null,
  slack_display_name: null,
  slack_status_text: null,
  slack_status_emoji: null,
  slack_is_active: false,
  slack_last_activity: null,
  slack_webhook_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// ダミープロジェクトデータ
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
  // データが存在しない場合はダミーデータを使用
  const profileToUse = profile || dummyProfile;
  const featuredProjectsToUse = featuredProjects.length > 0 ? featuredProjects : dummyProjects.filter(p => p.is_featured);
  const allProjectsToUse = allProjects.length > 0 ? allProjects : dummyProjects;

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <HeroSection 
        profile={profileToUse}
        featuredProjects={featuredProjectsToUse}
      />

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