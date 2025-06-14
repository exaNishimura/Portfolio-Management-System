import { getSettings } from '@/dal/settings';
import SettingsForm from '@/components/admin/settings-form';

export const dynamic = 'force-dynamic';

export default async function SettingsManagePage() {
  const settings = await getSettings();

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">サイト設定</h1>
        <p className="text-muted-foreground">
          ポートフォリオサイト全体の設定を管理します。
        </p>
      </div>

      <div className="max-w-4xl">
        <SettingsForm settings={settings} />
      </div>
    </main>
  );
} 