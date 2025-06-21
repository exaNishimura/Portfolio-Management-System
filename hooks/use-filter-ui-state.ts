import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants/projects';

export function useFilterUIState() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isTechFilterOpen, setIsTechFilterOpen] = useState(false);
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);

  // フィルター開閉状態をlocalStorageから復元
  useEffect(() => {
    const savedTechFilterOpen = localStorage.getItem(STORAGE_KEYS.techFilterOpen);
    const savedSortFilterOpen = localStorage.getItem(STORAGE_KEYS.sortFilterOpen);
    const savedSidebarMinimized = localStorage.getItem(STORAGE_KEYS.sidebarMinimized);
    
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
    localStorage.setItem(STORAGE_KEYS.techFilterOpen, JSON.stringify(isTechFilterOpen));
  }, [isTechFilterOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sortFilterOpen, JSON.stringify(isSortFilterOpen));
  }, [isSortFilterOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sidebarMinimized, JSON.stringify(isSidebarMinimized));
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

  return {
    isFilterVisible,
    isTechFilterOpen,
    setIsTechFilterOpen,
    isSortFilterOpen,
    setIsSortFilterOpen,
    isSidebarMinimized,
    setIsSidebarMinimized
  };
} 