import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getSlackUserInfo, getSlackUserPresence } from '@/lib/utils/slack-integration';

/**
 * Slackステータスを取得
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // プロフィール情報を取得
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }

    // Slack情報がない場合
    if (!profile.slack_user_id || !process.env.SLACK_BOT_TOKEN) {
      return NextResponse.json({
        slack_connected: false,
        message: 'Slack連携が設定されていません'
      });
    }

    // Slackからユーザー情報とプレゼンス情報を取得
    const [slackUser, presence] = await Promise.all([
      getSlackUserInfo(process.env.SLACK_BOT_TOKEN, profile.slack_user_id),
      getSlackUserPresence(process.env.SLACK_BOT_TOKEN, profile.slack_user_id)
    ]);

    if (!slackUser) {
      console.error('Slack User Info取得失敗 - User ID:', profile.slack_user_id);
      return NextResponse.json(
        { 
          error: 'Slack情報の取得に失敗しました',
          details: 'Slack APIからユーザー情報を取得できませんでした。コンソールログを確認してください。',
          user_id: profile.slack_user_id,
          token_configured: !!process.env.SLACK_BOT_TOKEN
        },
        { status: 500 }
      );
    }

    // プレゼンス情報で正確なアクティブ状態を設定
    const isActive = presence === 'active';
    const updatedSlackUser = {
      ...slackUser,
      is_active: isActive,
      presence: presence || 'away'
    };

    // プロフィールのSlack情報を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        slack_display_name: updatedSlackUser.display_name,
        slack_status_text: updatedSlackUser.status_text,
        slack_status_emoji: updatedSlackUser.status_emoji,
        slack_is_active: updatedSlackUser.is_active,
        slack_last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('プロフィール更新エラー:', updateError);
    }

    const response = NextResponse.json({
      slack_connected: true,
      user: updatedSlackUser,
      workspace_url: profile.slack_workspace_url
    });

    // キャッシュを無効化
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('Slackステータス取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * Slackステータスを手動更新
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // プロフィール情報を取得
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }

    if (!profile.slack_user_id || !process.env.SLACK_BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Slack連携が設定されていません' },
        { status: 400 }
      );
    }

    // Slackからプレゼンス情報を取得
    const presence = await getSlackUserPresence(
      process.env.SLACK_BOT_TOKEN,
      profile.slack_user_id
    );

    // Slackからユーザー情報を取得
    const slackUser = await getSlackUserInfo(
      process.env.SLACK_BOT_TOKEN,
      profile.slack_user_id
    );

    if (!slackUser) {
      return NextResponse.json(
        { error: 'Slack情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // プロフィールのSlack情報を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        slack_display_name: slackUser.display_name,
        slack_status_text: slackUser.status_text,
        slack_status_emoji: slackUser.status_emoji,
        slack_is_active: presence === 'active',
        slack_last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'プロフィール更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...slackUser,
        is_active: presence === 'active'
      },
      updated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slackステータス更新エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 