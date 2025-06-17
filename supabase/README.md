# Supabase データベースマイグレーション

このディレクトリには、ポートフォリオサイトのSupabaseデータベーススキーマとマイグレーションファイルが含まれています。

## ファイル構成

```
supabase/
├── migrations/
│   └── 00000000000000_initial_schema.sql  # 統合初期スキーマ
├── init.sql                               # 初期化スクリプト（開発用）
├── storage-setup.sql                      # ストレージ設定
└── README.md                              # このファイル
```

## 新規プロジェクトでの使用方法

### 1. Supabaseプロジェクトの作成
1. [Supabase Dashboard](https://supabase.com/dashboard) でプロジェクトを作成
2. プロジェクトの接続情報を取得

### 2. 環境変数の設定
`.env.local` ファイルに以下を設定：
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. データベーススキーマの適用

#### 方法A: マイグレーションファイルを使用（推奨）
```bash
# Supabase CLIを使用してマイグレーションを適用
supabase db reset
```

#### 方法B: SQLファイルを直接実行
Supabase Dashboard の SQL Editor で `00000000000000_initial_schema.sql` の内容を実行

### 4. ストレージの設定
`storage-setup.sql` の内容をSupabase Dashboard の SQL Editor で実行

## データベーススキーマ

### テーブル構成

#### 1. `categories` - プロジェクトカテゴリ
- プロジェクトの分類管理
- WordPress、Next.js、React等のカテゴリ

#### 2. `projects` - プロジェクト情報
- ポートフォリオプロジェクトの詳細情報
- 画像、技術スタック、カテゴリ等を管理

#### 3. `portfolio_settings` - サイト設定
- サイトタイトル、連絡先情報等の設定
- 単一レコードでの管理

#### 4. `profiles` - プロフィール情報
- ユーザープロフィール情報
- Slack連携機能を含む

### セキュリティ設定

- **RLS (Row Level Security)**: 全テーブルで有効
- **閲覧権限**: 全ユーザー（anon、authenticated）
- **編集権限**: 認証済みユーザーのみ

### インデックス

パフォーマンス最適化のため以下のインデックスを設定：
- プロジェクトのカテゴリ、年度、フィーチャー状態
- 技術スタックでのGIN検索
- カテゴリのスラッグ
- Slack連携情報

## 初期データ

マイグレーション実行時に以下の初期データが自動挿入されます：

### カテゴリ
- WordPress
- Next.js  
- React
- その他

### ポートフォリオ設定
- サイトタイトル: "Portfolio Site"
- 連絡先メール: "contact@example.com"

### サンプルプロジェクト
- 企業サイトリニューアル（WordPress）
- Eコマースサイト（Next.js）
- タスク管理アプリ（React）
- ポートフォリオサイト（Next.js）

## 開発時の注意事項

### 新しいマイグレーションの追加
新しい機能追加時は以下の命名規則でマイグレーションファイルを作成：
```
YYYYMMDDHHMMSS_feature_description.sql
```

### データベースリセット
開発環境でデータベースをリセットする場合：
```bash
supabase db reset
```

### バックアップ
本番環境では定期的なバックアップを推奨：
```bash
supabase db dump --file backup.sql
```

## トラブルシューティング

### マイグレーション失敗時
1. Supabase Dashboard でエラーログを確認
2. 既存のポリシーやテーブルとの競合をチェック
3. 必要に応じて手動でクリーンアップ後、再実行

### 権限エラー
1. RLSポリシーの設定を確認
2. 認証状態を確認
3. 管理者権限の設定を確認（`ADMIN_EMAILS` 環境変数）

## 関連ドキュメント

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 