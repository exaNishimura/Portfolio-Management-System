import type { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-neutral-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="w-full px-8 py-4 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">管理ダッシュボード</h2>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
} 