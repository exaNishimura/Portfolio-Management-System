'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Github, 
  MapPin,
  Calendar,
  Mail,
  MessageCircle
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
  const [slackStatus, setSlackStatus] = useState({
    is_active: profile.slack_is_active,
    status_text: profile.slack_status_text,
    status_emoji: profile.slack_status_emoji,
  });

  // Slackステータスを定期的に更新
  useEffect(() => {
    if (!profile.slack_user_id) return;

    const updateSlackStatus = async () => {
      try {
        // キャッシュ回避のためにタイムスタンプを追加
        const response = await fetch(`/api/slack/status?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.slack_connected && data.user) {
            setSlackStatus({
              is_active: data.user.is_active,
              status_text: data.user.status_text,
              status_emoji: data.user.status_emoji,
            });
          }
        }
      } catch (error) {
        console.error('Slackステータス更新エラー:', error);
      }
    };

    // 初回実行
    updateSlackStatus();

    // 1分ごとに更新
    const interval = setInterval(updateSlackStatus, 60 * 1000);

    return () => clearInterval(interval);
  }, [profile.slack_user_id]);

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
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-yellowtail bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{profile.name}</h1>
                  {/* Slackアクティブ状態インジケーター */}
                  {profile.slack_user_id && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${slackStatus.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      {profile.slack_workspace_url ? (
                        <a 
                          href={profile.slack_workspace_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                          {slackStatus.is_active ? 'オンライン' : '離席中'}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {slackStatus.is_active ? 'オンライン' : '離席中'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
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
            
            {/* Slackステータス詳細表示（氏名横に移動したため、詳細情報のみ表示） */}
            {profile.slack_user_id && slackStatus.status_text && (
              <div className="flex items-center gap-2 p-2 bg-white/30 dark:bg-gray-900/30 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  {slackStatus.status_emoji && <span className="text-base">{slackStatus.status_emoji}</span>}
                  <span>{slackStatus.status_text}</span>
                </div>
              </div>
            )}

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
              {profile.slack_workspace_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.slack_workspace_url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Slack
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