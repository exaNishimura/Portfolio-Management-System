-- プロジェクトテーブルにimage_pathsカラムを追加
-- Supabaseストレージのファイルパス情報を保存するため（削除時に使用）

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS image_paths TEXT[] DEFAULT '{}';

-- カラムにコメントを追加
COMMENT ON COLUMN projects.image_paths IS 'Supabaseストレージのファイルパス配列（削除用）'; 