'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Github, 
  MapPin,
  Calendar,
  Mail
} from 'lucide-react';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { Profile } from '@/lib/types/database';

interface HeroSectionProps {
  profile: Profile;
  featuredProjects: any[]; // 使用しないが、互換性のため残す
}

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



// キラキラエフェクトのアニメーション設定
const shimmerVariants = {
  initial: {
    x: '-150%',
    y: '-150%',
    opacity: 0
  },
  animate: {
    x: '150%',
    y: '150%',
    opacity: [0, 0.8, 0],
    transition: {
      duration: 2,
      ease: 'linear' as const,
      repeat: Infinity,
      repeatDelay: 3
    }
  }
};

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
      <motion.div 
        className="container mx-auto max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* 左側: プロフィール情報 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-violet-200 dark:ring-violet-800 shadow-xl shadow-violet-500/10">
                <Image 
                  src={profile.avatar_url || '/placeholder-avatar.jpg'} 
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
                {/* キラキラエフェクト - 斜め光 */}
                <motion.div
                  className="absolute inset-0 [--shimmer-opacity:1] dark:[--shimmer-opacity:0.5]"
                  style={{
                    background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
                    transform: 'rotate(-45deg)',
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%',
                    filter: 'blur(1px)',
                    opacity: 'var(--shimmer-opacity, 1)'
                  }}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
                {/* 追加のキラキラ効果 */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-white/60 dark:bg-white/40 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: 1
                  }}
                />
                <motion.div
                  className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/50 dark:bg-white/30 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 5,
                    delay: 2.5
                  }}
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-yellowtail bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{profile.name}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 ml-2">{profile.title}</p>
              </div>
            </div>
            
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.experience_years && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{profile.experience_years}年の経験</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
            
            {/* SNSリンク */}
            <div className="flex flex-wrap gap-3">
              {profile.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {profile.linkedin_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ウェブサイト
                  </a>
                </Button>
              )}
              {profile.twitter_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </motion.div>

          {/* 右側: スキル情報 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Core Skills</h2>
              <div className="flex-1 h-px bg-black dark:bg-white opacity-30 max-w-20"></div>
            </div>
            
                          <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <SkillIcon skill={skill} size={16} />
                    {skill}
                  </Badge>
                ))}
              </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
} 