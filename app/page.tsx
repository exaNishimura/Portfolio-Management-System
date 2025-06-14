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
import { getSupabaseClient } from '@/lib/supabase';
import { Project, Category } from '@/types';
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { HomeClient } from '@/components/home-client';
import { Suspense } from 'react';

async function ProjectsData() {
  const supabase = await getSupabaseClient();
  
  // 注目プロジェクト
  const { data: featuredProjectsRaw, error: featuredError } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
    .order('created_at', { ascending: false });
  
  if (featuredError) {
    console.error('Featured projects error:', featuredError);
  }
  
  const featuredProjects: Project[] = featuredProjectsRaw ?? [];

  // 全プロジェクト
  const { data: allProjectsRaw, error: allError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (allError) {
    console.error('All projects error:', allError);
  }
  
  const allProjects: Project[] = allProjectsRaw ?? [];

  // カテゴリ
  const { data: categoriesRaw, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });

  if (categoriesError) {
    console.error('Categories error:', categoriesError);
  }
  
  const categories: Category[] = categoriesRaw ?? [];

  console.log('Server - featuredProjects:', featuredProjects.length);
  console.log('Server - allProjects:', allProjects.length);
  console.log('Server - categories:', categories.length);

  return (
    <HomeClient 
      featuredProjects={featuredProjects}
      allProjects={allProjects}
      categories={categories}
      isLoading={false}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeClient featuredProjects={[]} allProjects={[]} categories={[]} isLoading={true} />}>
      <ProjectsData />
    </Suspense>
  );
}