import type { ReactNode } from "react";
import { checkAdminAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, user } = await checkAdminAccess();
  
  if (!user) {
    redirect("/auth/login");
  }
  
  if (!isAdmin) {
    redirect("/auth/access-denied");
  }
  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-neutral-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="w-full px-8 py-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">管理ダッシュボード</h2>
            <div className="text-sm text-muted-foreground">
              ログイン中: {user.email}
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
} 