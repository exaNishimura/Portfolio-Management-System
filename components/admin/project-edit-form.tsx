'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/types';
import { ImageUpload } from './image-upload';
import MarkdownEditor from './markdown-editor';

const formSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  project_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  github_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, '少なくとも1つの技術を選択してください'),
  category: z.string().min(1, 'カテゴリは必須です'),
  is_featured: z.boolean().optional(),
  project_year: z.number().min(2000).max(2100).optional(),
  project_scale: z.enum(['small', 'medium', 'large']).optional(),
});

type FormData = z.infer<typeof formSchema>;

const categoryOptions = [
  { value: 'web', label: 'Webサイト' },
  { value: 'app', label: 'アプリケーション' },
  { value: 'system', label: 'システム開発' },
  { value: 'design', label: 'デザイン' },
  { value: 'other', label: 'その他' },
];

const scaleOptions = [
  { value: 'small', label: '小規模' },
  { value: 'medium', label: '中規模' },
  { value: 'large', label: '大規模' },
];

const commonTechnologies = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'Nest.js', 'Python', 'Django', 'FastAPI',
  'PHP', 'Laravel', 'WordPress', 'Java', 'Spring Boot',
  'C#', '.NET', 'Go', 'Rust', 'Ruby', 'Rails',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'Tailwind CSS', 'SCSS', 'Bootstrap', 'Material-UI', 'Chakra UI',
  'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD'
];

interface ProjectEditFormProps {
  project: Project;
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      description: project.description || '',
      images: project.images || (project.image_url ? [project.image_url] : []),
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      technologies: project.technologies || [],
      category: project.category,
      is_featured: project.is_featured || false,
      project_year: project.project_year || new Date().getFullYear(),
      project_scale: (project.project_scale as 'small' | 'medium' | 'large') || 'medium',
    },
  });

  const watchedTechnologies = form.watch('technologies');

  const addTechnology = (tech: string) => {
    const currentTechnologies = form.getValues('technologies');
    if (!currentTechnologies.includes(tech)) {
      form.setValue('technologies', [...currentTechnologies, tech]);
    }
    setNewTechnology('');
  };

  const removeTechnology = (techToRemove: string) => {
    const currentTechnologies = form.getValues('technologies');
    form.setValue('technologies', currentTechnologies.filter(tech => tech !== techToRemove));
  };

  const addCustomTechnology = () => {
    if (newTechnology.trim()) {
      addTechnology(newTechnology.trim());
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('プロジェクトの更新に失敗しました');
      }

      const result = await response.json();
      toast.success('プロジェクトを更新しました');
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error('Project update error:', error);
      toast.error('プロジェクトの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>
              プロジェクトの基本的な情報を入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* タイトル */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル *</FormLabel>
                    <FormControl>
                      <Input placeholder="プロジェクト名を入力" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* カテゴリ */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリ *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 説明（マークダウンエディター） */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="プロジェクトの詳細な説明をマークダウン形式で入力してください..."
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    マークダウン記法を使用して詳細な説明を記述できます
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* プロジェクト年度 */}
              <FormField
                control={form.control}
                name="project_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロジェクト年度</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2024"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* プロジェクト規模 */}
              <FormField
                control={form.control}
                name="project_scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロジェクト規模</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="規模を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {scaleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 注目プロジェクト */}
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">注目プロジェクト</FormLabel>
                    <FormDescription>
                      ホームページで優先的に表示されます
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>技術スタック</CardTitle>
            <CardDescription>
              使用した技術やツールを選択してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 選択済み技術 */}
            <div>
              <Label>選択済み技術</Label>
              <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md">
                {watchedTechnologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
                {watchedTechnologies.length === 0 && (
                  <span className="text-muted-foreground text-sm">技術を選択してください</span>
                )}
              </div>
            </div>

            {/* よく使用される技術 */}
            <div>
              <Label>よく使用される技術</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonTechnologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant={watchedTechnologies.includes(tech) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addTechnology(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* カスタム技術追加 */}
            <div>
              <Label>カスタム技術を追加</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="技術名を入力"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomTechnology();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addCustomTechnology}
                  disabled={!newTechnology.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="technologies"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>リンク・画像</CardTitle>
            <CardDescription>
              プロジェクトに関連するURLや画像を設定してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 画像アップロード */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロジェクト画像</FormLabel>
                  <FormControl>
                    <ImageUpload
                      images={field.value || []}
                      onImagesChange={field.onChange}
                      maxImages={5}
                    />
                  </FormControl>
                  <FormDescription>
                    プロジェクトの画像をアップロードしてください（最大5枚）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* プロジェクトURL */}
              <FormField
                control={form.control}
                name="project_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロジェクトURL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      実際のサイトやアプリのURL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GitHub URL */}
              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormDescription>
                      ソースコードのGitHubリポジトリURL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/projects')}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '更新中...' : 'プロジェクトを更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 