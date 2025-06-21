// プロジェクト関連の定数

export const SORT_OPTIONS = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' }
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];

// アニメーション設定
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
} as const;

// Intersection Observer 設定
export const INTERSECTION_OBSERVER_CONFIG = {
  rootMargin: '-20% 0px -20% 0px', // 画面の中央60%の範囲
  threshold: 0.3 // カードの30%が見えたら発動
} as const;

// ブレークポイント
export const BREAKPOINTS = {
  mobile: 768 // md breakpoint
} as const;

// ローカルストレージキー
export const STORAGE_KEYS = {
  techFilterOpen: 'techFilterOpen',
  sortFilterOpen: 'sortFilterOpen',
  sidebarMinimized: 'sidebarMinimized'
} as const; 