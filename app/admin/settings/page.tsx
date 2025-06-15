import PortfolioSettingsForm from './settings-form';
import { getSupabaseClient } from '@/lib/supabase';
import { PortfolioSettings } from '@/types';

export const dynamic = 'force-dynamic';

export default async function SettingsManagePage() {
  const supabase = await getSupabaseClient();
  
  const { data: settings, error } = await supabase
    .from('portfolio_settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Portfolio settings error:', error);
  }

  const portfolioSettings: PortfolioSettings | null = settings || null;

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">サイト設定</h1>
        <p className="text-muted-foreground">
          ポートフォリオサイト全体の設定を管理します。
        </p>
      </div>

      <div className="max-w-4xl">
        <PortfolioSettingsForm initialSettings={portfolioSettings} />
      </div>
    </main>
  );
} 