# Portfolio Site

> **バージョン 0.3.0** - 大規模コード最適化リリース

現代的なポートフォリオサイトを構築するためのNext.js 15アプリケーションです。エンタープライズレベルの保守性とパフォーマンスを重視した設計で、個人やフリーランスの開発者が自身の実績を効果的に展示できます。

## 🌟 主な特徴

### ✨ 高度なUIエクスペリエンス
- **響応型デザイン**: 全デバイス対応（PC、タブレット、スマートフォン）
- **スマートフィルタリング**: 技術・カテゴリ・年度別の動的フィルタリング
- **スマートフォン最適化**: スクロール連動による自動エフェクト
- **アクセシビリティ**: WCAG準拠のアクセシブルなユーザーインターフェース
- **パフォーマンス**: Core Web Vitals最適化

### 🏗️ エンタープライズレベルのアーキテクチャ
- **型安全性**: 厳密なTypeScript型定義と型チェック
- **エラーハンドリング**: 統一されたエラーハンドリングシステム
- **ログ管理**: 開発/本番環境対応のログシステム
- **パフォーマンス最適化**: 並列処理、キャッシュ戦略、画像最適化
- **デバッグ機能**: 開発者向けの詳細なデバッグ機能

### 📊 管理機能
- **プロジェクト管理**: 実績の作成・編集・削除
- **画像アップロード**: Supabase Storage連携
- **ダッシュボード**: リアルタイム統計とアクティビティログ
- **設定管理**: サイト設定の一元管理

### 🔧 技術統合
- **Slack連携**: ステータス自動同期（オプション）
- **メール機能**: お問い合わせフォーム（Resend連携）
- **SEO最適化**: メタデータ最適化とサイトマップ

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15.3.3** - App Router & Server Components
- **React 19.1.0** - 最新React機能活用
- **TypeScript 5.8.3** - 厳密型チェック
- **Tailwind CSS** - ユーティリティファーストCSS
- **shadcn/ui** - モダンUIコンポーネントライブラリ
- **Framer Motion** - 高性能アニメーション

### バックエンド・データベース
- **Supabase** - PostgreSQL + リアルタイム機能
- **Supabase Storage** - ファイルストレージ
- **Server Actions** - サーバーサイド処理

### 開発・品質管理
- **ESLint** - コード品質管理
- **TypeScript** - 型安全性
- **Husky** - Git hooks（将来実装予定）

## 🎯 アーキテクチャ設計

### 📁 プロジェクト構造
```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # 管理画面ルート
│   ├── api/               # APIエンドポイント
│   └── (public)/          # 公開ページ
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/ui基盤コンポーネント
│   ├── admin/            # 管理画面専用コンポーネント
│   ├── sections/         # ページセクション
│   └── projects/         # プロジェクト関連コンポーネント
├── dal/                  # Data Access Layer
├── hooks/                # カスタムReactフック
├── lib/                  # ユーティリティ・設定
│   ├── utils/           # ヘルパー関数
│   ├── constants/       # 定数定義
│   └── error-handler.ts # エラーハンドリング
└── types/               # TypeScript型定義
```

### 🔄 DAL（Data Access Layer）設計
各データソースに対する統一されたアクセス層を提供：

- **エラーハンドリング**: 統一されたエラー処理
- **ログ機能**: デバッグ・本番対応ログ
- **パフォーマンス**: 並列処理による高速化
- **型安全性**: 厳密な型定義

```typescript
// 例: プロジェクト取得
const projects = await getProjects({
  featured: true,
  limit: 10,
  orderBy: { column: 'project_year', ascending: false },
  category: 'Web Development'
});
```

### 🎣 カスタムフック戦略
再利用可能なロジックをフックとして抽象化：

- **`use-projects-filter`**: フィルタリング・ソート機能
- **`use-mobile-scroll-effect`**: スマートフォン最適化エフェクト
- **`use-filter-ui-state`**: フィルターUI状態管理

### 🔧 エラーハンドリングシステム
統一されたエラー管理システム：

