'use client';

import { useEffect } from 'react';

export function PerformanceOptimizations() {
  useEffect(() => {
    // requestIdleCallbackを使用して非ブロッキング実行
    const optimize = () => {
      // Critical resourcesのプリロードを最小化
      const criticalImages = [
        '/placeholder-avatar.webp',
        '/placeholder-project.webp'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // 重要なドメインのみDNS prefetch
      const domains = [
        'https://images.unsplash.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // PerformanceObserver for LCP monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            // LCP metrics tracking
            console.log('LCP:', entry.startTime);
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // 10秒後に自動停止
      setTimeout(() => observer.disconnect(), 10000);
    }

    // アイドル時間での最適化実行
    if ('requestIdleCallback' in window) {
      requestIdleCallback(optimize, { timeout: 2000 });
    } else {
      setTimeout(optimize, 100);
    }
  }, []);

  return null;
} 