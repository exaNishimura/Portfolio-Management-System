import type { ReactNode } from "react";
import { getSession } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-900">
      <header className="w-full px-8 py-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold">管理ダッシュボード</h2>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
} 