import { useState, useEffect, useMemo } from 'react';
import { Project } from '@/types';
import { SortOption } from '@/lib/constants/projects';

interface UseProjectsFilterProps {
  projects: Project[];
}

export function useProjectsFilter({ projects }: UseProjectsFilterProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

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
          // 制作年を優先、その後ポートフォリオ登録年月日を参照
          const aYear = a.project_year || 0;
          const bYear = b.project_year || 0;
          
          if (aYear !== bYear) {
            return bYear - aYear; // 制作年の新しい順
          }
          
          // 制作年が同じ場合はポートフォリオ登録年月日で比較
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          
        case 'oldest':
          // 制作年を優先、その後ポートフォリオ登録年月日を参照
          const aYearOld = a.project_year || 0;
          const bYearOld = b.project_year || 0;
          
          if (aYearOld !== bYearOld) {
            return aYearOld - bYearOld; // 制作年の古い順
          }
          
          // 制作年が同じ場合はポートフォリオ登録年月日で比較
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          
        default:
          return 0;
      }
    });

    return sorted;
  }, [projects, selectedTechnologies, sortBy]);

  // 技術スタック変更ハンドラー
  const handleTechnologyChange = (tech: string, checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedTechnologies(prev => [...prev, tech]);
    } else {
      setSelectedTechnologies(prev => prev.filter(t => t !== tech));
    }
  };

  // フィルタークリア
  const clearFilters = () => {
    setSelectedTechnologies([]);
    setSortBy('newest');
  };

  return {
    selectedTechnologies,
    sortBy,
    setSortBy,
    allTechnologies,
    filteredAndSortedProjects,
    handleTechnologyChange,
    clearFilters
  };
} 