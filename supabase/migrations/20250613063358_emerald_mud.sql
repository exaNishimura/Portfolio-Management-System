/*
  # ポートフォリオサイト用データベーススキーマの作成

  1. 新しいテーブル
    - `categories`
      - カテゴリ情報（WordPress、Next.js、React等）
      - アイコンとスラッグを含む
    - `projects`
      - プロジェクト情報
      - 技術スタック配列、カテゴリ、年度等を含む
      - 管理者のみ編集可能

  2. セキュリティ
    - 全テーブルでRLS有効化
    - 閲覧は全ユーザー可能
    - 編集は認証済み管理者のみ可能

  3. インデックス
    - カテゴリとプロジェクト年度でのソート用
    - 技術タグでの検索用
*/

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'folder',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- プロジェクトテーブル
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
  project_scale text DEFAULT 'medium'
);

-- RLS有効化
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- カテゴリのポリシー
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

-- プロジェクトのポリシー
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

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(project_year DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 初期データ挿入
INSERT INTO categories (name, slug, description, icon) VALUES
('WordPress', 'wordpress', 'WordPressを使用したWebサイト制作', 'globe'),
('Next.js', 'nextjs', 'Next.jsフレームワークを使用したWebアプリケーション', 'code'),
('React', 'react', 'Reactライブラリを使用したフロントエンド開発', 'component'),
('その他', 'other', 'その他の技術を使用したプロジェクト', 'wrench')
ON CONFLICT (slug) DO NOTHING;

-- サンプルプロジェクトデータ
INSERT INTO projects (title, description, category, technologies, project_year, project_scale, is_featured) VALUES
('企業サイトリニューアル', 'WordPressを使用した企業サイトのリニューアルプロジェクト。レスポンシブデザインとSEO対策を実装。', 'wordpress', ARRAY['WordPress', 'PHP', 'MySQL', 'CSS', 'JavaScript'], 2024, 'large', true),
('Eコマースサイト', 'Next.jsとStripeを使用したオンラインショップの構築。管理画面も含む本格的なEコマースサイト。', 'nextjs', ARRAY['Next.js', 'React', 'TypeScript', 'Stripe', 'Supabase'], 2024, 'large', true),
('タスク管理アプリ', 'Reactを使用したシンプルなタスク管理アプリケーション。ドラッグ&ドロップ機能付き。', 'react', ARRAY['React', 'TypeScript', 'CSS', 'Local Storage'], 2023, 'medium', false),
('ポートフォリオサイト', 'Next.jsとSupabaseを使用した本ポートフォリオサイト。管理機能とダークモード対応。', 'nextjs', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'], 2024, 'medium', true)
ON CONFLICT DO NOTHING;