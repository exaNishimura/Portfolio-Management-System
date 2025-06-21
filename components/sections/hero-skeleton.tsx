'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

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

export function HeroSkeleton() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
      <motion.div 
        className="container mx-auto max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* 左側: プロフィール情報スケルトン */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            
            {/* SNSリンクスケルトン */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </motion.div>

          {/* 右側: スキル情報スケルトン */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-6 w-32" />
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 max-w-20"></div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-20" />
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
} 