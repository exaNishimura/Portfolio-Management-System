/**
 * Slack API設定テストスクリプト
 * 
 * 使用方法:
 * 1. .env.localにSLACK_BOT_TOKENを設定
 * 2. node scripts/test-slack-setup.js
 */

require('dotenv').config({ path: '.env.local' });

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_BOT_TOKEN || SLACK_BOT_TOKEN === 'xoxb-xxx') {
  console.error('❌ SLACK_BOT_TOKEN が設定されていないか、プレースホルダーのままです');
  console.log('📝 .env.local ファイルで実際のBot Tokenを設定してください');
  process.exit(1);
}

async function testSlackAPI() {
  console.log('🔍 Slack API設定をテストしています...\n');

  try {
    // 1. Bot Token の認証テスト
    console.log('1️⃣ Bot Token の認証テスト');
    const authResponse = await fetch('https://slack.com/api/auth.test', {
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const authData = await authResponse.json();
    
    if (!authData.ok) {
      console.error('❌ Bot Token認証失敗:', authData.error);
      return;
    }

    console.log('✅ Bot Token認証成功');
    console.log(`   ワークスペース: ${authData.team}`);
    console.log(`   Bot ID: ${authData.bot_id}`);
    console.log(`   ワークスペースURL: ${authData.url}\n`);

    // 2. ユーザー一覧の取得
    console.log('2️⃣ ワークスペースのユーザー一覧を取得');
    const usersResponse = await fetch('https://slack.com/api/users.list', {
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const usersData = await usersResponse.json();
    
    if (!usersData.ok) {
      console.error('❌ ユーザー一覧取得失敗:', usersData.error);
      return;
    }

    console.log('✅ ユーザー一覧取得成功');
    console.log(`   総ユーザー数: ${usersData.members.length}\n`);

    // 3. アクティブユーザーの表示
    console.log('3️⃣ ワークスペースのアクティブユーザー一覧:');
    console.log('----------------------------------------');
    
    const activeUsers = usersData.members.filter(user => 
      !user.deleted && 
      !user.is_bot && 
      user.id !== 'USLACKBOT'
    );

    activeUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.real_name || user.name}`);
      console.log(`   ユーザーID: ${user.id}`);
      console.log(`   表示名: ${user.profile?.display_name || user.real_name || user.name}`);
      console.log(`   メール: ${user.profile?.email || 'N/A'}`);
      if (user.profile?.status_text) {
        console.log(`   ステータス: ${user.profile.status_emoji || ''} ${user.profile.status_text}`);
      }
      console.log('');
    });

    // 4. 特定ユーザーの詳細情報取得（現在の設定から）
    console.log('4️⃣ 現在設定されているユーザーIDのテスト');
    const currentUserId = 'rikiya_nisimura'; // 現在の設定値
    
    console.log(`   現在の設定: ${currentUserId}`);
    console.log('   ❌ これはユーザー名であり、正しいSlackユーザーIDではありません');
    console.log('   ✅ 正しい形式: U1234567890 (上記リストから選択してください)\n');

    // 5. 推奨設定の提案
    console.log('5️⃣ 推奨設定:');
    console.log('----------------------------------------');
    
    // メールアドレスまたは名前で推測
    const suggestedUser = activeUsers.find(user => 
      user.real_name?.toLowerCase().includes('rikiya') ||
      user.real_name?.toLowerCase().includes('nishimura') ||
      user.profile?.email?.includes('nishimura')
    );

    if (suggestedUser) {
      console.log('🎯 推奨ユーザー（名前から推測）:');
      console.log(`   名前: ${suggestedUser.real_name}`);
      console.log(`   ユーザーID: ${suggestedUser.id}`);
      console.log(`   メール: ${suggestedUser.profile?.email || 'N/A'}`);
      console.log('');
      console.log('📝 管理画面での設定:');
      console.log(`   SlackユーザーID: ${suggestedUser.id}`);
      console.log(`   SlackワークスペースURL: ${authData.url}`);
      console.log(`   Slack表示名: ${suggestedUser.profile?.display_name || suggestedUser.real_name}`);
    } else {
      console.log('❓ 名前から自動推測できませんでした');
      console.log('   上記リストから適切なユーザーIDを選択してください');
    }

    console.log('\n✅ テスト完了！');
    console.log('📋 次のステップ:');
    console.log('   1. 管理画面でSlackユーザーIDを正しい形式に更新');
    console.log('   2. SlackワークスペースURLを設定');
    console.log('   3. ブラウザでSlackステータス表示を確認');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    console.log('\n🔧 トラブルシューティング:');
    console.log('   1. インターネット接続を確認');
    console.log('   2. SLACK_BOT_TOKENが正しく設定されているか確認');
    console.log('   3. Slack Appがワークスペースにインストールされているか確認');
  }
}

// メイン実行
testSlackAPI(); 