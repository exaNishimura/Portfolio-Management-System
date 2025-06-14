"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { X, Plus, Upload, User } from 'lucide-react';
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  title: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  github_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  linkedin_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  website_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  location: z.string().optional(),
  experience_years: z.number().min(0).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ダミーデータ
const dummyProfile: Profile = {
  id: '1',
  name: 'Web Developer',
  title: 'フルスタック開発者',
  bio: 'WordPress、Next.js、Reactを使用したWebサイト・アプリケーション開発を行っています。クライアントのニーズに応じた最適なソリューションを提供いたします。',
  image_url: '',
  email: 'contact@example.com',
  github_url: 'https://github.com',
  linkedin_url: '',
  website_url: '',
  location: '日本',
  skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'WordPress', 'TypeScript'],
  experience_years: 5,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile>(dummyProfile);
  const [skills, setSkills] = useState<string[]>(dummyProfile.skills);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title || '',
      bio: profile.bio || '',
      image_url: profile.image_url || '',
      email: profile.email || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      website_url: profile.website_url || '',
      location: profile.location || '',
      experience_years: profile.experience_years || 0,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Supabaseに保存する処理を実装
      console.log('Profile data:', { ...data, skills });
      
      // ダミーの保存処理
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('プロフィールを更新しました');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          プロフィール情報
        </CardTitle>
        <CardDescription>
          サイトに表示されるプロフィール情報を編集できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前 *</FormLabel>
                    <FormControl>
                      <Input placeholder="名前を入力" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>肩書き</FormLabel>
                    <FormControl>
                      <Input placeholder="例: フルスタック開発者" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 自己紹介文 */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自己紹介文</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="自己紹介文を入力してください"
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    サイトのトップページに表示される自己紹介文です。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* プロフィール画像 */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロフィール画像URL</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="https://example.com/image.jpg"
                        {...field} 
                      />
                      {field.value && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={field.value}
                            alt="プロフィール画像プレビュー"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    プロフィール画像のURLを入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 連絡先情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>所在地</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 東京都" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SNS・ウェブサイト */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ウェブサイトURL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 経験年数 */}
            <FormField
              control={form.control}
              name="experience_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>経験年数</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Web開発の経験年数を入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* スキル */}
            <div className="space-y-4">
              <div>
                <FormLabel>スキル</FormLabel>
                <FormDescription>
                  保有しているスキルを追加してください。
                </FormDescription>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="スキルを入力"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '更新中...' : 'プロフィールを更新'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 