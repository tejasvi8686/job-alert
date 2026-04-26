"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";
import { GlassCard } from "./glass-card";

interface LaunchItem {
  title: string;
  detail: string;
  status: "live" | "building" | "queued";
}

const launchBoards: Record<string, { label: string; items: LaunchItem[] }> = {
  now: {
    label: "Live now",
    items: [
      {
        title: "Auth and onboarding",
        detail: "Email + Google sign in and subscription setup are working.",
        status: "live",
      },
      {
        title: "Daily alert flow",
        detail: "Role + skill + location based matching is active.",
        status: "live",
      },
      {
        title: "History and settings",
        detail: "Users can review alerts and update preferences in dashboard.",
        status: "live",
      },
    ],
  },
  next: {
    label: "Shipping next",
    items: [
      {
        title: "Stronger ranking",
        detail: "Better prioritization by seniority, recency, and remote fit.",
        status: "building",
      },
      {
        title: "Role templates",
        detail: "One-click starter profiles for common tech roles.",
        status: "building",
      },
      {
        title: "Cleaner email digest",
        detail: "Shorter summaries with direct apply actions and highlights.",
        status: "building",
      },
    ],
  },
  later: {
    label: "Planned",
    items: [
      {
        title: "Slack / WhatsApp delivery",
        detail: "Optional channels beyond email for alerts.",
        status: "queued",
      },
      {
        title: "Saved searches",
        detail: "Multiple profiles per user and quick switching.",
        status: "queued",
      },
      {
        title: "Application tracker",
        detail: "Track what you applied to and follow-up status.",
        status: "queued",
      },
    ],
  },
};

function StatusPill({ status }: { status: LaunchItem["status"] }) {
  const styles =
    status === "live"
      ? "bg-success/12 text-success"
      : status === "building"
        ? "bg-chart-4/15 text-chart-4"
        : "bg-muted text-muted-foreground";

  const label =
    status === "live" ? "Live" : status === "building" ? "Building" : "Queued";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
      {label}
    </span>
  );
}

export function Testimonials() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof launchBoards>("now");

  const board = launchBoards[activeTab];

  return (
    <SectionWrapper id="testimonials">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Launch Board
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Real progress, updated openly
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          This product is in launch mode. Here is what is already live and what
          we are shipping next.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {(Object.keys(launchBoards) as Array<keyof typeof launchBoards>).map((key) => {
          const isActive = key === activeTab;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {launchBoards[key].label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-8 grid gap-6 md:grid-cols-3"
      >
        {board.items.map((item) => (
          <GlassCard key={item.title} className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <StatusPill status={item.status} />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Icon icon="solar:clock-circle-bold" className="h-3.5 w-3.5" />
              Updated for launch cycle
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
