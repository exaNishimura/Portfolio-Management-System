import { createClient } from '@/utils/supabase/server';
import { SiteSetting, SiteSettingFormData } from '@/lib/types/database';

export async function getSettings(): Promise<SiteSetting[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) {
    console.error('設定取得エラー:', error);
    throw new Error('設定の取得に失敗しました');
  }

  return data || [];
}

export async function getSetting(key: string): Promise<SiteSetting | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error('設定取得エラー:', error);
    return null;
  }

  return data;
}

export async function getSettingValue(key: string): Promise<string | null> {
  const setting = await getSetting(key);
  return setting?.value || null;
}

export async function createSetting(settingData: SiteSettingFormData): Promise<SiteSetting> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .insert([{
      ...settingData,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('設定作成エラー:', error);
    throw new Error('設定の作成に失敗しました');
  }

  return data;
}

export async function updateSetting(key: string, settingData: Partial<SiteSettingFormData>): Promise<SiteSetting> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      ...settingData,
      updated_at: new Date().toISOString()
    })
    .eq('key', key)
    .select()
    .single();

  if (error) {
    console.error('設定更新エラー:', error);
    throw new Error('設定の更新に失敗しました');
  }

  return data;
}

export async function upsertSetting(settingData: SiteSettingFormData): Promise<SiteSetting> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .upsert([{
      ...settingData,
      updated_at: new Date().toISOString()
    }], {
      onConflict: 'key'
    })
    .select()
    .single();

  if (error) {
    console.error('設定保存エラー:', error);
    throw new Error('設定の保存に失敗しました');
  }

  return data;
}

export async function deleteSetting(key: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('site_settings')
    .delete()
    .eq('key', key);

  if (error) {
    console.error('設定削除エラー:', error);
    throw new Error('設定の削除に失敗しました');
  }
}

export async function getSettingsAsObject(): Promise<Record<string, string>> {
  const settings = await getSettings();
  const settingsObject: Record<string, string> = {};
  
  settings.forEach(setting => {
    if (setting.value !== null) {
      settingsObject[setting.key] = setting.value;
    }
  });
  
  return settingsObject;
} 