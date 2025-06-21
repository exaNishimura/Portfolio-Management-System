'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Filter, 
  SortAsc, 
  Star, 
  ExternalLink, 
  Github,
  ChevronDown,
  ChevronUp,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Image from 'next/image';
import Link from 'next/link';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { parseMarkdown } from '@/lib/utils/markdown-parser';
import { Project } from '@/types';
import { ProjectSkeleton } from '@/components/project-skeleton';

interface ProjectsSectionProps {
  projects: Project[];
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

export function ProjectsSection({ projects, isLoading = false }: ProjectsSectionProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isTechFilterOpen, setIsTechFilterOpen] = useState(false);
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
  
  // スマホでのスクロールエフェクト用の状態
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 全技術スタックを取得
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // フィルタリングとソート
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // 技術スタックでフィルタリング
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(project =>
        selectedTechnologies.some(tech => project.technologies.includes(tech))
      );
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [projects, selectedTechnologies, sortBy]);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer の設定
  const setupIntersectionObserver = useCallback(() => {
    if (!isMobile) return;

    // 既存のオブザーバーをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 新しいオブザーバーを作成
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisibleCards = new Set(visibleCards);
        
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-project-id');
          if (!cardId) return;

          if (entry.isIntersecting) {
            // カードが画面中央付近に来た場合
            newVisibleCards.add(cardId);
          } else {
            // カードが画面から離れた場合
            newVisibleCards.delete(cardId);
          }
        });

        setVisibleCards(newVisibleCards);
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px', // 画面の中央60%の範囲
        threshold: 0.3 // カードの30%が見えたら発動
      }
    );

    // 全てのプロジェクトカードを監視対象に追加
    const cards = document.querySelectorAll('[data-project-id]');
    cards.forEach((card) => {
      if (observerRef.current) {
        observerRef.current.observe(card);
      }
    });
  }, [isMobile, visibleCards]);

  // プロジェクトが変更されたときにオブザーバーを再設定
  useEffect(() => {
    if (filteredAndSortedProjects.length > 0) {
      // DOM更新を待ってからオブザーバーを設定
      const timer = setTimeout(setupIntersectionObserver, 100);
      return () => clearTimeout(timer);
    }
  }, [filteredAndSortedProjects, setupIntersectionObserver]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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

  // フィルターの表示監視（プロジェクトセクションが表示されている時のみ）
  useEffect(() => {
    const checkFilterVisibility = () => {
      const projectsSection = document.getElementById('projects-section');
      if (!projectsSection) return;

      const rect = projectsSection.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      setIsFilterVisible(isVisible);
    };

    const handleScroll = () => {
      checkFilterVisibility();
    };

    window.addEventListener('scroll', handleScroll);
    checkFilterVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTechnologyChange = (tech: string, checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedTechnologies(prev => [...prev, tech]);
    } else {
      setSelectedTechnologies(prev => prev.filter(t => t !== tech));
    }
  };

  const clearFilters = () => {
    setSelectedTechnologies([]);
    setSortBy('newest');
  };

  return (
    <>
      {/* フローティングフィルター */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            {/* フィルターボタン */}
            <motion.button
              onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
              className="bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-full p-4 shadow-2xl hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200 mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSidebarMinimized ? (
                <Filter className="h-6 w-6 text-slate-800 dark:text-white" />
              ) : (
                <X className="h-6 w-6 text-slate-800 dark:text-white" />
              )}
            </motion.button>

            {/* フィルターパネル */}
            <AnimatePresence>
              {!isSidebarMinimized && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl w-80 md:w-96 max-h-[70vh] min-h-96 pt-6 pb-6 px-6"
                  style={{ marginBottom: '60px', marginRight: '0px' }}
                >
                  {/* ヘッダー */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-800 dark:text-white">フィルター</h3>
                    </div>
                  </div>

                  <div className="space-y-6 overflow-y-auto max-h-[calc(70vh-120px)]">
                    {/* 技術スタックフィルター */}
                    <Collapsible open={isTechFilterOpen} onOpenChange={setIsTechFilterOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-colors backdrop-blur-sm">
                        <span className="font-medium text-slate-800 dark:text-white">技術</span>
                        {isTechFilterOpen ? <ChevronUp className="h-4 w-4 text-slate-800 dark:text-white" /> : <ChevronDown className="h-4 w-4 text-slate-800 dark:text-white" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-3 max-h-64 overflow-y-auto">
                          <div className="space-y-3">
                            {allTechnologies.map((tech) => (
                              <div key={tech} className="flex items-center space-x-3">
                                <Checkbox
                                  id={`floating-tech-${tech}`}
                                  checked={selectedTechnologies.includes(tech)}
                                  onCheckedChange={(checked) => handleTechnologyChange(tech, checked)}
                                  className="border-slate-600 dark:border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                                <Label 
                                  htmlFor={`floating-tech-${tech}`} 
                                  className="text-sm cursor-pointer flex-1 text-slate-800 dark:text-white flex items-center gap-2"
                                >
                                  <SkillIcon skill={tech} size={16} />
                                  {tech}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* ソートフィルター */}
                    <Collapsible open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-colors backdrop-blur-sm">
                        <span className="font-medium text-slate-800 dark:text-white">並び順</span>
                        {isSortFilterOpen ? <ChevronUp className="h-4 w-4 text-slate-800 dark:text-white" /> : <ChevronDown className="h-4 w-4 text-slate-800 dark:text-white" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-3">
                          <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-3">
                            {[
                              { value: 'newest', label: '新しい順' },
                              { value: 'oldest', label: '古い順' },
                              { value: 'title', label: 'タイトル順' }
                            ].map((option) => (
                              <div 
                                key={option.value} 
                                className="flex items-center space-x-3"
                              >
                                <RadioGroupItem 
                                  value={option.value} 
                                  id={`floating-sort-${option.value}`}
                                  className="border-slate-600 dark:border-slate-400 text-blue-500"
                                />
                                <Label 
                                  htmlFor={`floating-sort-${option.value}`} 
                                  className="text-sm cursor-pointer flex-1 text-slate-800 dark:text-white"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* フィルタークリア */}
                    <button
                      onClick={clearFilters}
                      className="w-full p-3 bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-500 hover:to-pink-600 rounded-xl text-white font-medium transition-all duration-200 backdrop-blur-sm"
                    >
                      フィルターをクリア
                    </button>

                    {/* 結果件数 */}
                    <div className="text-center text-slate-600 dark:text-slate-300 text-sm">
                      {filteredAndSortedProjects.length}件の実績
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* プロジェクト一覧セクション */}
      <section id="projects-section" className="py-20 px-4 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-cyan-50/30 dark:from-violet-950/10 dark:via-blue-950/5 dark:to-cyan-950/10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
                <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white drop-shadow-sm">Projects Portfolio</h2>
                <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 mx-auto">
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
                <div className="text-center py-12 text-slate-600 dark:text-slate-400">
                  条件に一致する実績がありません
                </div>
              ) : (
                <div id="projects-grid" className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredAndSortedProjects.map((project: Project) => {
                      // スマホでスクロール時の表示状態を判定
                      const isVisibleOnMobile = isMobile && visibleCards.has(project.id);
                      const shouldShowEffect = !isMobile || isVisibleOnMobile;
                      
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
                                  />
                                  {/* 注目バッジ - 画像右上に配置 */}
                                  {project.is_featured && (
                                    <div className="absolute top-3 right-3 z-10">
                                      <Badge 
                                        variant="secondary" 
                                        className="bg-yellow-500 text-white shadow-lg backdrop-blur-sm border-0 font-semibold"
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
                              
                              {/* ボタンセクション - 最下部に固定 */}
                              <div className="flex gap-2 mt-auto">
                                <Link href={`/projects/detail/${project.id}`} className="flex-1">
                                  <Button variant="outline" className="w-full">
                                    詳細を見る
                                  </Button>
                                </Link>
                                {project.project_url && (
                                  <Button variant="outline" size="icon" asChild>
                                    <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                                {project.github_url && (
                                  <Button variant="outline" size="icon" asChild>
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                      <Github className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}