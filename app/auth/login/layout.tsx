import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  // ログインページでは認証チェックを行わず、シンプルなレイアウトを使用
  return <>{children}</>;
} 