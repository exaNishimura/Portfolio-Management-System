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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
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
      {/* フローティングフィルター - 画面右下に固定 */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* フィルターアイコン（画面右下に固定） */}
            <div className="absolute bottom-0 right-0 z-10">
              <div 
                className="p-3 cursor-pointer hover:bg-white/10 rounded-full transition-all duration-200"
                onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
              >
                <Filter className="h-6 w-6 text-slate-700 dark:text-white" />
              </div>
            </div>

            {/* フィルター内容パネル（展開時のみ表示） */}
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

                  <div className="space-y-6">
                    {/* 技術スタックフィルター */}
                    <Collapsible open={isTechFilterOpen} onOpenChange={setIsTechFilterOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-colors backdrop-blur-sm">
                        <span className="font-medium text-slate-800 dark:text-white">技術</span>
                        {isTechFilterOpen ? <ChevronUp className="h-4 w-4 text-slate-800 dark:text-white" /> : <ChevronDown className="h-4 w-4 text-slate-800 dark:text-white" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-3 max-h-64 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {allTechnologies.map((tech) => (
                              <Badge 
                                key={tech} 
                                variant={selectedTechnologies.includes(tech) ? "default" : "outline"} 
                                className={`text-xs px-3 py-1 cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                                  selectedTechnologies.includes(tech) 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                    : "bg-white dark:bg-black text-slate-800 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                                }`}
                                onClick={() => {
                                  handleTechnologyChange(tech, !selectedTechnologies.includes(tech));
                                }}
                              >
                                <SkillIcon skill={tech} size={12} />
                                {tech}
                              </Badge>
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
                        <Card className="group h-full flex flex-col overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out">
                          {/* 画像セクション */}
                          {((project.images && project.images.length > 0) || project.image_url) && (
                            <Link href={`/projects/detail/${project.id}`}>
                              <div className="relative w-full h-64 overflow-hidden">
                                <Image 
                                  src={(project.images && project.images.length > 0) ? project.images[0] : project.image_url!} 
                                  alt={project.title} 
                                  fill 
                                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
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
                              <CardTitle className="text-lg sm:text-xl line-clamp-2 mb-2">
                                {project.title}
                              </CardTitle>
                              <div 
                                className="line-clamp-3 text-base mt-2 text-muted-foreground mb-4"
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