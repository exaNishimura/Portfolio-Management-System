# Supabaseストレージ設定手順

## 概要

このプロジェクトでは、プロジェクト画像の管理にSupabaseストレージを使用しています。

## 設定手順

### 1. Supabaseプロジェクトでの設定

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 左サイドバーから「Storage」を選択
4. 「Create a new bucket」をクリック
5. バケット名: `project-images`
6. 「Public bucket」にチェック
7. 「Save」をクリック

### 2. ストレージポリシーの設定

Supabase SQL Editorで以下のSQLを実行してください：

```sql
-- プロジェクト画像用のストレージバケットを作成
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 公開読み取りポリシー（誰でも画像を閲覧可能）
CREATE POLICY "Public read access for project images" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

-- 管理者のみアップロード・更新・削除可能（認証が実装されるまでは一時的に全員許可）
CREATE POLICY "Admin upload access for project images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Admin update access for project images" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-images');

CREATE POLICY "Admin delete access for project images" ON storage.objects
FOR DELETE USING (bucket_id = 'project-images');

-- RLSを有効化
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### 3. データベーステーブルの更新

プロジェクトテーブルに`image_paths`カラムを追加：

```sql
-- プロジェクトテーブルにimage_pathsカラムを追加
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS image_paths TEXT[] DEFAULT '{}';

-- カラムにコメントを追加
COMMENT ON COLUMN projects.image_paths IS 'Supabaseストレージのファイルパス配列（削除用）';
```

## 機能

### 画像アップロード

- 複数画像の同時アップロード対応
- ドラッグ&ドロップ機能
- ファイル形式検証（JPEG, PNG, GIF, WebP）
- ファイルサイズ制限（5MB）
- 自動ファイル名生成（タイムスタンプ + ランダム文字列）

### 画像管理

- 画像プレビュー機能
- 個別画像削除機能
- Supabaseストレージとの同期

### セキュリティ

- ファイル形式の厳密な検証
- ファイルサイズ制限
- 公開読み取り、管理者のみ書き込み

## API エンドポイント

### アップロード
- `POST /api/admin/upload`
- FormDataで複数ファイルを送信

### 削除
- `DELETE /api/admin/upload/delete`
- JSON形式で画像URLを送信

## トラブルシューティング

### バケットが作成されない場合

1. Supabaseダッシュボードでストレージ機能が有効になっているか確認
2. プロジェクトの権限設定を確認
3. SQLエラーがないか確認

### アップロードが失敗する場合

1. ファイル形式が対応しているか確認
2. ファイルサイズが5MB以下か確認
3. ネットワーク接続を確認
4. Supabaseの使用量制限を確認

### 画像が表示されない場合

1. バケットが公開設定になっているか確認
2. 読み取りポリシーが正しく設定されているか確認
3. 画像URLが正しいか確認

## 注意事項

- 現在は認証機能が未実装のため、一時的に全員がアップロード可能
- 認証機能実装後は、管理者のみアップロード可能に変更予定
- 画像削除時は、データベースとストレージの両方から削除される 