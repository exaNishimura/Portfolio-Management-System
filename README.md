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
- **スマホ最適化**: スクロール連動エフェクト
- **保守性重視**: カスタムフック・コンポーネント分割による高い保守性

## 🛠️ 技術スタック

### フロントエンド
- **Next.js** (v15.3.3) - App Router
- **React** (v19.1.0) - Server/Client Components
- **TypeScript** (v5.8.3) - 型安全性
- **TailwindCSS** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **Framer Motion** - アニメーション
- **Intersection Observer API** - スクロール監視

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
│   ├── projects/            # プロジェクト関連コンポーネント
│   │   ├── project-card.tsx        # 個別プロジェクトカード
│   │   └── floating-filter.tsx     # フローティングフィルター
│   ├── sections/            # ページセクション
│   └── ui/                  # shadcn/ui コンポーネント
├── hooks/                   # カスタムフック
│   ├── use-projects-filter.ts      # プロジェクトフィルタリング
│   ├── use-mobile-scroll-effect.ts # モバイルスクロールエフェクト
│   ├── use-filter-ui-state.ts      # フィルターUI状態管理
│   └── use-toast.ts                # トースト通知
├── lib/                     # ユーティリティ・設定
│   ├── constants/           # 定数定義
│   │   └── projects.ts      # プロジェクト関連定数
│   ├── types/               # 型定義
│   └── utils/               # ヘルパー関数
│       ├── markdown-parser.ts      # マークダウン解析
│       ├── skill-icons.tsx         # スキルアイコン
│       └── image-converter.ts      # 画像変換
├── dal/                     # Data Access Layer
├── supabase/                # データベース設定
│   ├── migrations/          # マイグレーションファイル
│   └── init.sql            # 初期スキーマ
└── public/                  # 静的ファイル
```

## 🏗️ アーキテクチャ設計

### カスタムフック設計
本プロジェクトでは、関心の分離とコードの再利用性を重視したカスタムフック設計を採用しています：

#### 1. `useProjectsFilter` - プロジェクトフィルタリング
```typescript
// フィルタリング・ソート機能を統合管理
const {
  selectedTechnologies,
  sortBy,
  filteredAndSortedProjects,
  handleTechnologyChange,
  clearFilters
} = useProjectsFilter({ projects });
```

#### 2. `useMobileScrollEffect` - スマホスクロールエフェクト
```typescript
// Intersection Observer APIを使用したスクロール監視
const { shouldShowEffect } = useMobileScrollEffect({ 
  projects: filteredAndSortedProjects 
});
```

#### 3. `useFilterUIState` - フィルターUI状態管理
```typescript
// フィルターUIの開閉状態とローカルストレージ同期
const {
  isFilterVisible,
  isTechFilterOpen,
  setIsTechFilterOpen
} = useFilterUIState();
```

### コンポーネント分割戦略

#### 1. 単一責任の原則
- 各コンポーネントは明確な責任を持つ
- ビジネスロジックとUIロジックの分離
- 再利用可能性を重視した設計

#### 2. Props Drilling回避
- カスタムフックによる状態管理の集約
- 適切なコンポーネント階層設計
- Context APIの適切な使用

### パフォーマンス最適化

#### 1. スマホ向け最適化
- **スクロール連動エフェクト**: カードが画面中央に来た時に自動的にホバーエフェクトを適用
- **Intersection Observer**: 効率的なスクロール監視
- **条件分岐レンダリング**: PC/モバイルでの適切な表示制御

#### 2. メモ化戦略
- `useMemo`による計算結果のキャッシュ
- `useCallback`によるイベントハンドラーの最適化
- 不要な再レンダリングの防止

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
- **プロジェクト一覧**: 
  - 技術スタック別フィルタリング
  - 並び順ソート（新しい順・古い順・タイトル順）
  - **スマホ最適化**: スクロール連動エフェクト
  - フローティングフィルターUI
- **プロジェクト詳細**: 画像ギャラリー・技術詳細・マークダウン対応
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

### 5. UX最適化機能
- **レスポンシブデザイン**: 全デバイス対応
- **ダークモード**: システム設定連動
- **スマホエフェクト**: スクロール位置に応じた自動ホバーエフェクト
- **フィルター機能**: 
  - リアルタイム検索・フィルタリング
  - ローカルストレージによる状態保持
  - アニメーション付きUI

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
- **TypeScript厳格モード**: 型安全性の確保
- **ESLint設定準拠**: コード品質の維持
- **shadcn/ui コンポーネント優先使用**: UI一貫性の確保
- **Server Components デフォルト使用**: パフォーマンス最適化
- **カスタムフック活用**: ロジックの再利用性向上

### アーキテクチャ原則
- **単一責任の原則**: 各ファイル・関数は一つの責任のみ
- **関心の分離**: ビジネスロジックとUIロジックの分離
- **DRY原則**: コードの重複を避ける
- **型安全性**: TypeScriptの型システムを最大限活用

### ディレクトリ規約
- `app/` - ページとAPI Routes
- `components/` - 再利用可能コンポーネント
- `hooks/` - カスタムフック（ビジネスロジック）
- `lib/constants/` - 定数定義
- `lib/utils/` - ユーティリティ関数
- `dal/` - データアクセス層

### コンポーネント設計指針
- **Props型定義**: 全てのPropsに明確な型定義
- **デフォルトProps**: 適切なデフォルト値の設定
- **エラーハンドリング**: 適切なエラー境界の設定
- **アクセシビリティ**: WAI-ARIA準拠

### カスタムフック設計指針
- **単一責任**: 一つの機能に特化
- **再利用性**: 複数のコンポーネントで使用可能
- **型安全性**: 戻り値の型定義
- **副作用管理**: useEffectの適切な使用

## 🔍 テスト・デバッグ

### 型チェック
```bash
# TypeScriptコンパイルエラーチェック
npx tsc --noEmit
```

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
- React Developer Toolsでコンポーネント状態確認

## 🔧 保守・拡張ガイド

### 新機能追加手順
1. **要件定義**: 機能仕様の明確化
2. **設計**: コンポーネント・フック設計
3. **実装**: 型安全性を重視した実装
4. **テスト**: 動作確認・型チェック
5. **ドキュメント更新**: README・コメント更新

### リファクタリング指針
- **段階的改善**: 小さな単位での継続的改善
- **テスト保持**: 既存機能の動作保証
- **型安全性維持**: TypeScriptエラーゼロを維持
- **パフォーマンス監視**: Core Web Vitalsの監視

### トラブルシューティング
- **ビルドエラー**: 型定義・import文の確認
- **実行時エラー**: コンソールログ・エラー境界の確認
- **パフォーマンス問題**: React DevToolsでのプロファイリング
- **UI問題**: レスポンシブデザイン・アクセシビリティの確認

## 📖 ドキュメント

- [GitHub OAuth設定](docs/github-oauth-setup.md)
- [Resend設定](docs/resend-setup.md)
- [Slack連携設定](docs/slack-integration-setup.md)
- [Supabaseストレージ設定](README-supabase-storage.md)

## 🤝 コントリビューション

1. フォークしてブランチを作成
2. 変更を実装
3. 型チェック・テストを実行
4. プルリクエストを作成

### コントリビューション指針
- **コーディング規約遵守**: ESLint・TypeScript設定に従う
- **テスト実行**: 変更による既存機能への影響確認
- **ドキュメント更新**: 変更内容に応じたドキュメント更新
- **レビュー対応**: コードレビューでの指摘事項への対応

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙋‍♂️ サポート

問題が発生した場合：
1. [Issues](https://github.com/your-repo/issues)で既存の問題を確認
2. 新しいIssueを作成
3. 詳細な再現手順を記載
4. 環境情報（ブラウザ・OS・Node.jsバージョン）を含める

---

**開発者**: Rikiya Nishimura  
**バージョン**: 0.2.0  
**最終更新**: 2025年1月2日  
**主要更新**: 大規模リファクタリング・スマホ最適化・保守性向上
