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

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border/95 bg-sidebar/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] transition-colors ${
                active
                  ? "font-medium text-sidebar-primary"
                  : "text-sidebar-foreground/45"
              }`}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2 : 1.5}
              />
              {label}
            </Link>
          );
        })}
        <form action={logOut} className="flex flex-1">
          <button
            type="submit"
            className="flex w-full flex-col items-center gap-0.5 py-1 text-[10px] text-sidebar-foreground/45 transition-colors"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
      {/* Safe area padding for phones with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
