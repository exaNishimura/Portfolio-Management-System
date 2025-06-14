import { createClient } from '@/utils/supabase/server'

/**
 * 管理者権限をチェックする関数
 */
export async function checkAdminAccess(): Promise<{ isAdmin: boolean; user: any | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, user: null }
  }

  // 環境変数から管理者メールアドレスを取得
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
  
  // ユーザーのメールアドレスが管理者リストに含まれているかチェック
  const isAdmin = adminEmails.includes(user.email || '')

  return { isAdmin, user }
}

/**
 * 管理者でない場合はエラーを投げる関数
 */
export async function requireAdmin() {
  const { isAdmin, user } = await checkAdminAccess()
  
  if (!isAdmin) {
    throw new Error('管理者権限が必要です')
  }
  
  return user
} 