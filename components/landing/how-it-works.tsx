"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";

const steps = [
  {
    icon: "solar:user-id-bold",
    title: "Tell us your target role",
    description:
      "Set your role, skills, and location preference once. Update anytime from dashboard.",
  },
  {
    icon: "solar:cpu-bolt-bold",
    title: "We filter and rank matches",
    description:
      "New listings are scored for fit so you review a shortlist instead of raw job-board noise.",
  },
  {
    icon: "solar:mailbox-bold",
    title: "Get one daily digest",
    description:
      "Receive a focused alert with apply links, then adjust preferences based on results.",
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          How It Works
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          A clean 3-step job search workflow
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Built for launch users who want less browsing and more qualified
          opportunities.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-border/70 bg-card/70 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon icon={step.icon} className="h-5 w-5 text-primary" />
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
