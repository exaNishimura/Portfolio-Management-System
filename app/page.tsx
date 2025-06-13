

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Code2, 
  Globe, 
  Smartphone, 
  Zap,
  Star,
  ExternalLink,
  Github
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Project, Category } from '@/types';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 注目プロジェクトを取得
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        // カテゴリを取得
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });

        setFeaturedProjects(projects || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/50">
        <motion.div 
          className="container mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Web Developer
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2 text-muted-foreground">
              Portfolio Site
            </h2>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            WordPress、Next.js、Reactを使用したWebサイト・アプリケーション開発を行っています。
            クライアントのニーズに応じた最適なソリューションを提供いたします。
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto">
                制作実績を見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                お問い合わせ
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                提供サービス
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                モダンな技術を使用して、高品質なWebサイト・アプリケーションを制作いたします
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Globe,
                  title: "Webサイト制作",
                  description: "WordPress、HTML/CSSを使用したレスポンシブサイト制作"
                },
                {
                  icon: Code2,
                  title: "フロントエンド開発",
                  description: "React、Next.jsを使用したモダンなWebアプリケーション開発"
                },
                {
                  icon: Smartphone,
                  title: "レスポンシブデザイン",
                  description: "すべてのデバイスで最適な表示を実現するレスポンシブデザイン"
                },
                {
                  icon: Zap,
                  title: "パフォーマンス最適化",
                  description: "高速表示とSEO対策を考慮した最適化"
                }
              ].map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="text-center">
                      <service.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 注目プロジェクトセクション */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                注目の制作実績
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                これまでに制作したプロジェクトの中から、特に注目のものをご紹介します
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">読み込み中...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project, index) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            注目
                          </Badge>
                          <Badge variant="outline">
                            {project.project_year}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription>
                          {project.description}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          {project.project_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a 
                                href={project.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                サイト
                              </a>
                            </Button>
                          )}
                          {project.github_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a 
                                href={project.github_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Github className="h-3 w-3 mr-1" />
                                コード
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div variants={itemVariants} className="text-center mt-12">
              <Link href="/projects">
                <Button size="lg" variant="outline">
                  すべての制作実績を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 技術スタックセクション */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                技術カテゴリ
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                様々な技術を使用してプロジェクトを進行しています
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link href={`/projects/${category.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                      <CardHeader className="text-center">
                        <div className="h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                          <Code2 className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center">
                          {category.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}