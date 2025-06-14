import { Suspense } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { PortfolioSettings } from '@/types';
import PortfolioSettingsForm from './settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function SettingsData() {
  const supabase = await getSupabaseClient();
  
  const { data: settingsRaw, error } = await supabase
    .from('portfolio_settings')
    .select('*')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Settings error:', error);
  }
  
  const settings: PortfolioSettings | null = settingsRaw;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ポートフォリオ設定</h1>
        <p className="text-muted-foreground">
          サイトのタイトル、アイコン、連絡先情報を管理できます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本設定</CardTitle>
          <CardDescription>
            サイトの基本情報と連絡先を設定してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioSettingsForm initialSettings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">ポートフォリオ設定</h1>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    }>
      <SettingsData />
    </Suspense>
  );
} 