```typescript
// APIエラーハンドリング
export function handleApiError(error: unknown, context?: any): NextResponse {
  // Supabaseエラー、バリデーションエラー等を統一処理
}

// 安全な非同期処理
const [error, result] = await safeAsync(async () => {
  return await riskyOperation();
});
```

## 🚀 セットアップ

### 1. リポジトリクローン
```bash
git clone <repository-url>
cd portfolio
npm install
```

### 2. 環境変数設定
```bash
cp .env.local.example .env.local
```

必要な環境変数：
```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# オプション: Slack統合
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_USER_TOKEN=your_slack_user_token

# オプション: メール機能
RESEND_API_KEY=your_resend_api_key
```

### 3. データベースセットアップ
```bash
# Supabaseプロジェクト作成後
npm run db:init
```

### 4. 開発サーバー起動
```bash
npm run dev
```

## 📋 主要機能

### 🎨 フロントエンド機能
- **レスポンシブ実績一覧**: グリッドレイアウト、動的フィルタリング
- **スマートフォン最適化**: Intersection Observer活用の自動エフェクト
- **プロジェクト詳細**: マークダウン対応、画像ギャラリー
- **ダークモード**: システム設定連動
- **アニメーション**: Framer Motion活用の滑らかなトランジション

### 🔧 管理機能
- **プロジェクト管理**: 作成・編集・削除・並び替え
- **ファイルアップロード**: ドラッグ&ドロップ、プレビュー機能
- **統計ダッシュボード**: リアルタイムデータ、アクティビティログ
- **設定管理**: サイト情報、連絡先情報

### 📊 パフォーマンス最適化
- **Server Components**: 初期ページロード高速化
- **画像最適化**: Next.js Image コンポーネント活用
- **並列データ取得**: Promise.all活用による高速化
- **適切なキャッシュ戦略**: ISR、動的キャッシュ

## 🔧 開発ガイド

### コード品質
- **ESLint**: 統一されたコーディング規約
- **TypeScript**: 厳密型チェック
- **コメント**: JSDoc形式の詳細なドキュメント

### 設計原則
- **Single Responsibility**: 単一責任の原則
- **DRY**: コードの重複排除
- **SOLID**: オブジェクト指向設計原則
- **関心の分離**: ロジック、UI、データの明確な分離

### コンポーネント設計指針
- **Compound Components**: 複合コンポーネントパターン
- **Props型定義**: 厳密なProps型定義
- **アクセシビリティ**: ARIA属性、キーボード操作対応
- **テスタビリティ**: テストしやすい構造

## 📚 ドキュメント

### 設定ガイド
- [GitHub OAuth設定](docs/github-oauth-setup.md)
- [Slack統合設定](docs/slack-integration-setup.md)
- [Resend設定](docs/resend-setup.md)

### API仕様
- REST API エンドポイント仕様
- エラーレスポンス形式
- 認証・認可方式

## 🔧 保守・拡張ガイド

### 新機能追加時の手順
1. **要件定義**: 機能仕様の明確化
2. **型定義**: TypeScript型の追加・更新
3. **DAL実装**: データアクセス層の実装
4. **コンポーネント作成**: UI コンポーネントの実装
5. **API実装**: 必要に応じてAPIエンドポイント追加
6. **テスト**: 機能テスト・統合テスト
7. **ドキュメント更新**: README、コメント更新

### パフォーマンス監視
- **Core Web Vitals**: 定期的な測定・改善
- **バンドルサイズ**: webpack-bundle-analyzer活用
- **ログ分析**: エラーログ、パフォーマンスログの監視

### セキュリティ
- **依存関係更新**: 定期的なパッケージ更新
- **脆弱性スキャン**: npm audit実行
- **環境変数管理**: 機密情報の適切な管理

## 🚀 デプロイメント

### Vercel（推奨）
```bash
npm run build
vercel --prod
```

### 環境別設定
- **開発環境**: 詳細ログ、デバッグ機能有効
- **ステージング環境**: 本番類似環境でのテスト
- **本番環境**: 最適化、エラーログのみ

## 📝 更新履歴

