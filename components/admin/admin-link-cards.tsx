import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminLinkCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminLinks: AdminLinkCard[] = [
  // 管理機能カードは削除されました
];

export default function AdminLinkCards() {
  // カードが空の場合の表示
  if (adminLinks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          管理機能は準備中です
        </p>
      </div>
    );
  }

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