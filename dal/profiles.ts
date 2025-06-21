import { createClient } from '@/utils/supabase/server';
import { Profile } from '@/types';
import { debugLog, errorLog, safeAsync } from '@/lib/utils';

/**
 * プロフィール取得オプション
 */
export interface GetProfileOptions {
  /** 特定のフィールドのみ取得 */
  select?: string;
  /** Slackステータス情報を含める */
  includeSlackStatus?: boolean;
}

/**
 * プロフィール情報を取得
 * @param options - 取得オプション
 * @returns プロフィール情報またはnull
 */
export async function getProfile(options: GetProfileOptions = {}): Promise<Profile | null> {
  const { select = '*', includeSlackStatus = true } = options;
  
  debugLog('getProfile called', options);
  
  const [error, result] = await safeAsync(async () => {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('profiles')
        .select(select)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // プロフィールが見つからない場合
          return null;
        }
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      return data;
    } catch (cookieError) {
      // cookiesアクセスエラーの場合は静的生成のためnullを返す
      if (cookieError instanceof Error && 
          (cookieError.message.includes('cookies') || 
           cookieError.message.includes('Dynamic server usage'))) {
        debugLog('Cookie access error in static generation, returning null');
        return null;
      }
      throw cookieError;
    }
  });

  if (error) {
    errorLog('Failed to fetch profile', error, options);
    return null;
  }

  debugLog('getProfile result', { found: !!result });
  return result as Profile | null;
}

/**
 * プロフィール作成用データ型
 */
export type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;

/**
 * プロフィールを作成
 * @param profileData - プロフィールデータ
 * @returns 作成されたプロフィール
 */
export async function createProfile(profileData: ProfileFormData): Promise<Profile> {
  debugLog('createProfile called', { name: profileData.name });
  
  const [error, result] = await safeAsync(async () => {
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
      throw new Error(`Profile creation failed: ${error.message}`);
    }

    return data;
  });

  if (error) {
    errorLog('Failed to create profile', error, profileData);
    throw error;
  }

  debugLog('createProfile result', { id: result?.id });
  return result!;
}

/**
 * プロフィールを更新
 * @param id - プロフィールID
 * @param profileData - 更新データ
 * @returns 更新されたプロフィール
 */
export async function updateProfile(id: string, profileData: Partial<ProfileFormData>): Promise<Profile> {
  debugLog('updateProfile called', { id, fields: Object.keys(profileData) });
  
  const [error, result] = await safeAsync(async () => {
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
      throw new Error(`Profile update failed: ${error.message}`);
    }

    return data;
  });

  if (error) {
    errorLog('Failed to update profile', error, { id, profileData });
    throw error;
  }

  debugLog('updateProfile result', { id: result?.id });
  return result!;
}

/**
 * Slackステータスを更新
 * @param id - プロフィールID
 * @param slackData - Slackステータスデータ
 * @returns 更新されたプロフィール
 */
export async function updateSlackStatus(
  id: string,
  slackData: {
    slack_is_active?: boolean;
    slack_status_text?: string;
    slack_status_emoji?: string;
    slack_last_activity?: string;
  }
): Promise<Profile> {
  debugLog('updateSlackStatus called', { id, slackData });
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...slackData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Slack status update failed: ${error.message}`);
    }

    return data;
  });

  if (error) {
    errorLog('Failed to update Slack status', error, { id, slackData });
    throw error;
  }

  debugLog('updateSlackStatus result', { id: result?.id, active: slackData.slack_is_active });
  return result!;
}

/**
 * プロフィールが存在するかチェック
 * @returns プロフィールの存在有無
 */
export async function checkProfileExists(): Promise<boolean> {
  debugLog('checkProfileExists called');
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Profile existence check failed: ${error.message}`);
    }

    return (count || 0) > 0;
  });

  if (error) {
    errorLog('Failed to check profile existence', error);
    return false;
  }

  debugLog('checkProfileExists result', { exists: result });
  return result || false;
}

/**
 * プロフィールのupsert（存在する場合は更新、しない場合は作成）
 * @param profileData - プロフィールデータ
 * @returns 作成または更新されたプロフィール
 */
export async function upsertProfile(profileData: Partial<ProfileFormData>): Promise<Profile> {
  debugLog('upsertProfile called', { name: profileData.name });
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    // まず既存のプロフィールを確認
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .single();

    // デフォルト値を設定
    const dataWithDefaults = {
      name: '',
      title: null,
      bio: null,
      email: null,
      phone: null,
      location: null,
      website: null,
      github_url: null,
      linkedin_url: null,
      twitter_url: null,
      avatar_url: null,
      skills: [],
      experience_years: null,
      slack_user_id: null,
      slack_workspace_url: null,
      slack_display_name: null,
      slack_status_text: null,
      slack_status_emoji: null,
      slack_is_active: null,
      slack_last_activity: null,
      slack_webhook_url: null,
      ...profileData
    };

    if (existing) {
      // 更新
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...dataWithDefaults,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }

      return data;
    } else {
      // 作成
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...dataWithDefaults,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Profile creation failed: ${error.message}`);
      }

      return data;
    }
  });

  if (error) {
    errorLog('Failed to upsert profile', error, profileData);
    throw error;
  }

  debugLog('upsertProfile result', { id: result?.id });
  return result!;
} 