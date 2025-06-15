import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Star, 
  Clock, 
  Tag,
  TrendingUp,
  Activity
} from 'lucide-react';
import { DashboardStats } from '@/dal/dashboard';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      title: '総案件数',
      value: stats.totalProjects,
      icon: FolderOpen,
      description: '登録されている全プロジェクト'
    },
    {
      title: '技術カテゴリ',
      value: stats.totalCategories,
      icon: Tag,
      description: '使用されている技術スタック数'
    },
    {
      title: '注目プロジェクト',
      value: stats.featuredProjects,
      icon: Star,
      description: 'フィーチャーされているプロジェクト'
    },
    {
      title: '最近の更新',
      value: stats.recentProjects,
      icon: Clock,
      description: '30日以内に更新されたプロジェクト'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 relative">
              {/* 背景の超大きなアイコン */}
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Icon className="h-32 w-32 text-muted-foreground" />
              </div>
              
              {/* メインコンテンツ */}
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold tracking-tight">
                        {item.value.toLocaleString()}
                      </p>
                      {item.title === '注目プロジェクト' && item.value > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          注目
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                
                {/* 進捗インジケーター（オプション） */}
                {item.title === '総案件数' && item.value > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1.5" />
                      <span>ポートフォリオ構築中</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 