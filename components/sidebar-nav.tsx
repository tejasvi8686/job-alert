"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Settings, LogOut } from "lucide-react";
import { logOut } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/history", label: "History", icon: Clock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col px-3 pb-4">
      <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-sidebar-foreground/35">
        Workspace
      </p>
      <div className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all ${
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-foreground shadow-[inset_0_0_0_1px_rgba(29,27,24,0.06)]"
                  : "text-sidebar-foreground/50 hover:bg-sidebar-accent/55 hover:text-sidebar-foreground/80"
              }`}
            >
              <span
                className={`absolute top-2 bottom-2 left-1 w-0.5 rounded-full transition-opacity ${
                  active
                    ? "bg-sidebar-primary opacity-100"
                    : "bg-sidebar-primary/60 opacity-0 group-hover:opacity-60"
                }`}
              />
              <Icon
                className="h-[15px] w-[15px]"
                strokeWidth={active ? 2 : 1.5}
              />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto border-t border-sidebar-border/80 pt-3">
        <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-sidebar-foreground/35">
          Account
        </p>
        <form action={logOut}>
          <button
            type="submit"
            className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent/45 hover:text-sidebar-foreground/75"
          >
            <LogOut className="h-[15px] w-[15px]" strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
