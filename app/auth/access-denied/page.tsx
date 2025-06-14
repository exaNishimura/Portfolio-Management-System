import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldX, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function AccessDeniedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <ShieldX className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">アクセス拒否</CardTitle>
            <CardDescription>
              このページにアクセスする権限がありません
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              {user && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    現在のアカウント:
                  </p>
                  <p className="font-medium">{user.email}</p>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                管理者権限が必要です。<br />
                管理者アカウントでログインしてください。
              </p>
              
              <div className="space-y-3">
                <form action="/auth/signout" method="post" className="w-full">
                  <Button type="submit" variant="outline" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウトして別のアカウントでログイン
                  </Button>
                </form>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    トップページに戻る
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 開発用情報 */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-4 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">開発用情報</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>管理者権限が必要です。</p>
              <p>環境変数 ADMIN_EMAILS にメールアドレスを設定してください。</p>
              <p className="mt-2 text-orange-600">
                例: ADMIN_EMAILS=admin@example.com,user@example.com
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 