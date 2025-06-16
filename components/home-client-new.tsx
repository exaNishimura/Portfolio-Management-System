'use client';

import { Project } from '@/types';
import { Profile } from '@/lib/types/database';
import { HeroSection } from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { CTASection } from '@/components/sections/cta-section';

// ダミーデータ
const dummyProfile: Profile = {
  id: '1',
  name: 'Web Developer',
  title: 'フルスタック開発者',
  bio: 'モダンなWeb技術を使用して、ユーザーフレンドリーなWebアプリケーションを開発しています。フロントエンドからバックエンドまで幅広く対応可能です。',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  location: '東京, 日本',
  experience_years: 5,
  email: 'contact@example.com',
  phone: null,
  website: 'https://example.com',
  github_url: 'https://github.com/username',
  linkedin_url: 'https://linkedin.com/in/username',
  twitter_url: 'https://twitter.com/username',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// ダミープロジェクトデータ
const dummyProjects: Project[] = [
  {
    id: '1',
    title: '亀山市公式ホームページ',
    description: '三重県亀山市の公式ホームページのリニューアルプロジェクト。市民の利便性向上とアクセシビリティの改善を重視した設計。',
    image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'],
    project_url: 'https://www.city.kameyama.mie.jp/',
    github_url: '',
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
    title: '宿坊心月',
    description: '伝統的な宿坊の魅力を現代的なWebデザインで表現。予約システムと多言語対応を実装し、国内外からの宿泊客に対応。',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
    project_url: 'https://shukubo-shingetsu.com/',
    github_url: '',
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
    title: '東洋製罐グループホールディングス',
    description: '大手製造業のコーポレートサイト。IR情報の充実と投資家向けコンテンツの最適化を実現。',
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'],
    project_url: 'https://www.toyo-seikan.co.jp/',
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