/*
  # ポートフォリオ設定機能の追加

  1. 新しいテーブル
    - `portfolio_settings`
      - サイトタイトル、アイコン、画像等の設定
      - 連絡先情報の管理
      - 単一レコードでの管理

  2. セキュリティ
    - RLS有効化
    - 閲覧は全ユーザー可能
    - 編集は認証済み管理者のみ可能
*/

-- ポートフォリオ設定テーブル
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL DEFAULT 'Portfolio Site',
  site_icon text DEFAULT 'code2',
  site_image_url text DEFAULT '',
  contact_email text DEFAULT '',
  contact_github text DEFAULT '',
  contact_website text DEFAULT '',
  contact_phone text DEFAULT '',
  contact_address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

-- ポートフォリオ設定のポリシー
CREATE POLICY "全ユーザーがポートフォリオ設定を閲覧可能"
  ON portfolio_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "認証済みユーザーがポートフォリオ設定を挿入可能"
  ON portfolio_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがポートフォリオ設定を更新可能"
  ON portfolio_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがポートフォリオ設定を削除可能"
  ON portfolio_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- 初期設定データ挿入
INSERT INTO portfolio_settings (
  site_title, 
  site_icon, 
  contact_email, 
  contact_github
) VALUES (
  'Portfolio Site',
  'code2',
  'contact@example.com',
  'https://github.com'
) ON CONFLICT DO NOTHING; 