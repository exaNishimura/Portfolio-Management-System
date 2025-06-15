"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderOpen, 
  User, 
  Settings,
  LogOut,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'プロフィール管理',
    href: '/admin/profile',
    icon: User,
  },
  {
    name: '案件管理',
    href: '/admin/projects',
    icon: FolderOpen,
  },

  {
    name: '画像管理',
    href: '/admin/images',
    icon: ImageIcon,
  },
  {
    name: 'サイト設定',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 flex flex-col">
      {/* ロゴ・タイトル */}
      <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
        <h1 className="text-lg font-semibold">管理画面</h1>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* フッター */}
      <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          ログアウト
        </Button>
      </div>
    </div>
  );
} 