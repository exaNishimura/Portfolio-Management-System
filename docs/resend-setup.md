# Resend メール送信設定手順

## 概要
ポートフォリオサイトのお問い合わせフォームでResendを使用してメール送信を行うための設定手順です。

## 1. Resendアカウントの作成

### 1.1 Resendにサインアップ
1. [Resend](https://resend.com) にアクセス
2. 「Sign up」をクリックしてアカウントを作成
3. メールアドレスを認証

### 1.2 ドメインの設定（本番環境用）
1. Resendダッシュボードで「Domains」を選択
2. 「Add Domain」をクリック
3. 所有するドメインを入力（例: yourdomain.com）
4. DNS設定を行う（SPF、DKIM、DMARC レコード）

**開発環境では、Resendの提供するテストドメインを使用可能**

## 2. API キーの取得

### 2.1 API キーの作成
1. Resendダッシュボードで「API Keys」を選択
2. 「Create API Key」をクリック
3. 名前を入力（例: Portfolio Site Contact Form）
4. 権限を「Sending access」に設定
5. 「Add」をクリックしてAPIキーを生成

### 2.2 APIキーの保存
⚠️ **重要**: APIキーは一度しか表示されないため、必ず安全な場所に保存してください。

## 3. 環境変数の設定

### 3.1 .env.local ファイルの更新
```bash
# メール設定
RESEND_API_KEY=re_NWiQbVaW_dJUR4ASvu8Q1NMkhBe7LXuxb
CONTACT_EMAIL_TO=your-email@gmail.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

### 3.2 設定項目の説明
- **RESEND_API_KEY**: Resendで取得したAPIキー
- **CONTACT_EMAIL_TO**: お問い合わせメールの送信先（あなたのメールアドレス）
- **CONTACT_EMAIL_FROM**: 送信者アドレス（認証済みドメインのアドレス）

## 4. 送信者アドレスの設定

### 4.1 開発環境
開発環境では、Resendの提供するテストドメインを使用できます：
```bash
CONTACT_EMAIL_FROM=onboarding@resend.dev
```

### 4.2 本番環境
本番環境では、認証済みの独自ドメインを使用してください：
```bash
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

## 5. 動作確認

### 5.1 テスト手順
1. 開発サーバーを起動: `npm run dev`
2. `http://localhost:3000/contact` にアクセス
3. お問い合わせフォームに入力
4. 「送信する」ボタンをクリック
5. 設定したメールアドレスにメールが届くことを確認

### 5.2 確認ポイント
- フォーム送信後に成功メッセージが表示される
- 指定したメールアドレスにお問い合わせ内容が届く
- メールの件名と本文が正しく表示される

## 6. トラブルシューティング

### よくある問題と解決方法

1. **「メール送信に失敗しました」エラー**
   - APIキーが正しく設定されているか確認
   - Resendの利用制限に達していないか確認
   - 送信者アドレスが認証済みドメインか確認

2. **メールが届かない**
   - 送信先メールアドレスが正しいか確認
   - スパムフォルダを確認
   - Resendダッシュボードでログを確認

3. **認証エラー**
   - APIキーが有効か確認
   - APIキーの権限設定を確認

## 7. 本番環境での設定

### 7.1 ドメイン認証
本番環境では必ず独自ドメインを認証してください：

1. Resendダッシュボードでドメインを追加
2. DNS設定を行う
3. 認証完了後、環境変数を更新

### 7.2 セキュリティ考慮事項
- APIキーは環境変数として安全に管理
- 送信制限を設定してスパム対策
- ログを定期的に確認

## 8. 料金について

### 8.1 無料プラン
- 月間3,000通まで無料
- 開発・テスト用途には十分

### 8.2 有料プラン
- より多くのメール送信が必要な場合
- 詳細は[Resend Pricing](https://resend.com/pricing)を参照

## 参考リンク

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Next.js Integration Guide](https://resend.com/docs/send-with-nextjs) 