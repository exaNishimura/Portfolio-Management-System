'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Star, 
  Filter,
  User,
  MapPin,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp,
  Code
} from 'lucide-react';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { Project } from '@/types';
import { Profile } from '@/lib/types/database';
import { ProjectSkeleton } from '@/components/project-skeleton';

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

export function HomeClient({ featuredProjects, allProjects = [], profile, isLoading = false }: HomeClientProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [filterTopPosition, setFilterTopPosition] = useState('50%'); // フィルターの上端位置
  const [isTechFilterOpen, setIsTechFilterOpen] = useState(false);
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true); // 初期状態を閉じた状態に変更

  // フィルター開閉状態をlocalStorageから復元
  useEffect(() => {
    const savedTechFilterOpen = localStorage.getItem('techFilterOpen');
    const savedSortFilterOpen = localStorage.getItem('sortFilterOpen');
    const savedSidebarMinimized = localStorage.getItem('sidebarMinimized');
    
    if (savedTechFilterOpen !== null) {
      setIsTechFilterOpen(JSON.parse(savedTechFilterOpen));
    }
    if (savedSortFilterOpen !== null) {
      setIsSortFilterOpen(JSON.parse(savedSortFilterOpen));
    }
    if (savedSidebarMinimized !== null) {
      setIsSidebarMinimized(JSON.parse(savedSidebarMinimized));
    } else {
      // 初回訪問時は閉じた状態をデフォルトに
      setIsSidebarMinimized(true);
    }
  }, []);

  // フィルター開閉状態をlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('techFilterOpen', JSON.stringify(isTechFilterOpen));
  }, [isTechFilterOpen]);

  useEffect(() => {
    localStorage.setItem('sortFilterOpen', JSON.stringify(isSortFilterOpen));
  }, [isSortFilterOpen]);

  useEffect(() => {
    localStorage.setItem('sidebarMinimized', JSON.stringify(isSidebarMinimized));
  }, [isSidebarMinimized]);

  // プロフィール情報の処理（データベースから取得したものを優先、なければダミーデータ）
  const profileToUse = profile || dummyProfile;

  // 実データを優先し、データがない場合のみダミーデータを使用
  const projectsToUse = allProjects.length > 0 ? allProjects : dummyProjects;
  const featuredProjectsToUse = featuredProjects.length > 0 ? featuredProjects : dummyProjects.filter(p => p.is_featured);

  // デバッグ用ログ
  console.log('HomeClient - allProjects:', allProjects.length, allProjects);
  console.log('HomeClient - projectsToUse:', projectsToUse.length, projectsToUse);
  console.log('HomeClient - selectedTechnologies:', selectedTechnologies);

  // 全プロジェクトから技術スタックを抽出
  const allTechnologies = Array.from(
    new Set(projectsToUse.flatMap(project => project.technologies))
  ).sort();

  // フィルタリングとソート
  const filteredAndSortedProjects = useMemo(() => {
    console.log('=== Filtering projects ===');
    console.log('selectedTechnologies:', selectedTechnologies);
    console.log('sortBy:', sortBy);
    console.log('Available projects:', projectsToUse.length);
    
    let filtered = [...projectsToUse]; // 配列をコピー
    
    // 技術スタックでフィルタリング
    if (selectedTechnologies.length > 0) {
      console.log('Applying technology filter...');
      filtered = filtered.filter(project => {
        const hasMatchingTech = selectedTechnologies.some(tech => 
          project.technologies.includes(tech)
        );
        console.log(`Project "${project.title}" has matching tech:`, hasMatchingTech, 'Technologies:', project.technologies);
        return hasMatchingTech;
      });
    }
    
    console.log('After filtering:', filtered.length);
    
    // ソート
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return aDate - bDate;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'featured':
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          const aFeaturedDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bFeaturedDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bFeaturedDate - aFeaturedDate;
        case 'newest':
        default:
          const aNewestDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bNewestDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bNewestDate - aNewestDate;
      }
    });
    
    console.log('Final sorted projects:', sorted.length);
    console.log('=== End filtering ===');
    return sorted;
  }, [projectsToUse, selectedTechnologies, sortBy]);

  // セクション内でのみフィルターを表示（ハイブリッドアプローチ）
  useEffect(() => {
    const projectsSection = document.getElementById('projects-section');
    if (!projectsSection) return;

    let isInSection = false;

    // Intersection Observer でセクションの可視性を監視
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInSection = entry.isIntersecting;
          console.log('Section visibility changed:', isInSection);
          checkFilterVisibility();
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    // スクロールイベントでセクション内の位置を詳細に監視
    const checkFilterVisibility = () => {
      if (!isInSection) {
        setIsFilterSticky(false);
        return;
      }

      const rect = projectsSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const windowHeight = window.innerHeight;

      // 実績カードグリッドの位置を取得
      const projectsGrid = document.getElementById('projects-grid');
      let gridTop = sectionTop; // デフォルトはセクションの上端
      
      if (projectsGrid) {
        const gridRect = projectsGrid.getBoundingClientRect();
        gridTop = gridRect.top;
        
        // フィルターボタンの位置をグリッドの上端に合わせる
        const topPosition = Math.max(gridTop, 100); // 最小100px
        setFilterTopPosition(`${topPosition}px`);
      }

      // セクションの上端が画面上部に到達し、下端がまだ画面内にある場合のみ表示
      const shouldShow = sectionTop <= 100 && sectionBottom > 200;

      console.log('Filter visibility check:', {
        isInSection,
        sectionTop,
        sectionBottom,
        gridTop,
        windowHeight,
        shouldShow,
        currentSticky: isFilterSticky
      });

      setIsFilterSticky(shouldShow);
    };

    const handleScroll = () => {
      if (isInSection) {
        checkFilterVisibility();
      }
    };

    observer.observe(projectsSection);
    window.addEventListener('scroll', handleScroll);
    
    // 初期状態をチェック
    checkFilterVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 状態変更を監視
  useEffect(() => {
    console.log('selectedTechnologies changed:', selectedTechnologies);
    console.log('Current filtered projects count:', filteredAndSortedProjects.length);
  }, [selectedTechnologies, filteredAndSortedProjects.length]);

  useEffect(() => {
    console.log('sortBy changed:', sortBy);
  }, [sortBy]);

  const handleTechnologyChange = (tech: string, checked: boolean | 'indeterminate') => {
    console.log('handleTechnologyChange:', tech, checked);
    if (checked === true) {
      setSelectedTechnologies(prev => {
        const newTechnologies = [...prev, tech];
        console.log('Adding tech, new array:', newTechnologies);
        return newTechnologies;
      });
    } else {
      setSelectedTechnologies(prev => {
        const newTechnologies = prev.filter(t => t !== tech);
        console.log('Removing tech, new array:', newTechnologies);
        return newTechnologies;
      });
    }
  };

  const clearFilters = () => {
    console.log('clearFilters called - before:', { selectedTechnologies, sortBy });
    
    // 状態を強制的にリセット
    setSelectedTechnologies([]);
    setSortBy('newest');
    
    // フィルターの開閉状態も初期化（閉じた状態に戻す）
    setIsTechFilterOpen(false);
    setIsSortFilterOpen(false);
    
    console.log('clearFilters called - after setting state');
    
    // 状態変更を確実に反映させるため、少し遅延を入れる
    setTimeout(() => {
      console.log('clearFilters - timeout check:', { selectedTechnologies, sortBy });
      // 必要に応じて強制的に再レンダリング
      setSelectedTechnologies(prev => [...prev]);
    }, 50);
  };

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
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
                    src={profileToUse.avatar_url || '/placeholder-avatar.jpg'} 
                    alt={profileToUse.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{profileToUse.name}</h1>
                  <p className="text-lg text-muted-foreground">{profileToUse.title}</p>
                </div>
              </div>
              
              <p className="text-base text-muted-foreground leading-relaxed">
                {profileToUse.bio}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {profileToUse.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profileToUse.location}
                  </div>
                )}
                {profileToUse.experience_years && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {profileToUse.experience_years}年の経験
                  </div>
                )}
                {profileToUse.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profileToUse.email}
                  </div>
                )}
              </div>
              
              {/* スキルバッジ */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">主要スキル</h3>
                <div className="flex flex-wrap gap-2">
                  {profileToUse.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1.5">
                      <SkillIcon skill={skill} size={14} />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* SNSリンク */}
              <div className="flex gap-4">
                {profileToUse.github_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileToUse.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {profileToUse.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileToUse.linkedin_url} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profileToUse.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileToUse.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      ウェブサイト
                    </a>
                  </Button>
                )}
                {profileToUse.twitter_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileToUse.twitter_url} target="_blank" rel="noopener noreferrer">
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
                {featuredProjectsToUse.slice(0, 3).map((project) => (
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
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
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

      {/* 固定フィルタータブ - 実績一覧セクション内でのみ表示 */}
      <AnimatePresence>
        {isFilterSticky && (
          <motion.div 
            className="fixed right-0 z-50"
            style={{ top: filterTopPosition, transform: 'translateY(0)' }}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ 
              x: isSidebarMinimized ? 'calc(100% - 60px)' : 0,
              opacity: 1
            }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-400 ${
              isSidebarMinimized 
                ? 'rounded-l-2xl w-60 h-16' 
                : 'rounded-l-2xl w-80 min-h-96'
            }`}>
              {/* タブハンドル（最小化時の表示） */}
              <AnimatePresence>
                {isSidebarMinimized && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex items-center justify-between px-4 cursor-pointer"
                    onClick={() => setIsSidebarMinimized(false)}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Filter className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <div className="text-sm font-semibold">フィルター</div>
                        <div className="text-xs text-slate-300">
                          {selectedTechnologies.length > 0 || sortBy !== 'newest' 
                            ? `${selectedTechnologies.length + (sortBy !== 'newest' ? 1 : 0)}件適用中` 
                            : 'タップして開く'
                          }
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronUp className="h-5 w-5 -rotate-90" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* フィルターコンテンツ（展開時の表示） */}
              <AnimatePresence>
                {!isSidebarMinimized && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Filter className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-bold">フィルター</h3>
                      </div>
                      <motion.button
                        onClick={() => setIsSidebarMinimized(true)}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronUp className="h-4 w-4 rotate-90" />
                      </motion.button>
                    </div>

                    <div className="space-y-6">
                      {/* 技術スタックフィルター */}
                      <Collapsible open={isTechFilterOpen} onOpenChange={setIsTechFilterOpen}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 5 }}
                              transition={{ duration: 0.2 }}
                              className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
                            >
                              <Code className="h-3 w-3" />
                            </motion.div>
                            <span className="text-sm font-medium">技術スタック</span>
                            <AnimatePresence>
                              {selectedTechnologies.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium"
                                >
                                  {selectedTechnologies.length}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.div
                            animate={{ rotate: isTechFilterOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <motion.div
                            initial={false}
                            animate={{ 
                              opacity: isTechFilterOpen ? 1 : 0,
                              y: isTechFilterOpen ? 0 : -10
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="space-y-2 max-h-48 overflow-y-auto"
                          >
                            {allTechnologies.map((tech, index) => (
                              <motion.div 
                                key={tech} 
                                className="flex items-center space-x-3 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                              >
                                <Checkbox
                                  id={tech}
                                  checked={selectedTechnologies.includes(tech)}
                                  onCheckedChange={(checked: boolean | 'indeterminate') => 
                                    handleTechnologyChange(tech, checked)
                                  }
                                  className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                                <Label htmlFor={tech} className="text-sm cursor-pointer text-slate-200 hover:text-white transition-colors flex items-center gap-2">
                                  <SkillIcon skill={tech} size={14} />
                                  {tech}
                                </Label>
                              </motion.div>
                            ))}
                          </motion.div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* 並び順フィルター */}
                      <Collapsible open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 5 }}
                              transition={{ duration: 0.2 }}
                              className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </motion.div>
                            <span className="text-sm font-medium">並び順</span>
                            <AnimatePresence>
                              {sortBy !== 'newest' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-medium"
                                >
                                  {sortBy === 'oldest' ? '古い順' : 
                                   sortBy === 'name' ? '名前順' : 
                                   sortBy === 'featured' ? '注目順' : ''}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.div
                            animate={{ rotate: isSortFilterOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <motion.div
                            initial={false}
                            animate={{ 
                              opacity: isSortFilterOpen ? 1 : 0,
                              y: isSortFilterOpen ? 0 : -10
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value)}>
                              {[
                                { value: 'newest', label: '新しい順', icon: '🆕' },
                                { value: 'oldest', label: '古い順', icon: '📅' },
                                { value: 'name', label: '名前順', icon: '🔤' },
                                { value: 'featured', label: '注目順', icon: '⭐' }
                              ].map((option, index) => (
                                <motion.div 
                                  key={option.value}
                                  className="flex items-center space-x-3 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                  <RadioGroupItem 
                                    value={option.value} 
                                    id={option.value}
                                    className="border-slate-400 text-blue-500"
                                  />
                                  <Label htmlFor={option.value} className="text-sm cursor-pointer text-slate-200 hover:text-white transition-colors flex items-center gap-2">
                                    <span>{option.icon}</span>
                                    {option.label}
                                  </Label>
                                </motion.div>
                              ))}
                            </RadioGroup>
                          </motion.div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* フィルタークリア */}
                      <motion.button
                        onClick={clearFilters}
                        className="w-full p-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl text-white font-medium transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        フィルターをクリア
                      </motion.button>

                      {/* 結果件数 */}
                      <motion.div 
                        className="text-center text-slate-300 text-sm"
                        key={filteredAndSortedProjects.length}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {filteredAndSortedProjects.length}件の実績
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* プロジェクト一覧セクション */}
      <section id="projects-section" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">実績一覧</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                これまでに制作したプロジェクトをご覧いただけます。技術スタック別にフィルタリングも可能です。
              </p>
            </motion.div>

            {/* プロジェクト一覧 */}
            <motion.div 
              variants={itemVariants} 
              className="w-full"
              layout
              transition={{ duration: 0.3 }}
            >
                {isLoading ? (
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <ProjectSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredAndSortedProjects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    条件に一致する実績がありません
                  </div>
                ) : (
                  <div id="projects-grid" className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {filteredAndSortedProjects.map((project: Project) => (
                        <motion.div 
                          key={project.id} 
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          layout
                          transition={{ 
                            duration: 0.3,
                            ease: "easeInOut"
                          }}
                        >
                        <Card className="h-full hover:shadow-lg transition-all duration-200">
                          {((project.images && project.images.length > 0) || project.image_url) && (
                            <Link href={`/projects/detail/${project.id}`}>
                              <div className="relative w-full h-64 rounded-t-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                <Image 
                                  src={(project.images && project.images.length > 0) ? project.images[0] : project.image_url!} 
                                  alt={project.title} 
                                  fill 
                                  className="object-cover" 
                                />
                              </div>
                            </Link>
                          )}
                          <CardHeader className="p-6 pb-4">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg sm:text-xl line-clamp-2">
                                {project.title}
                              </CardTitle>
                              {project.is_featured && (
                                <Badge variant="secondary" className="ml-2 text-sm">
                                  <Star className="h-4 w-4 mr-1" />
                                  注目
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="line-clamp-3 text-base mt-2">
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-6 pt-0">
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.technologies.slice(0, 6).map((tech: string) => (
                                <Badge 
                                  key={tech} 
                                  variant={selectedTechnologies.includes(tech) ? "default" : "outline"} 
                                  className="text-xs px-3 py-1 cursor-pointer flex items-center gap-1.5"
                                  onClick={() => {
                                    handleTechnologyChange(tech, !selectedTechnologies.includes(tech));
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
                            <div className="flex gap-3">
                              <Link href={`/projects/detail/${project.id}`}>
                                <Button variant="outline" size="default" className="flex-1">
                                  詳細を見る
                                </Button>
                              </Link>
                              {project.project_url && (
                                <Button variant="outline" size="default" asChild>
                                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                              {project.github_url && (
                                <Button variant="outline" size="default" asChild>
                                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>


          </motion.div>
        </div>
      </section>

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