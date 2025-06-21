'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Profile } from '@/types';

const profileSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  title: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  github_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  linkedin_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  twitter_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  avatar_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  skills: z.string().optional(),
  experience_years: z.number().min(0).optional(),
  // Slack連携フィールド
  slack_user_id: z.string().optional(),
  slack_workspace_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  slack_display_name: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: Profile | null;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || '',
      title: initialData?.title || '',
      bio: initialData?.bio || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      location: initialData?.location || '',
      website: initialData?.website || '',
      github_url: initialData?.github_url || '',
      linkedin_url: initialData?.linkedin_url || '',
      twitter_url: initialData?.twitter_url || '',
      avatar_url: initialData?.avatar_url || '',
      skills: initialData?.skills?.join(', ') || '',
      experience_years: initialData?.experience_years || undefined,
      // Slack連携フィールド
      slack_user_id: initialData?.slack_user_id || '',
      slack_workspace_url: initialData?.slack_workspace_url || '',
      slack_display_name: initialData?.slack_display_name || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(Boolean) : [],
        email: data.email || undefined,
        website: data.website || undefined,
        github_url: data.github_url || undefined,
        linkedin_url: data.linkedin_url || undefined,
        twitter_url: data.twitter_url || undefined,
        avatar_url: data.avatar_url || undefined,
        // Slack連携フィールド
        slack_user_id: data.slack_user_id || undefined,
        slack_workspace_url: data.slack_workspace_url || undefined,
        slack_display_name: data.slack_display_name || undefined,
      };

      const response = await fetch('/api/admin/profile', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('プロフィールの保存に失敗しました');
      }

      toast.success('プロフィールを保存しました');
      router.refresh();
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
      toast.error('プロフィールの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール情報</CardTitle>
        <CardDescription>
          ポートフォリオサイトに表示されるプロフィール情報を入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前 *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="山田太郎"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">職業・肩書き</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="フルスタック開発者"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="あなたの経歴やスキル、興味について簡潔に説明してください。"
                rows={4}
              />
            </div>
          </div>

          {/* 連絡先情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">連絡先情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="090-1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">所在地</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="東京都"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">ウェブサイト</Label>
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* SNS・外部リンク */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SNS・外部リンク</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  {...register('github_url')}
                  placeholder="https://github.com/username"
                />
                {errors.github_url && (
                  <p className="text-sm text-destructive">{errors.github_url.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  {...register('linkedin_url')}
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin_url && (
                  <p className="text-sm text-destructive">{errors.linkedin_url.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  {...register('twitter_url')}
                  placeholder="https://twitter.com/username"
                />
                {errors.twitter_url && (
                  <p className="text-sm text-destructive">{errors.twitter_url.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">プロフィール画像URL</Label>
                <Input
                  id="avatar_url"
                  {...register('avatar_url')}
                  placeholder="https://example.com/avatar.jpg"
                />
                {errors.avatar_url && (
                  <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Slack連携設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Slack連携設定</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slack_user_id">SlackユーザーID</Label>
                <Input
                  id="slack_user_id"
                  {...register('slack_user_id')}
                  placeholder="U1234567890"
                />
                <p className="text-xs text-muted-foreground">
                  SlackのユーザーIDを入力してください（例: U1234567890）
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slack_workspace_url">SlackワークスペースURL</Label>
                <Input
                  id="slack_workspace_url"
                  {...register('slack_workspace_url')}
                  placeholder="https://yourworkspace.slack.com"
                />
                {errors.slack_workspace_url && (
                  <p className="text-sm text-destructive">{errors.slack_workspace_url.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slack_display_name">Slack表示名</Label>
                <Input
                  id="slack_display_name"
                  {...register('slack_display_name')}
                  placeholder="山田太郎"
                />
                <p className="text-xs text-muted-foreground">
                  Slackでの表示名（自動取得されますが、手動で設定も可能）
                </p>
              </div>
            </div>
          </div>

          {/* スキル・経験 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">スキル・経験</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skills">スキル（カンマ区切り）</Label>
                <Input
                  id="skills"
                  {...register('skills')}
                  placeholder="JavaScript, React, Node.js, Python"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_years">経験年数</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  {...register('experience_years', { valueAsNumber: true })}
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : 'プロフィールを保存'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 