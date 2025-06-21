const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@radix-ui/react-avatar', 
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'react-hook-form',
      'zod',
      'recharts',
      'date-fns',
      'embla-carousel-react'
    ],
    optimizeServerReact: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // JavaScriptの実行時間削減のための最適化
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // フレームワーク関連を分離
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          // UI ライブラリを分離
          radixui: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radixui',
            priority: 30,
            chunks: 'all',
            maxSize: 150000,
          },
          // 重いライブラリを分離
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 25,
            chunks: 'all',
          },
          // データベースライブラリを分離
          database: {
            test: /[\\/]node_modules[\\/](pg|@supabase\/supabase-js)[\\/]/,
            name: 'database',
            priority: 20,
            chunks: 'all',
          },
          // その他のvendorライブラリ
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            maxSize: 200000,
          },
          // 共通コード
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            enforce: true,
            maxSize: 100000,
          },
        },
      },
      // ミニファイ最適化
      minimize: !dev,
      sideEffects: false,
    };

    // Tree shaking とパフォーマンス最適化
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/components': require('path').resolve('./components'),
        '@/lib': require('path').resolve('./lib'),
        '@/hooks': require('path').resolve('./hooks'),
        '@/dal': require('path').resolve('./dal'),
        '@/types': require('path').resolve('./types'),
      };

      // 不要なpolyfillを削除
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }

    // プロダクションでのさらなる最適化
    if (!dev) {
      // 重複チェック
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 25,
        })
      );

      // モジュール連結
      config.optimization.concatenateModules = true;
      
      // Tree shakingの代替最適化
      config.optimization.innerGraph = true;
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || 'your-project.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年間キャッシュ
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
