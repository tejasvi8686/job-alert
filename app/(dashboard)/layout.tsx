import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/sidebar-nav";
import DashboardSignupCompleteTracker from "@/components/analytics/dashboard-signup-complete-tracker";

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px]">
        <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border/95 bg-sidebar/95 backdrop-blur-sm md:sticky md:top-0 md:flex">
          <div className="border-b border-sidebar-border px-5 pt-7 pb-4">
            <h1 className="font-heading text-2xl leading-none text-sidebar-foreground">
              JobAlert
            </h1>
            <p className="mt-2 text-xs text-sidebar-foreground/55">
              Launch dashboard
            </p>
          </div>
          <div className="px-5 pt-3 pb-2">
            <p className="truncate text-xs text-sidebar-foreground/50">
              {user.email}
            </p>
          </div>
          <SidebarNav />
          <div className="border-t border-sidebar-border/80 px-5 py-3">
            <p className="text-[11px] uppercase tracking-wider text-sidebar-foreground/35">
              Private workspace
            </p>
          </div>
        </aside>
        <main className="relative flex-1 overflow-y-auto">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.06] to-transparent" />
          <div className="relative">
            <DashboardSignupCompleteTracker />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
