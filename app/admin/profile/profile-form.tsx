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
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { X, Plus, User } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  title: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().optional(),
  email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  github_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  linkedin_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  website_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  location: z.string().optional(),
  experience_years: z.number().min(0).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website?: string | null;
  location?: string | null;
  skills: string[];
  experience_years?: number | null;
  created_at: string;
  updated_at: string;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      image_url: '',
      email: '',
      github_url: '',
      linkedin_url: '',
      website_url: '',
      location: '',
      experience_years: 0,
    },
  });

  // プロフィールデータを読み込み
  const loadProfile = async () => {
    try {
      console.log('Loading profile data...');
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile data loaded:', profileData);
        setProfile(profileData);
        
        // スキルデータの処理（text[]型に対応）
        const profileSkills = Array.isArray(profileData.skills) 
          ? profileData.skills 
          : [];
        setSkills(profileSkills);
        
        // フォームに初期値を設定
        const formData = {
          name: profileData.name || '',
          title: profileData.title || '',
          bio: profileData.bio || '',
          image_url: profileData.avatar_url || '',
          email: profileData.email || '',
          github_url: profileData.github_url || '',
          linkedin_url: profileData.linkedin_url || '',
          website_url: profileData.website || '',
          location: profileData.location || '',
          experience_years: profileData.experience_years || 0,
        };
        
        console.log('Setting form data:', formData);
        console.log('Image URL being set:', formData.image_url);
        
        form.reset(formData);
        
        // 画像URLが設定されているか確認
        setTimeout(() => {
          const currentImageUrl = form.getValues('image_url');
          console.log('Current form image_url value:', currentImageUrl);
        }, 100);
        
      } else if (response.status === 404) {
        // プロフィールが存在しない場合は空のフォームを表示
        console.log('プロフィールが見つかりません。新規作成モードです。');
      }
    } catch (error) {
      console.error('プロフィール読み込みエラー:', error);
      toast.error('プロフィールの読み込みに失敗しました');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [form]);

  // 画像削除後の再読み込み処理
  const handleImageDeleteSuccess = async () => {
    console.log('Image deleted successfully, saving profile to update database...');
    
    // フォームの現在の値を取得
    const currentValues = form.getValues();
    
    // avatar_urlをnullに設定してフォームを保存
    const profileData = {
      name: currentValues.name,
      title: currentValues.title || undefined,
      bio: currentValues.bio || undefined,
      avatar_url: null, // 明示的にnullを設定
      email: currentValues.email || undefined,
      github_url: currentValues.github_url || undefined,
      linkedin_url: currentValues.linkedin_url || undefined,
      website: currentValues.website_url || undefined,
      location: currentValues.location || undefined,
      skills: skills,
      experience_years: currentValues.experience_years || undefined,
    };

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        console.log('Profile updated in database successfully');
        // プロフィールを再読み込み
        setIsLoadingData(true);
        await loadProfile();
      } else {
        console.error('Failed to update profile in database');
        toast.error('データベースの更新に失敗しました');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('データベースの更新中にエラーが発生しました');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // スキルを含めたデータを準備
      const profileData = {
        name: data.name,
        title: data.title || undefined,
        bio: data.bio || undefined,
        avatar_url: data.image_url || undefined,
        email: data.email || undefined,
        github_url: data.github_url || undefined,
        linkedin_url: data.linkedin_url || undefined,
        website: data.website_url || undefined,
        location: data.location || undefined,
        skills: skills,
        experience_years: data.experience_years || undefined,
      };

      // APIルートを呼び出し
      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'プロフィールの保存に失敗しました');
      }

      const savedProfile = await response.json();
      console.log('Profile saved:', savedProfile);
      
      toast.success('プロフィールを更新しました');
      
      // プロフィールデータを更新
      setProfile(prev => ({
        ...prev,
        ...savedProfile,
        skills: savedProfile.skills || []
      }));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'プロフィールの更新に失敗しました');
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
        <CardDescription>サイトに表示されるプロフィール情報を編集できます。</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">プロフィールを読み込み中...</p>
            </div>
          </div>
        ) : (
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
                      <Textarea placeholder="自己紹介文を入力してください" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>サイトのトップページに表示される自己紹介文です。</FormDescription>
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
                    <FormLabel>プロフィール画像</FormLabel>
                    <FormDescription>
                      {field.value && field.value.trim() !== "" ? (
                        <>
                          現在のプロフィール画像です。画像にマウスを重ねると差し替え・削除ボタンが表示されます。
                          <br />
                          対応形式: JPEG、PNG、WebP（最大5MB）
                        </>
                      ) : (
                        "プロフィール画像をアップロードしてください。JPEG、PNG、WebP形式（最大5MB）"
                      )}
                    </FormDescription>
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={(value) => field.onChange(value)} 
                        disabled={isLoading}
                        onDeleteSuccess={handleImageDeleteSuccess}
                      />
                    </FormControl>
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
                      <Input type="number" placeholder="5" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormDescription>Web開発の経験年数を入力してください。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* スキル */}
              <div className="space-y-4">
                <div>
                  <FormLabel>スキル</FormLabel>
                  <FormDescription>保有しているスキルを追加してください。</FormDescription>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="スキルを入力" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "更新中..." : "プロフィールを更新"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
} 