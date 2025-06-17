/*
  # Slack連携機能の追加

  1. プロフィールテーブルの拡張
    - slack_user_id: SlackユーザーID
    - slack_workspace_url: Slackワークスペース URL
    - slack_display_name: Slack表示名
    - slack_status_text: Slackステータステキスト
    - slack_status_emoji: Slackステータス絵文字
    - slack_is_active: アクティブ状態
    - slack_last_activity: 最終アクティビティ時刻
    - slack_webhook_url: Slack通知用Webhook URL

  2. セキュリティ
    - 既存のRLSポリシーが適用される
*/

-- プロフィールテーブルにSlack関連フィールドを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_user_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_workspace_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_display_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_status_text text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_status_emoji text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_is_active boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_last_activity timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slack_webhook_url text;

-- Slack関連のインデックス作成
CREATE INDEX IF NOT EXISTS idx_profiles_slack_user_id ON profiles(slack_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_slack_is_active ON profiles(slack_is_active);

-- コメント追加
COMMENT ON COLUMN profiles.slack_user_id IS 'SlackユーザーID';
COMMENT ON COLUMN profiles.slack_workspace_url IS 'Slackワークスペース URL';
COMMENT ON COLUMN profiles.slack_display_name IS 'Slack表示名';
COMMENT ON COLUMN profiles.slack_status_text IS 'Slackステータステキスト';
COMMENT ON COLUMN profiles.slack_status_emoji IS 'Slackステータス絵文字';
COMMENT ON COLUMN profiles.slack_is_active IS 'Slackアクティブ状態';
COMMENT ON COLUMN profiles.slack_last_activity IS '最終アクティビティ時刻';
COMMENT ON COLUMN profiles.slack_webhook_url IS 'Slack通知用Webhook URL'; 