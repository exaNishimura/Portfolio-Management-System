'use client';

import { useEffect } from 'react';

export function PerformanceOptimizations() {
  useEffect(() => {
    // Critical resources preload
    const preloadCriticalResources = () => {
      // Preload important images
      const criticalImages = [
        '/placeholder-avatar.jpg',
        '/placeholder-project.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // DNS prefetch for external domains
    const dnsPrefetch = () => {
      const domains = [
        'https://images.unsplash.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();
    dnsPrefetch();

    // Intersection Observer for lazy loading improvements
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.loading = 'eager';
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));

      return () => {
        lazyImages.forEach(img => imageObserver.unobserve(img));
      };
    }
  }, []);

  return null;
} 