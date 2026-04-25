import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/sidebar-nav";
import { Briefcase } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
          <Briefcase className="h-5 w-5 text-sidebar-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">
            AI Job Alerts
          </span>
        </div>
        <div className="px-6 py-3">
          <p className="truncate text-xs text-sidebar-foreground/60">
            {user.email}
          </p>
        </div>
        <SidebarNav />
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
