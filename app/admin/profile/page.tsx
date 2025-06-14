import { getProfile } from '@/dal/profiles';
import ProfileForm from './profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfileManagePage() {
  const profile = await getProfile();

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロフィール管理</h1>
        <p className="text-muted-foreground">
          ポートフォリオサイトに表示するプロフィール情報を管理します。
        </p>
      </div>

      <div className="max-w-4xl">
        <ProfileForm />
      </div>
    </main>
  );
} 