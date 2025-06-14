'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// バリデーションスキーマ
const resetSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        setError('パスワードリセットメールの送信に失敗しました。');
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError('パスワードリセットメールの送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">メールを送信しました</CardTitle>
              <CardDescription>
                パスワードリセット用のリンクをメールで送信しました
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  {form.getValues('email')} にパスワードリセット用のリンクを送信しました。
                  メールをご確認いただき、リンクをクリックしてパスワードを再設定してください。
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  メールが届かない場合は、迷惑メールフォルダもご確認ください。
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/admin/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      ログインに戻る
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsSuccess(false);
                      form.reset();
                    }}
                    className="flex-1"
                  >
                    再送信
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">パスワードリセット</CardTitle>
            <CardDescription>
              登録済みのメールアドレスを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="admin@example.com"
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    'リセットメールを送信'
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link href="/admin/login" className="text-sm text-primary hover:underline">
                <ArrowLeft className="mr-1 h-3 w-3 inline" />
                ログインに戻る
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
