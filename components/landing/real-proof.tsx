"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";

interface RealProofProps {
  alertsThisWeek: number | null;
  lastUpdated: string;
}

const changelog = [
  { date: "Apr 26", text: "Interactive preview and launch board added to landing." },
  { date: "Apr 24", text: "Dashboard history and settings UX tightened." },
  { date: "Apr 22", text: "Role + skill + location matching logic stabilized." },
];

const roadmap = [
  "Improved ranking with stronger recency weighting",
  "Role templates for faster setup",
  "Cleaner digest format with richer apply context",
];

export function RealProof({ alertsThisWeek, lastUpdated }: RealProofProps) {
  const [activeTab, setActiveTab] = useState<"email" | "changelog" | "roadmap">(
    "email"
  );

  const alertsLabel = useMemo(() => {
    if (typeof alertsThisWeek === "number") {
      return `${alertsThisWeek} alerts`;
    }
    return "Tracking in progress";
  }, [alertsThisWeek]);

  return (
    <SectionWrapper id="proof">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Real Proof
          </p>
          <h2 className="mt-2 font-heading text-3xl tracking-tight sm:text-4xl">
            Transparent launch signals
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Instead of generic claims, this section shows live launch context and
            an example of what users receive.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            This week
          </p>
          <p className="mt-1 font-mono text-3xl tabular-nums text-primary">{alertsLabel}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aggregated from launch activity in the past 7 days.
          </p>

          <div className="mt-6 rounded-xl border border-border/70 bg-card/80 p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Sample email digest
            </p>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
                <p className="text-sm font-medium">Senior Frontend Engineer</p>
                <p className="text-xs text-muted-foreground">
                  CraftLoop · Remote · Match 95%
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
                <p className="text-sm font-medium">UI Engineer</p>
                <p className="text-xs text-muted-foreground">
                  PixelStack · Bengaluru · Match 90%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "email", label: "Digest format" },
              { id: "changelog", label: "Recent changes" },
              { id: "roadmap", label: "Up next" },
            ].map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "email" && (
            <div className="mt-5 rounded-xl border border-border/60 bg-background p-4">
              <p className="text-sm font-semibold">What users see in each digest</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[
                  "Top role matches with relevance score",
                  "Company, location, and quick context line",
                  "Direct apply link without extra navigation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon icon="solar:check-circle-bold" className="mt-0.5 h-4 w-4 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "changelog" && (
            <div className="mt-5 space-y-3">
              {changelog.map((item) => (
                <div
                  key={item.text}
                  className="rounded-xl border border-border/60 bg-background p-4"
                >
                  <p className="font-mono text-xs text-muted-foreground">{item.date}</p>
                  <p className="mt-1 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="mt-5 space-y-3">
              {roadmap.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border/60 bg-background p-4"
                >
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
