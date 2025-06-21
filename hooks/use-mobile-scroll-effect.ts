import { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '@/types';
import { INTERSECTION_OBSERVER_CONFIG, BREAKPOINTS } from '@/lib/constants/projects';

interface UseMobileScrollEffectProps {
  projects: Project[];
}

export function useMobileScrollEffect({ projects }: UseMobileScrollEffectProps) {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
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
            newVisibleCards.add(cardId);
          } else {
            newVisibleCards.delete(cardId);
          }
        });

        setVisibleCards(newVisibleCards);
      },
      {
        root: null,
        rootMargin: INTERSECTION_OBSERVER_CONFIG.rootMargin,
        threshold: INTERSECTION_OBSERVER_CONFIG.threshold
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
    if (projects.length > 0) {
      const timer = setTimeout(setupIntersectionObserver, 100);
      return () => clearTimeout(timer);
    }
  }, [projects, setupIntersectionObserver]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // カードが表示中かどうかを判定
  const isCardVisible = (projectId: string) => {
    return isMobile && visibleCards.has(projectId);
  };

  // エフェクトを適用すべきかどうかを判定
  // PC版では常にfalse、モバイル版でのみスクロール位置に基づいてtrue/false
  const shouldShowEffect = (projectId: string) => {
    return isMobile && isCardVisible(projectId);
  };

  return {
    isMobile,
    isCardVisible,
    shouldShowEffect
  };
} 