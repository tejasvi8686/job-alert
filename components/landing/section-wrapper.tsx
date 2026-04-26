"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionWrapper({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn("mx-auto max-w-7xl px-6 py-24", className)}
    >
      {children}
    </motion.section>
  );
}
