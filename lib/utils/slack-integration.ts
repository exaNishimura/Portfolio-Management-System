/**
 * Slack API連携ユーティリティ
 * Slackユーザーのアクティブ状態やプロフィール情報を取得
 */

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  display_name: string;
  status_text: string;
  status_emoji: string;
  is_active: boolean;
  presence: 'active' | 'away';
  last_activity?: string;
}

export interface SlackProfile {
  display_name: string;
  status_text: string;
  status_emoji: string;
  real_name: string;
  image_72: string;
}

/**
 * Slack Web APIを使用してユーザー情報を取得
 */
export async function getSlackUserInfo(token: string, userId: string): Promise<SlackUser | null> {
  try {
    const response = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack API Error:', data.error);
      console.error('Slack API Error Details:', JSON.stringify(data, null, 2));
      return null;
    }

    const user = data.user;
    return {
      id: user.id,
      name: user.name,
      real_name: user.real_name || user.name,
      display_name: user.profile?.display_name || user.real_name || user.name,
      status_text: user.profile?.status_text || '',
      status_emoji: user.profile?.status_emoji || '',
      is_active: user.presence === 'active',
      presence: user.presence || 'away',
    };
  } catch (error) {
    console.error('Slack API request failed:', error);
    return null;
  }
}

/**
 * Slack Web APIを使用してユーザーのプレゼンス（アクティブ状態）を取得
 */
export async function getSlackUserPresence(token: string, userId: string): Promise<'active' | 'away' | null> {
  try {
    const response = await fetch(`https://slack.com/api/users.getPresence?user=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack Presence API Error:', data.error);
      console.error('Slack Presence API Error Details:', JSON.stringify(data, null, 2));
      return null;
    }

    return data.presence;
  } catch (error) {
    console.error('Slack Presence API request failed:', error);
    return null;
  }
}

/**
 * Slackワークスペース情報を取得
 */
export async function getSlackWorkspaceInfo(token: string) {
  try {
    const response = await fetch('https://slack.com/api/team.info', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack Team API Error:', data.error);
      return null;
    }

    return {
      id: data.team.id,
      name: data.team.name,
      domain: data.team.domain,
      url: `https://${data.team.domain}.slack.com`,
    };
  } catch (error) {
    console.error('Slack Team API request failed:', error);
    return null;
  }
}

/**
 * Slackステータスの絵文字を解析してUnicodeに変換
 */
export function parseSlackEmoji(emoji: string): string {
  if (!emoji) return '';
  
  // カスタム絵文字の場合（:custom_emoji:）
  if (emoji.startsWith(':') && emoji.endsWith(':')) {
    const emojiName = emoji.slice(1, -1);
    
    // 一般的な絵文字のマッピング
    const emojiMap: Record<string, string> = {
      'coffee': '☕',
      'computer': '💻',
      'phone': '📱',
      'meeting': '🤝',
      'lunch': '🍽️',
      'vacation': '🏖️',
      'sick': '🤒',
      'working': '💼',
      'focus': '🎯',
      'busy': '🔥',
    };
    
    return emojiMap[emojiName] || '📍';
  }
  
  return emoji;
}

/**
 * アクティブ状態に基づいてステータス表示を生成
 */
export function getSlackStatusDisplay(user: SlackUser): {
  text: string;
  emoji: string;
  color: 'green' | 'yellow' | 'gray';
} {
  if (user.is_active) {
    return {
      text: user.status_text || 'オンライン',
      emoji: user.status_emoji ? parseSlackEmoji(user.status_emoji) : '🟢',
      color: 'green',
    };
  } else {
    return {
      text: user.status_text || '離席中',
      emoji: user.status_emoji ? parseSlackEmoji(user.status_emoji) : '🟡',
      color: user.status_text ? 'yellow' : 'gray',
    };
  }
} 