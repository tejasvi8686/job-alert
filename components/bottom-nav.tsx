"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Home, Clock, Settings, LogOut } from "lucide-react";
import { logOut } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/history", label: "History", icon: Clock },
  { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  function isActiveRoute(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function prefetchRoute(href: string) {
    if (pathname !== href) {
      router.prefetch(href);
    }
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border/95 bg-sidebar/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActiveRoute(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              onFocus={() => prefetchRoute(href)}
              onMouseEnter={() => prefetchRoute(href)}
              onTouchStart={() => prefetchRoute(href)}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-1 text-[10px] transition-colors ${
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
            className="flex w-full cursor-pointer flex-col items-center gap-0.5 py-1 text-[10px] text-sidebar-foreground/45 transition-colors"
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
