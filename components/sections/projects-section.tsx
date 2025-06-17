'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ExternalLink, 
  Github, 
  Star, 
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { Project } from '@/types';
import { ProjectSkeleton } from '@/components/project-skeleton';

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
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [filterTopPosition, setFilterTopPosition] = useState('50%');
  const [isTechFilterOpen, setIsTechFilterOpen] = useState(false);
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);

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

  // スクロール監視
  useEffect(() => {
    const checkFilterVisibility = () => {
      const projectsSection = document.getElementById('projects-section');
      if (!projectsSection) return;

      const rect = projectsSection.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (isVisible && !isFilterSticky) {
        setIsFilterSticky(true);
      } else if (!isVisible && isFilterSticky) {
        setIsFilterSticky(false);
      }
    };

    const handleScroll = () => {
      checkFilterVisibility();
      
      const projectsSection = document.getElementById('projects-section');
      if (!projectsSection) return;

      const rect = projectsSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        const scrollProgress = Math.abs(rect.top) / (sectionHeight - viewportHeight);
        const topPosition = Math.max(10, Math.min(90, 10 + scrollProgress * 80));
        setFilterTopPosition(`${topPosition}%`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkFilterVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFilterSticky]);

  const handleTechnologyChange = (tech: string, checked: boolean | 'indeterminate') => {
    if (checked === 'indeterminate') return;
    
    setSelectedTechnologies(prev => {
      if (checked) {
        return [...prev, tech];
      } else {
        return prev.filter(t => t !== tech);
      }
    });
  };

  const clearFilters = () => {
    setSelectedTechnologies([]);
    setSortBy('newest');
    setIsTechFilterOpen(false);
    setIsSortFilterOpen(false);
  };

  return (
    <>
      {/* 固定フィルタータブ */}
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
                      <Filter className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-sm">フィルター</span>
                    </div>
                    <div className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                      {filteredAndSortedProjects.length}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* フィルター内容（展開時の表示） */}
              <AnimatePresence>
                {!isSidebarMinimized && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 space-y-6"
                  >
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-blue-400" />
                        <h3 className="font-semibold text-lg">フィルター</h3>
                      </div>
                      <button
                        onClick={() => setIsSidebarMinimized(true)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </div>

                    {/* 技術スタックフィルター */}
                    <Collapsible open={isTechFilterOpen} onOpenChange={setIsTechFilterOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                        <span className="font-medium">技術スタック</span>
                        {isTechFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <motion.div 
                          className="mt-3 space-y-3 max-h-48 overflow-y-auto"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {allTechnologies.map((tech) => (
                            <motion.div 
                              key={tech} 
                              className="flex items-center space-x-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Checkbox
                                id={`tech-${tech}`}
                                checked={selectedTechnologies.includes(tech)}
                                onCheckedChange={(checked) => handleTechnologyChange(tech, checked)}
                                className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                              />
                              <Label 
                                htmlFor={`tech-${tech}`} 
                                className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                              >
                                <SkillIcon skill={tech} size={16} />
                                {tech}
                              </Label>
                            </motion.div>
                          ))}
                        </motion.div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* ソートフィルター */}
                    <Collapsible open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                        <span className="font-medium">並び順</span>
                        {isSortFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <motion.div 
                          className="mt-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-3">
                            {[
                              { value: 'newest', label: '新しい順' },
                              { value: 'oldest', label: '古い順' },
                              { value: 'title', label: 'タイトル順' }
                            ].map((option) => (
                              <motion.div 
                                key={option.value} 
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <RadioGroupItem 
                                  value={option.value} 
                                  id={`sort-${option.value}`}
                                  className="border-slate-400 text-blue-500"
                                />
                                <Label 
                                  htmlFor={`sort-${option.value}`} 
                                  className="text-sm cursor-pointer flex-1"
                                >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                            <div 
                              className="line-clamp-3 text-base mt-2 text-muted-foreground"
                              dangerouslySetInnerHTML={{ __html: parseMarkdown(project.description || '') }}
                            />
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
    </>
  );
}