
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const supabase = createClientComponentClient();

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