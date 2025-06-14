#!/usr/bin/env node

/**
 * GitHub OAuth認証テストスクリプト
 * 
 * このスクリプトは開発環境でGitHub認証が正しく設定されているかテストします。
 */

const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// .env.localファイルを読み込む
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    });
    console.log('✅ .env.local ファイルを読み込みました');
  } else {
    console.log('⚠️  .env.local ファイルが見つかりません');
  }
}

// 環境変数を読み込み
loadEnvFile();

// 設定
const SUPABASE_PROJECT_ID = 'cxvxovkxirsfpzsvcwrh';
const CALLBACK_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/auth/v1/callback`;
const LOCAL_LOGIN_URL = 'http://localhost:3000/auth/login';

console.log('\n🔍 GitHub OAuth認証設定テスト');
console.log('================================');

// 1. ローカル開発サーバーの確認
console.log('\n1. ローカル開発サーバーの確認...');
testLocalServer();

// 2. Supabaseコールバック URLの確認
console.log('\n2. Supabaseコールバック URLの確認...');
testSupabaseCallback();

// 3. 設定手順の表示
console.log('\n3. GitHub OAuth設定手順:');
console.log('================================');
console.log('✅ 必要な設定:');
console.log(`   • GitHub OAuth App作成: https://github.com/settings/developers`);
console.log(`   • Callback URL: ${CALLBACK_URL}`);
console.log(`   • Supabaseダッシュボード設定: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/auth/providers`);
console.log(`   • 環境変数 ADMIN_EMAILS の設定`);

console.log('\n📋 テスト手順:');
console.log('   1. 上記の設定を完了');
console.log(`   2. ${LOCAL_LOGIN_URL} にアクセス`);
console.log('   3. "GitHubでログイン" ボタンをクリック');
console.log('   4. GitHub認証画面で承認');
console.log('   5. 管理者ダッシュボードにリダイレクトされることを確認');

function testLocalServer() {
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ ローカル開発サーバーが起動中 (http://localhost:3000)');
    } else {
      console.log(`⚠️  ローカル開発サーバーのレスポンス: ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    console.log('❌ ローカル開発サーバーが起動していません');
    console.log('   npm run dev を実行してください');
  });

  req.on('timeout', () => {
    console.log('⚠️  ローカル開発サーバーの応答がタイムアウトしました');
    req.destroy();
  });

  req.end();
}

function testSupabaseCallback() {
  const url = new URL(CALLBACK_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
    timeout: 10000
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 400 || res.statusCode === 404) {
      console.log('✅ Supabaseコールバック URLが有効');
    } else {
      console.log(`⚠️  Supabaseコールバック URLのレスポンス: ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    console.log('❌ Supabaseコールバック URLにアクセスできません');
    console.log(`   URL: ${CALLBACK_URL}`);
  });

  req.on('timeout', () => {
    console.log('⚠️  Supabaseコールバック URLの応答がタイムアウトしました');
    req.destroy();
  });

  req.end();
}

// 環境変数の確認
console.log('\n4. 環境変数の確認:');
console.log('================================');
const adminEmails = process.env.ADMIN_EMAILS;
if (adminEmails) {
  console.log(`✅ ADMIN_EMAILS: ${adminEmails}`);
} else {
  console.log('⚠️  ADMIN_EMAILS が設定されていません');
  console.log('   .env.local ファイルで設定してください');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL が設定されていません');
}

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (supabaseKey) {
  console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`);
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません');
}

console.log('\n🚀 準備完了後、ブラウザで認証テストを実行してください!'); 