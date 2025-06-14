import { createClient } from '@/utils/supabase/server';
import { Profile, ProfileFormData } from '@/lib/types/database';

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('プロフィール取得エラー:', error);
    return null;
  }

  return data;
}

export async function createProfile(profileData: ProfileFormData): Promise<Profile> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      ...profileData,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('プロフィール作成エラー:', error);
    throw new Error('プロフィールの作成に失敗しました');
  }

  return data;
}

export async function updateProfile(id: string, profileData: Partial<ProfileFormData>): Promise<Profile> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('プロフィール更新エラー:', error);
    throw new Error('プロフィールの更新に失敗しました');
  }

  return data;
}

export async function upsertProfile(profileData: ProfileFormData): Promise<Profile> {
  const supabase = await createClient();
  
  // 既存のプロフィールを確認
  const existingProfile = await getProfile();
  
  if (existingProfile) {
    // 更新
    return updateProfile(existingProfile.id, profileData);
  } else {
    // 新規作成
    return createProfile(profileData);
  }
} 