### v0.3.0 (2024-01-XX) - 大規模最適化リリース
#### 🔄 コアアーキテクチャ改善
- **DAL層完全リファクタリング**: エラーハンドリング、ログ機能、パフォーマンス最適化
- **型定義強化**: BaseEntity導入、厳密な型定義、ProjectCategory型追加
- **エラーハンドリングシステム**: 統一されたAPIエラー処理、カスタムエラークラス

#### 🛠️ 開発者体験向上
- **デバッグ機能**: 開発環境でのログ出力、エラー詳細表示
- **ユーティリティ関数拡充**: safeAsync、removeUndefined、safeSortArray等
- **コードドキュメント**: JSDoc形式の詳細ドキュメント追加

#### 🗄️ データベース最適化
- **MCPマイグレーション**: site_iconカラム削除マイグレーション実行
- **並列データ取得**: Promise.all活用による高速化
- **クエリ最適化**: 適切なインデックス活用

#### 🔧 保守性向上
- **設計原則統一**: SOLID原則適用、関心の分離
- **エラー対応改善**: 統一エラーハンドリング、詳細ログ
- **型安全性強化**: 厳密型チェック、型定義の完全性

### v0.2.0 (2024-01-XX) - 大規模リファクタリング
- スマートフォン最適化機能
- カスタムフック分離による保守性向上
- マークダウンパーサー統一
- ページ遷移ローディング効果

### v0.1.0 (2024-01-XX) - 初期リリース
- 基本的なポートフォリオ機能
- 管理画面実装
- Supabase統合

## 🤝 貢献

プルリクエスト歓迎！以下の点にご注意ください：
- ESLint ルールの遵守
- TypeScript 型定義の追加
- 適切なコメント・ドキュメント
- テスト追加（該当する場合）

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Bundle Analyzer

### 概要
プロジェクトには@next/bundle-analyzerが導入されており、バンドルサイズの詳細分析が可能です。

### 使用方法

#### 基本的な分析
```bash
npm run analyze
```
クライアント、サーバー、エッジランタイムの全体的なバンドル分析を実行します。

#### 特定の環境の分析
```bash
# サーバーサイドバンドルのみ
npm run analyze:server

# ブラウザバンドルのみ  
npm run analyze:browser
```

### 生成されるレポート

分析実行後、`.next/analyze/` ディレクトリに以下のHTMLレポートが生成されます：

- `client.html` - クライアントサイドバンドルの詳細分析
- `nodejs.html` - Node.jsサーバーサイドバンドルの分析  
- `edge.html` - エッジランタイムバンドルの分析

### 分析結果の活用

#### チャンク最適化の確認
- 各ライブラリのサイズと影響度を視覚的に確認
- 重複する依存関係の特定
- Tree shakingの効果測定

#### パフォーマンス改善の指標
- First Load JSのサイズ監視
- 共通チャンクの分割効率確認
- 動的インポートの最適化検討

### 現在の最適化状況

```
First Load JS shared by all: 556 kB
├ chunks/common-8637b99be2bdced3.js: 426 kB
├ css/dc2d4e2321a43c04.css: 128 kB  
└ other shared chunks (total): 1.91 kB
```

#### 効果的な分割結果
- フレームワーク（React/Next.js）: 最優先分離
- UIライブラリ（Radix UI）: 専用チャンク（maxSize: 150KB）
- 重いライブラリ（Framer Motion）: 独立チャンク
- データベース（Supabase）: 分離済み
- その他vendor: 適切サイズ制限（maxSize: 200KB）

### トラブルシューティング

#### 大きなチャンクの対処
1. Bundle Analyzerで大きな依存関係を特定
2. Dynamic Importによる遅延ロード検討
3. 代替ライブラリの検討

#### 重複依存関係の解決
1. package.jsonでのバージョン統一
2. webpack設定での依存関係マッピング
3. モノレポ環境でのhoisting最適化

### 継続的な監視

定期的にBundle Analyzerを実行し、以下を監視：
- バンドルサイズの増加傾向
- 新しい依存関係の影響
- 最適化効果の測定

---

**Created with ❤️ using Next.js 15 and modern web technologies**
