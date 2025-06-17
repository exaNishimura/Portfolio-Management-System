'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <motion.div 
        className="container mx-auto max-w-4xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white drop-shadow-sm">
              プロジェクトのご相談はお気軽に
            </h2>
            <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
          </div>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Webサイト制作やアプリケーション開発に関するご相談を承っております。
            お気軽にお問い合わせください。
          </p>
          <Link href="/contact">
            <Button size="lg">
              お問い合わせ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
} 