
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <main className="p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">管理者ログイン</h1>
      <Button onClick={handleLogin} variant="default">
        Googleでログイン
      </Button>
    </main>
  );
} 