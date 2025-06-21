'use client';

import { useEffect } from 'react';

export function PerformanceOptimizations() {
  useEffect(() => {
    // 最小限のパフォーマンス監視のみ
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            // LCP metrics tracking (開発時のみ)
            if (process.env.NODE_ENV === 'development') {
              console.log('LCP:', entry.startTime);
            }
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        // 5秒後に自動停止（短縮）
        setTimeout(() => observer.disconnect(), 5000);
      } catch (error) {
        // PerformanceObserver エラーを無視
        console.warn('PerformanceObserver error:', error);
      }
    }
  }, []);

  return null;
} 