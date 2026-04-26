"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 14px 34px rgba(29,27,24,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-2xl border border-border/70 bg-card/65 p-6 backdrop-blur-lg transition-colors",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
