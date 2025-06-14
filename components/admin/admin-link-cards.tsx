import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, Tag, Settings } from 'lucide-react';

interface AdminLinkCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminLinks: AdminLinkCard[] = [
  {
    title: 'プロフィール管理',
    description: 'プロフィール情報の編集・更新',
    href: '/admin/profile',
    icon: User,
  },
  {
    title: '案件管理',
    description: 'ポートフォリオ案件の追加・編集',
    href: '/admin/projects',
    icon: Briefcase,
  },
  {
    title: 'カテゴリ管理',
    description: '案件カテゴリの管理・設定',
    href: '/admin/categories',
    icon: Tag,
  },
  {
    title: 'サイト設定',
    description: 'サイト全体の設定・管理',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLinkCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {adminLinks.map((link) => {
        const IconComponent = link.icon;
        return (
          <Link key={link.href} href={link.href} className="block">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {link.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
} 