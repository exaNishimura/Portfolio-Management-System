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
import { Project } from '@/types';
import { Profile } from '@/lib/types/database';
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { HomeClient } from '@/components/home-client';
import { Suspense } from 'react';

async function ProjectsData() {
  const supabase = await getSupabaseClient();
  
  // プロフィール情報を取得
  const { data: profileRaw, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();
  
  if (profileError) {
    console.error('Profile error:', profileError);
  }
  
  const profile: Profile | undefined = profileRaw ?? undefined;
  
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

  console.log('Server - profile:', profile?.name);
  console.log('Server - featuredProjects:', featuredProjects.length);
  console.log('Server - allProjects:', allProjects.length);

  return (
    <HomeClient 
      profile={profile}
      featuredProjects={featuredProjects}
      allProjects={allProjects}
      isLoading={false}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeClient profile={undefined} featuredProjects={[]} allProjects={[]} isLoading={true} />}>
      <ProjectsData />
    </Suspense>
  );
}