import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  User, 
  Activity as ActivityIcon,
  Clock
} from 'lucide-react';
import { ActivityLog } from '@/dal/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ActivityLogProps {
  activities: ActivityLog[];
}

export default function ActivityLogComponent({ activities }: ActivityLogProps) {
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'project':
        return FolderOpen;
      case 'profile':
        return User;
      case 'system':
        return ActivityIcon;
      default:
        return ActivityIcon;
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'project':
        return 'text-blue-600';
      case 'profile':
        return 'text-green-600';
      case 'system':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBadgeVariant = (type: ActivityLog['type']) => {
    switch (type) {
      case 'project':
        return 'default' as const;
      case 'profile':
        return 'secondary' as const;
      case 'system':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ja
      });
    } catch (error) {
      return '不明';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5" />
          最近の活動
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              まだ活動がありません
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type);
              const badgeVariant = getBadgeVariant(activity.type);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className={`p-2 rounded-full bg-muted`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                          {activity.action}
                        </p>
                        <Badge variant={badgeVariant} className="text-xs">
                          {activity.type === 'project' && 'プロジェクト'}
                          {activity.type === 'profile' && 'プロフィール'}
                          {activity.type === 'system' && 'システム'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatRelativeTime(activity.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 