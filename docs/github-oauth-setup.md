# GitHub OAuth 設定手順

## 概要
ポートフォリオサイトの管理者ログインでGitHub認証を使用するための設定手順です。

## 1. GitHub OAuth アプリケーションの作成

### 1.1 GitHub Developer Settings にアクセス
1. [GitHub Developer Settings](https://github.com/settings/developers) にアクセス
2. 「OAuth Apps」タブを選択
3. 「New OAuth App」ボタンをクリック

### 1.2 アプリケーション情報の入力
以下の情報を入力してください：

- **Application name**: `Portfolio Site Admin`
- **Homepage URL**: `http://localhost:3000` (開発環境) / `https://your-domain.com` (本番環境)
- **Application description**: `Portfolio site admin authentication`
- **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`

### 1.3 OAuth認証情報の取得
1. 「Register application」をクリック
2. 作成されたアプリケーションページで以下を取得：
   - **Client ID**: 表示されているIDをコピー
   - **Client Secret**: c836f3a412d7d65d7c9453ff77e51dceac57f0bc「Generate a new client secret」をクリックして生成し、コピー

⚠️ **重要**: Client Secretは一度しか表示されないため、必ず安全な場所に保存してください。

## 2. Supabase での GitHub プロバイダー設定

### 2.1 Supabase ダッシュボードにアクセス
1. [Supabase Dashboard](https://supabase.com/dashboard/project/cxvxovkxirsfpzsvcwrh/auth/providers) にアクセス
2. 「Authentication」→「Providers」を選択

### 2.2 GitHub プロバイダーの有効化
1. 「GitHub」プロバイダーを見つける
2. 「Enable」トグルをオンにする
3. 以下の情報を入力：
   - **Client ID**: 手順1.3で取得したClient ID
   - **Client Secret**: 手順1.3で取得したClient Secret
4. 「Save」をクリック

## 3. 動作確認

### 3.1 ログインテスト
1. 開発サーバーを起動: `npm run dev`
2. `http://localhost:3000/auth/login` にアクセス
3. 「GitHubでログイン」ボタンをクリック
4. GitHub認証画面でアプリケーションを承認
5. 管理者ダッシュボードにリダイレクトされることを確認

### 3.2 管理者権限の確認
- 環境変数 `ADMIN_EMAILS` に設定されたメールアドレスのGitHubアカウントのみアクセス可能
- 他のアカウントでは「アクセス拒否」ページが表示される

## 4. 本番環境での設定

本番環境にデプロイする際は、以下を更新してください：

### 4.1 GitHub OAuth App の更新
- **Homepage URL**: 本番環境のURL
- **Authorization callback URL**: そのまま（Supabaseのコールバック URL）

### 4.2 環境変数の設定
```bash
# 本番環境の環境変数
ADMIN_EMAILS=your-admin-email@gmail.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 5. トラブルシューティング

### よくある問題と解決方法

1. **「Invalid redirect URI」エラー**
   - GitHub OAuth AppのCallback URLが正しく設定されているか確認
   - Supabaseプロジェクトのコールバック URLと一致しているか確認

2. **「Access denied」エラー**
   - 環境変数 `ADMIN_EMAILS` にGitHubアカウントのメールアドレスが設定されているか確認
   - GitHubアカウントのメールアドレスが公開設定になっているか確認

3. **認証後にエラーページが表示される**
   - Supabaseプロジェクトの認証設定を確認
   - ブラウザのコンソールでエラーメッセージを確認

## 6. セキュリティ考慮事項

- Client Secretは環境変数として安全に管理する
- 本番環境では適切なドメインのみを許可する
- 定期的にClient Secretをローテーションする
- アクセスログを監視する

## 参考リンク

- [Supabase GitHub Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub Developer Settings](https://github.com/settings/developers) 