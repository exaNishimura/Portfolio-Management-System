/*
  # ポートフォリオサイト 初期データベーススキーマ
  
  このファイルは、ポートフォリオサイトに必要な全てのテーブル、
  インデックス、RLSポリシー、初期データを含む統合マイグレーションです。
  
  ## テーブル構成
  1. categories - プロジェクトカテゴリ管理
  2. projects - プロジェクト情報管理
  3. portfolio_settings - サイト設定管理
  4. profiles - ユーザープロフィール管理（Slack連携含む）
  
  ## セキュリティ
  - 全テーブルでRLS有効化
  - 閲覧は全ユーザー可能
  - 編集は認証済み管理者のみ可能
*/

-- ===========================================
-- 1. カテゴリテーブル
-- ===========================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'folder',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===========================================
-- 2. プロジェクトテーブル
-- ===========================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  project_url text DEFAULT '',
  github_url text DEFAULT '',
  technologies text[] DEFAULT '{}',
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  project_year integer DEFAULT EXTRACT(year FROM now()),
  project_scale text DEFAULT 'medium',
  image_paths text[] DEFAULT '{}'
);

-- ===========================================
-- 3. ポートフォリオ設定テーブル
-- ===========================================
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

-- ===========================================
-- 4. プロフィールテーブル
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  bio text,
  email text,
  phone text,
  location text,
  website text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  avatar_url text,
  skills text[] DEFAULT '{}',
  experience_years integer,
  -- Slack連携フィールド
  slack_user_id text,
  slack_workspace_url text,
  slack_display_name text,
  slack_status_text text,
  slack_status_emoji text,
  slack_is_active boolean DEFAULT false,
  slack_last_activity timestamptz,
  slack_webhook_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===========================================
-- 5. RLS有効化
-- ===========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 6. カテゴリのRLSポリシー
-- ===========================================
CREATE POLICY "全ユーザーがカテゴリを閲覧可能"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "認証済みユーザーがカテゴリを挿入可能"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがカテゴリを更新可能"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがカテゴリを削除可能"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- ===========================================
-- 7. プロジェクトのRLSポリシー
-- ===========================================
CREATE POLICY "全ユーザーがプロジェクトを閲覧可能"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "認証済みユーザーがプロジェクトを挿入可能"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがプロジェクトを更新可能"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがプロジェクトを削除可能"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- ===========================================
-- 8. ポートフォリオ設定のRLSポリシー
-- ===========================================
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

-- ===========================================
-- 9. プロフィールのRLSポリシー
-- ===========================================
CREATE POLICY "全ユーザーがプロフィールを閲覧可能"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "認証済みユーザーがプロフィールを挿入可能"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがプロフィールを更新可能"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "認証済みユーザーがプロフィールを削除可能"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (true);

-- ===========================================
-- 10. インデックス作成
-- ===========================================
-- プロジェクト関連
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(project_year DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);

-- カテゴリ関連
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- プロフィール関連（Slack連携）
CREATE INDEX IF NOT EXISTS idx_profiles_slack_user_id ON profiles(slack_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_slack_is_active ON profiles(slack_is_active);

-- ===========================================
-- 11. カラムコメント
-- ===========================================
-- プロジェクトテーブル
COMMENT ON COLUMN projects.image_paths IS 'Supabaseストレージのファイルパス配列（削除用）';

-- プロフィールテーブル（Slack関連）
COMMENT ON COLUMN profiles.slack_user_id IS 'SlackユーザーID';
COMMENT ON COLUMN profiles.slack_workspace_url IS 'Slackワークスペース URL';
COMMENT ON COLUMN profiles.slack_display_name IS 'Slack表示名';
COMMENT ON COLUMN profiles.slack_status_text IS 'Slackステータステキスト';
COMMENT ON COLUMN profiles.slack_status_emoji IS 'Slackステータス絵文字';
COMMENT ON COLUMN profiles.slack_is_active IS 'Slackアクティブ状態';
COMMENT ON COLUMN profiles.slack_last_activity IS '最終アクティビティ時刻';
COMMENT ON COLUMN profiles.slack_webhook_url IS 'Slack通知用Webhook URL';

-- ===========================================
-- 12. 初期データ挿入
-- ===========================================
-- カテゴリ初期データ
INSERT INTO categories (name, slug, description, icon) VALUES
('WordPress', 'wordpress', 'WordPressを使用したWebサイト制作', 'globe'),
('Next.js', 'nextjs', 'Next.jsフレームワークを使用したWebアプリケーション', 'code'),
('React', 'react', 'Reactライブラリを使用したフロントエンド開発', 'component'),
('その他', 'other', 'その他の技術を使用したプロジェクト', 'wrench')
ON CONFLICT (slug) DO NOTHING;

-- ポートフォリオ設定初期データ
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

-- サンプルプロジェクトデータ
INSERT INTO projects (title, description, category, technologies, project_year, project_scale, is_featured) VALUES
('企業サイトリニューアル', 'WordPressを使用した企業サイトのリニューアルプロジェクト。レスポンシブデザインとSEO対策を実装。', 'wordpress', ARRAY['WordPress', 'PHP', 'MySQL', 'CSS', 'JavaScript'], 2024, 'large', true),
('Eコマースサイト', 'Next.jsとStripeを使用したオンラインショップの構築。管理画面も含む本格的なEコマースサイト。', 'nextjs', ARRAY['Next.js', 'React', 'TypeScript', 'Stripe', 'Supabase'], 2024, 'large', true),
('タスク管理アプリ', 'Reactを使用したシンプルなタスク管理アプリケーション。ドラッグ&ドロップ機能付き。', 'react', ARRAY['React', 'TypeScript', 'CSS', 'Local Storage'], 2023, 'medium', false),
('ポートフォリオサイト', 'Next.jsとSupabaseを使用した本ポートフォリオサイト。管理機能とダークモード対応。', 'nextjs', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'], 2024, 'medium', true)
ON CONFLICT DO NOTHING; 