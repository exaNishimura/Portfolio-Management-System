'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { PortfolioSettings } from '@/types';


const formSchema = z.object({
  site_title: z.string().min(1, 'サイトタイトルは必須です'),
  site_image_url: z.string().optional(),
  contact_email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  contact_github: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  contact_website: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PortfolioSettingsFormProps {
  initialSettings: PortfolioSettings | null;
}

export default function PortfolioSettingsForm({ initialSettings }: PortfolioSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_title: initialSettings?.site_title || 'Portfolio Site',
      site_image_url: initialSettings?.site_image_url || '',
      contact_email: initialSettings?.contact_email || '',
      contact_github: initialSettings?.contact_github || '',
      contact_website: initialSettings?.contact_website || '',
      contact_phone: initialSettings?.contact_phone || '',
      contact_address: initialSettings?.contact_address || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/portfolio-settings', {
        method: initialSettings ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id: initialSettings?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('設定の保存に失敗しました');
      }

      toast.success('設定を保存しました');
      router.refresh();
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('設定の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* サイトタイトル */}
          <FormField
            control={form.control}
            name="site_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>サイトタイトル</FormLabel>
                <FormControl>
                  <Input placeholder="Portfolio Site" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* サイト画像URL */}
        <FormField
          control={form.control}
          name="site_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サイト画像URL（オプション）</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">連絡先情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* メールアドレス */}
            <FormField
              control={form.control}
              name="contact_email"
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

            {/* GitHub URL */}
            <FormField
              control={form.control}
              name="contact_github"
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

            {/* ウェブサイトURL */}
            <FormField
              control={form.control}
              name="contact_website"
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

            {/* 電話番号 */}
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電話番号</FormLabel>
                  <FormControl>
                    <Input placeholder="090-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 住所 */}
          <FormField
            control={form.control}
            name="contact_address"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>住所</FormLabel>
                <FormControl>
                  <Input placeholder="東京都渋谷区..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : '設定を保存'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 