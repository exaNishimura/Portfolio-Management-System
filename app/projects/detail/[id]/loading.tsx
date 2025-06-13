import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailLoading() {
  return (
    <main className="p-8">
      <Card className="p-6 max-w-xl mx-auto">
        <Skeleton className="h-56 w-full mb-4" />
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </Card>
    </main>
  );
} 