"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function GradientButton({
  href,
  children,
  variant = "primary",
  className,
  trackingSource,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  trackingSource?: string;
}) {
  function handleClick() {
    if (!href.startsWith("/login")) return;

    trackEvent("landing_cta_click", {
      source: trackingSource ?? "gradient_button",
      href,
    });
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold transition-shadow",
          variant === "primary" &&
            "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(184,80,58,0.18)] hover:shadow-[0_14px_28px_rgba(184,80,58,0.24)]",
          variant === "outline" &&
            "border border-border bg-card/40 text-foreground hover:bg-muted/60",
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}
