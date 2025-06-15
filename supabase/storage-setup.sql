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