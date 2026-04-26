"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";

const integrations = [
  { icon: "solar:letter-bold", label: "Email Delivery", description: "Direct to your inbox" },
  { icon: "solar:magic-stick-3-bold", label: "AI Filtering", description: "GPT-4o powered" },
  { icon: "solar:global-bold", label: "API Sources", description: "Multiple job boards" },
  { icon: "solar:calendar-bold", label: "Daily Schedule", description: "9 AM UTC delivery" },
  { icon: "solar:bell-bold", label: "Notifications", description: "Never miss a match" },
  { icon: "solar:database-bold", label: "History", description: "Track past alerts" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function Integrations() {
  return (
    <SectionWrapper id="integrations">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Integrations
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Seamless Integrations
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Connect with your favorite tools in a unified workflow.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
      >
        {integrations.map((item) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card/55 p-6 text-center transition-colors hover:border-border"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon icon={item.icon} className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
