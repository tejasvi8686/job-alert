"use client";

import { motion } from "framer-motion";

const launchStats = [
  { label: "Stage", value: "Public beta" },
  { label: "Status", value: "Actively shipping" },
  { label: "Early spots", value: "First 100 users" },
  { label: "Pricing now", value: "Free during beta" },
];

export function TrustStrip() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-y border-border/70 bg-muted/30 py-12"
    >
      <p className="text-center text-sm text-muted-foreground">
        Launch update: no fake logos, no fake testimonials, just product progress.
      </p>

      <div className="mx-auto mt-8 grid max-w-5xl gap-3 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {launchStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="rounded-xl border border-border/70 bg-card/70 px-4 py-3"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-5xl px-6">
        <div className="h-2 overflow-hidden rounded-full bg-card">
          <div className="h-full w-[42%] rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Current milestone: core matching + email pipeline complete.
        </p>
      </div>
    </motion.section>
  );
}
