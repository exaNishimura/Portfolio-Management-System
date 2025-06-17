# Portfolio Site

モダンなNext.js 15とSupabaseを使用したポートフォリオサイト。プロジェクト管理、プロフィール管理、お問い合わせ機能を備えた本格的なWebアプリケーションです。

## 🚀 特徴

- **モダンなフロントエンド**: Next.js 15 + React 19 + TypeScript
- **レスポンシブデザイン**: TailwindCSS + shadcn/ui
- **バックエンド**: Supabase (認証・データベース・ストレージ)
- **管理機能**: プロジェクト・プロフィール・設定の完全管理
- **画像最適化**: 自動AVIF変換とストレージ管理
- **SEO対応**: Server Components活用
- **アクセシビリティ**: WAI-ARIA準拠

## 🛠️ 技術スタック

### フロントエンド
- **Next.js** (v15.3.3) - App Router
- **React** (v19.1.0) - Server/Client Components
- **TypeScript** (v5.8.3) - 型安全性
- **TailwindCSS** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **Framer Motion** - アニメーション

### バックエンド・インフラ
- **Supabase** - データベース・認証・ストレージ
- **PostgreSQL** - メインデータベース
- **Row Level Security (RLS)** - セキュリティ

### 開発ツール
- **ESLint** - コード品質
- **Sharp** - 画像処理
- **Zod** - スキーマバリデーション
- **React Hook Form** - フォーム管理

## 📁 プロジェクト構造

```
portfolio/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 認証関連ページ
│   ├── admin/               # 管理画面
│   ├── api/                 # API Routes
│   ├── contact/             # お問い合わせページ
│   └── projects/            # プロジェクト詳細ページ
├── components/              # Reactコンポーネント
│   ├── admin/               # 管理画面コンポーネント
│   ├── layout/              # レイアウトコンポーネント
│   ├── sections/            # ページセクション
│   └── ui/                  # shadcn/ui コンポーネント
├── lib/                     # ユーティリティ・設定
│   ├── types/               # 型定義
│   └── utils/               # ヘルパー関数
├── dal/                     # Data Access Layer
├── supabase/                # データベース設定
│   ├── migrations/          # マイグレーションファイル
│   └── init.sql            # 初期スキーマ
└── public/                  # 静的ファイル
```

## 🗄️ データベース構造

### テーブル一覧
- **profiles** - プロフィール情報
- **projects** - プロジェクト情報
- **categories** - プロジェクトカテゴリ
- **portfolio_settings** - サイト設定

### 主要機能
- Row Level Security (RLS) による認可制御
- 自動タイムスタンプ管理
- プロジェクト画像の複数対応
- Slack連携機能

## 🔧 セットアップ

### 1. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 認証
ADMIN_EMAILS=your_admin_email@example.com

# メール送信 (Resend)
RESEND_API_KEY=your_resend_api_key

# Slack連携 (オプション)
SLACK_BOT_TOKEN=your_slack_bot_token
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseデータベースの初期化

```bash
# Supabaseプロジェクトに接続
npx supabase link --project-ref your-project-ref

# マイグレーションを実行
npx supabase db push
```

または、Supabaseダッシュボードで `supabase/init.sql` を実行

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 🎯 主要機能

### 1. ポートフォリオサイト
- **ホームページ**: プロフィール・注目プロジェクト表示
- **プロジェクト一覧**: カテゴリ・技術スタック別フィルタリング
- **プロジェクト詳細**: 画像ギャラリー・技術詳細
- **お問い合わせ**: メール送信機能

### 2. 管理画面 (`/admin`)
- **認証**: GitHub OAuth
- **プロジェクト管理**: CRUD操作・画像アップロード
- **プロフィール管理**: 個人情報・スキル管理
- **サイト設定**: メタ情報・連絡先設定
- **ダッシュボード**: 統計・アクティビティログ

### 3. 画像管理
- **自動最適化**: AVIF形式への変換
- **複数画像対応**: プロジェクトごとに最大5枚
- **ストレージ管理**: Supabase Storage統合
- **削除機能**: 安全な画像削除

### 4. セキュリティ
- **認証**: Supabase Auth + GitHub OAuth
- **認可**: Row Level Security (RLS)
- **管理者制限**: 環境変数による管理者メール指定
- **CSRF保護**: Next.js標準機能

## 🚀 デプロイ

### Vercel (推奨)

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. 自動デプロイを有効化

### 環境変数の設定
本番環境では以下の環境変数が必要：
- Supabase接続情報
- 管理者メールアドレス
- メール送信API設定
- Slack連携設定（オプション）

## 📚 開発ガイド

### コーディング規約
- TypeScript厳格モード
- ESLint設定準拠
- shadcn/ui コンポーネント優先使用
- Server Components デフォルト使用

### ディレクトリ規約
- `app/` - ページとAPI Routes
- `components/` - 再利用可能コンポーネント
- `lib/` - ユーティリティ関数
- `dal/` - データアクセス層

### 型安全性
- 全てのAPIレスポンスに型定義
- Zodスキーマバリデーション
- TypeScriptストリクトモード

## 🔍 テスト・デバッグ

### テストスクリプト
```bash
# GitHub OAuth設定テスト
node scripts/test-github-auth.js

# Slack連携テスト
node scripts/test-slack-setup.js
```

### デバッグ
- 開発環境でのエラーログ確認
- Supabaseダッシュボードでデータベース確認
- ブラウザ開発者ツールでネットワーク確認

## 📖 ドキュメント

- [GitHub OAuth設定](docs/github-oauth-setup.md)
- [Resend設定](docs/resend-setup.md)
- [Slack連携設定](docs/slack-integration-setup.md)
- [Supabaseストレージ設定](README-supabase-storage.md)

## 🤝 コントリビューション

1. フォークしてブランチを作成
2. 変更を実装
3. テストを実行
4. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙋‍♂️ サポート

問題が発生した場合：
1. [Issues](https://github.com/your-repo/issues)で既存の問題を確認
2. 新しいIssueを作成
3. 詳細な再現手順を記載

---

**開発者**: Rikiya Nishimura
**バージョン**: 0.1.0  
**最終更新**: 2025年6月17日
