# Slack連携機能セットアップガイド

## 概要
ポートフォリオサイトでSlackのリアルタイムステータスを表示するための設定手順です。

## 🚨 現在の問題と解決方法

### 🔴 重要: `missing_scope` エラーの原因が判明しました！

**問題**: 現在設定されているトークンは **User Token** (`xoxe.xoxp-`で始まる) ですが、この実装では **Bot Token** (`xoxb-`で始まる) が必要です。

**現在の設定**: `SLACK_BOT_TOKEN=xoxe.xoxp-...` ❌
**必要な設定**: `SLACK_BOT_TOKEN=xoxb-...` ✅

### Bot Token と User Token の違い

| 項目 | Bot Token | User Token |
|------|-----------|------------|
| プレフィックス | `xoxb-` | `xoxp-` または `xoxe.xoxp-` |
| 用途 | Bot として動作 | ユーザーとして動作 |
| 権限 | Bot Token Scopes | User Token Scopes |
| 推奨 | ✅ サーバーサイド処理 | ❌ セキュリティリスク |

## 📋 必要な準備

### 1. Slack App の作成

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」をクリック
3. 「From scratch」を選択
4. App名を入力（例: "Portfolio Status"）
5. ワークスペースを選択

### 2. **Bot Token Scopes** の設定（重要！）

**OAuth & Permissions** セクションで以下のスコープを追加：

**Bot Token Scopes（必須）**:
- `users:read` - ユーザー情報の読み取り
- `users:read.email` - ユーザーのメールアドレス読み取り（オプション）

⚠️ **注意**: **User Token Scopes** ではなく、**Bot Token Scopes** に追加してください！

### 3. App のインストール

1. 「Install to Workspace」をクリック
2. 権限を確認して「Allow」をクリック
3. **Bot User OAuth Token** をコピー（`xoxb-`で始まる）

⚠️ **重要**: **User OAuth Token** (`xoxp-`で始まる) ではなく、**Bot User OAuth Token** (`xoxb-`で始まる) を使用してください！

## 🔧 環境変数の設定

`.env.local` ファイルを更新：

```bash
# ✅ 正しい: Bot Token
SLACK_BOT_TOKEN=xoxb-1234567890-1234567890-abcdefghijklmnopqrstuvwx

# オプション: User Token（より詳細な情報が必要な場合）
SLACK_USER_TOKEN=xoxp-1234567890-1234567890-1234567890-abcdefghijklmnopqrstuvwx
```

## 👤 SlackユーザーIDの確認方法

### 方法1: Slack Web APIを使用

```bash
# 1. ワークスペースのユーザー一覧を取得
curl -H "Authorization: Bearer YOUR_BOT_TOKEN" \
     "https://slack.com/api/users.list"

# 2. 特定のユーザーを検索（メールアドレスで）
curl -H "Authorization: Bearer YOUR_BOT_TOKEN" \
     "https://slack.com/api/users.lookupByEmail?email=your-email@example.com"
```

### 方法2: Slack アプリから確認

1. Slackアプリでプロフィールを開く
2. 「その他」→ 「メンバーIDをコピー」
3. `U1234567890` 形式のIDを取得

### 方法3: ブラウザの開発者ツール

1. Slack Webで自分のプロフィールを開く
2. 開発者ツール（F12）を開く
3. URLまたはHTMLで `U` から始まるIDを探す

## 🛠️ 設定の確認

### 1. Bot Token のテスト

```bash
# 正しいBot Tokenでテスト
curl -H "Authorization: Bearer xoxb-YOUR-BOT-TOKEN" \
     https://slack.com/api/auth.test
```

**期待される応答** (Bot Token):
```json
{
  "ok": true,
  "url": "https://yourworkspace.slack.com/",
  "team": "Your Team",
  "user": "portfolio_bot",  // ← Bot名
  "team_id": "T1234567890",
  "user_id": "U1234567890",
  "bot_id": "B1234567890"   // ← Bot ID が存在
}
```

**間違ったUser Tokenの場合**:
```json
{
  "ok": true,
  "url": "https://yourworkspace.slack.com/",
  "team": "Your Team",
  "user": "your_username",  // ← ユーザー名
  "team_id": "T1234567890",
  "user_id": "U1234567890"
  // bot_id が存在しない
}
```

### 2. ユーザー情報の取得テスト

```bash
# Bot Tokenでユーザー情報を取得
curl -H "Authorization: Bearer xoxb-YOUR-BOT-TOKEN" \
     "https://slack.com/api/users.info?user=U0HQ1C677"
```

**成功時の応答**:
```json
{
  "ok": true,
  "user": {
    "id": "U0HQ1C677",
    "name": "username",
    "real_name": "Real Name",
    "profile": {
      "display_name": "Display Name",
      "status_text": "離席中",
      "status_emoji": ":away:"
    }
  }
}
```

**missing_scope エラーの場合**:
```json
{
  "ok": false,
  "error": "missing_scope",
  "needed": "users:read",
  "provided": ""
}
```

## 📝 管理画面での設定

ポートフォリオの管理画面で以下を設定：

1. **SlackユーザーID**: `U1234567890`（確認した実際のID）
2. **SlackワークスペースURL**: `https://yourworkspace.slack.com`
3. **Slack表示名**: `Rikiya Nishimura`（任意）

## 🔍 トラブルシューティング

### エラー: "missing_scope"
**原因**: 
1. User Token を使用している（Bot Token が必要）
2. Bot Token Scopes に `users:read` が設定されていない

**解決方法**:
1. 正しい Bot Token (`xoxb-`で始まる) を使用
2. Slack App の **Bot Token Scopes** に `users:read` を追加
3. アプリを再インストール

### エラー: "invalid_auth"
- Bot Tokenが間違っているか期限切れ
- 環境変数が正しく設定されていない
- アプリがワークスペースにインストールされていない

### エラー: "user_not_found"
- SlackユーザーIDが間違っている
- ユーザーがワークスペースに存在しない
- Botに適切な権限がない

## 🚀 動作確認

正しいBot Tokenを設定後：

1. 開発サーバーを再起動: `npm run dev`
2. ブラウザでトップページを開く
3. 氏名横にSlackステータスが表示されることを確認
4. Slackでステータスを変更して更新されることを確認

## 📊 API呼び出し頻度

- **自動更新**: 5分ごと
- **手動更新**: `/api/slack/status` への POST リクエスト
- **レート制限**: Slack API の制限に準拠（Tier 3: 50+ requests per minute）

## 🔒 セキュリティ考慮事項

- **Bot Token** は User Token よりも安全
- Bot Tokenは `.env.local` に保存し、Gitにコミットしない
- 最小限の権限のみを付与
- 定期的にトークンをローテーション
- ワークスペース管理者の承認を得る

## 📞 サポート

問題が発生した場合：
1. この手順を再確認
2. Slack API のドキュメントを参照
3. 開発者ツールでエラーログを確認
4. 必要に応じてSlackワークスペース管理者に相談 