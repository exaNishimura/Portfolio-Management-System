'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { ProjectSkeleton } from '@/components/project-skeleton';
import { ProjectCard } from '@/components/projects/project-card';
import { FloatingFilter } from '@/components/projects/floating-filter';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useProjectsFilter } from '@/hooks/use-projects-filter';
import { useMobileScrollEffect } from '@/hooks/use-mobile-scroll-effect';
import { useFilterUIState } from '@/hooks/use-filter-ui-state';
import { ANIMATION_VARIANTS } from '@/lib/constants/projects';

interface ProjectsSectionProps {
  projects: Project[];
  isLoading?: boolean;
}

export function ProjectsSection({ projects, isLoading = false }: ProjectsSectionProps) {
  // カスタムフックを使用して状態管理を分離
  const {
    selectedTechnologies,
    sortBy,
    setSortBy,
    allTechnologies,
    filteredAndSortedProjects,
    handleTechnologyChange,
    clearFilters
  } = useProjectsFilter({ projects });

  const { shouldShowEffect } = useMobileScrollEffect({ 
    projects: filteredAndSortedProjects 
  });

  const {
    isFilterVisible,
    isTechFilterOpen,
    setIsTechFilterOpen,
    isSortFilterOpen,
    setIsSortFilterOpen,
    isSidebarMinimized,
    setIsSidebarMinimized
  } = useFilterUIState();

  return (
    <>
      {/* フローティングフィルター */}
      <AnimatePresence>
        <FloatingFilter
          isVisible={isFilterVisible}
          isSidebarMinimized={isSidebarMinimized}
          setIsSidebarMinimized={setIsSidebarMinimized}
          isTechFilterOpen={isTechFilterOpen}
          setIsTechFilterOpen={setIsTechFilterOpen}
          isSortFilterOpen={isSortFilterOpen}
          setIsSortFilterOpen={setIsSortFilterOpen}
          allTechnologies={allTechnologies}
          selectedTechnologies={selectedTechnologies}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filteredCount={filteredAndSortedProjects.length}
          onTechnologyChange={handleTechnologyChange}
          onClearFilters={clearFilters}
        />
      </AnimatePresence>

      {/* プロジェクト一覧セクション */}
      <section 
        id="projects-section" 
        className="py-20 px-4 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-cyan-50/30 dark:from-violet-950/10 dark:via-blue-950/5 dark:to-cyan-950/10"
        style={{ opacity: 1, visibility: 'visible' }}
      >
        <div className="container mx-auto max-w-7xl">
                      <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={ANIMATION_VARIANTS.container}
          >
            {/* セクションヘッダー */}
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center mb-12">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
                <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white drop-shadow-sm">
                  Projects Portfolio
                </h2>
                <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 mx-auto">
                これまでに制作したプロジェクトをご覧いただけます。技術スタック別にフィルタリングも可能です。
              </p>
            </motion.div>

            {/* プロジェクト一覧 */}
            <motion.div 
              variants={ANIMATION_VARIANTS.item} 
              className="w-full"
              layout
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                                  <div className="space-y-8">
                    <div className="flex items-center justify-center py-12">
                      <LoadingSpinner size="sm" text="実績を読み込み中..." variant="dots" />
                    </div>
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <ProjectSkeleton key={index} />
                    ))}
                  </div>
                </div>
              ) : filteredAndSortedProjects.length === 0 ? (
                <div className="text-center py-12 text-slate-600 dark:text-slate-400">
                  条件に一致する実績がありません
                </div>
              ) : (
                <div 
                  id="projects-grid" 
                  className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredAndSortedProjects.map((project: Project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        selectedTechnologies={selectedTechnologies}
                        shouldShowEffect={shouldShowEffect(project.id)}
                        onTechnologyChange={handleTechnologyChange}
                      />
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