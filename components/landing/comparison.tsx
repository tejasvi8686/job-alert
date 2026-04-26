"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";

interface ComparisonMetric {
  label: string;
  helper: string;
  manualLabel: string;
  jobAlertLabel: string;
  manualScore: number;
  jobAlertScore: number;
}

interface ComparisonRow {
  stage: string;
  manual: string;
  jobAlert: string;
  impact: string;
}

interface ComparisonMode {
  label: string;
  subtitle: string;
  manualPoints: string[];
  jobAlertPoints: string[];
  metrics: ComparisonMetric[];
  rows: ComparisonRow[];
}

const comparisonModes: Record<"efficiency" | "quality", ComparisonMode> = {
  efficiency: {
    label: "Efficiency",
    subtitle: "How much routine work gets removed from the process",
    manualPoints: [
      "Open and filter multiple job boards repeatedly",
      "Manually scan and triage mixed-quality results",
      "Track leads across tabs, email, and notes",
    ],
    jobAlertPoints: [
      "Single curated digest aligned to your profile",
      "Pre-ranked list by role, skills, and location",
      "One dashboard for history and preference updates",
    ],
    metrics: [
      {
        label: "Search time",
        helper: "Average effort to find shortlist",
        manualLabel: "~2.5 hr / day",
        jobAlertLabel: "~20 min / day",
        manualScore: 26,
        jobAlertScore: 84,
      },
      {
        label: "Tabs / sources checked",
        helper: "Context switching overhead",
        manualLabel: "5-7 sources",
        jobAlertLabel: "1 digest",
        manualScore: 31,
        jobAlertScore: 89,
      },
      {
        label: "Repeat filtering actions",
        helper: "Re-entering same criteria daily",
        manualLabel: "15-20 actions",
        jobAlertLabel: "1-2 actions",
        manualScore: 22,
        jobAlertScore: 91,
      },
      {
        label: "Time to first useful role",
        helper: "Delay before good matches appear",
        manualLabel: "~45 min",
        jobAlertLabel: "~8 min",
        manualScore: 28,
        jobAlertScore: 86,
      },
    ],
    rows: [
      {
        stage: "Discovery",
        manual: "Jump between several boards and run similar searches.",
        jobAlert: "Receive one pre-filtered feed matched to your profile.",
        impact: "Less setup friction",
      },
      {
        stage: "Filtering",
        manual: "Remove irrelevant listings one by one.",
        jobAlert: "Start from ranked roles with relevance context.",
        impact: "Faster triage",
      },
      {
        stage: "Shortlisting",
        manual: "Track options manually in notes or bookmarks.",
        jobAlert: "Use a consistent list with historical alert context.",
        impact: "Lower context loss",
      },
      {
        stage: "Follow-through",
        manual: "Re-check old links and duplicate postings.",
        jobAlert: "Focus on fresh entries from current digest.",
        impact: "More focused effort",
      },
    ],
  },
  quality: {
    label: "Quality",
    subtitle: "How the relevance and actionability of roles improve",
    manualPoints: [
      "High noise from broad keyword-only results",
      "Duplicate or stale jobs dilute attention",
      "Harder to prioritize where to apply first",
    ],
    jobAlertPoints: [
      "Role + skill + location based filtering",
      "Cleaner shortlist with match scoring cues",
      "Better focus on apply-ready opportunities",
    ],
    metrics: [
      {
        label: "Relevant roles in shortlist",
        helper: "Useful matches from reviewed set",
        manualLabel: "~35%",
        jobAlertLabel: "~78%",
        manualScore: 35,
        jobAlertScore: 78,
      },
      {
        label: "Duplicate / stale listings",
        helper: "Share of low-value entries",
        manualLabel: "~30%",
        jobAlertLabel: "~8%",
        manualScore: 33,
        jobAlertScore: 82,
      },
      {
        label: "Apply-ready roles",
        helper: "Good-fit opportunities worth applying to",
        manualLabel: "~2 / day",
        jobAlertLabel: "~5 / day",
        manualScore: 40,
        jobAlertScore: 86,
      },
      {
        label: "Confidence in shortlist",
        helper: "Signal quality before applying",
        manualLabel: "4 / 10",
        jobAlertLabel: "8 / 10",
        manualScore: 40,
        jobAlertScore: 80,
      },
    ],
    rows: [
      {
        stage: "Matching logic",
        manual: "Heavy dependence on broad keywords.",
        jobAlert: "Combines role intent, skills, and location.",
        impact: "Higher precision",
      },
      {
        stage: "Result quality",
        manual: "Mixed quality with more cleanup needed.",
        jobAlert: "Shortlist is tighter and easier to review.",
        impact: "Lower noise",
      },
      {
        stage: "Prioritization",
        manual: "Manual guesswork on what to apply first.",
        jobAlert: "Match-led ordering helps sequence decisions.",
        impact: "Better focus",
      },
      {
        stage: "Daily consistency",
        manual: "Output varies with available time each day.",
        jobAlert: "Steady digest cadence reduces gaps.",
        impact: "More predictable pipeline",
      },
    ],
  },
};

function BenchmarkBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "manual" | "jobalert";
}) {
  const color =
    tone === "manual"
      ? "bg-muted-foreground/35"
      : "bg-gradient-to-r from-primary to-success";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums text-foreground/80">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export function Comparison() {
  const [mode, setMode] = useState<"efficiency" | "quality">("efficiency");
  const data = comparisonModes[mode];

  return (
    <SectionWrapper id="comparison">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Comparison
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Manual Search vs JobAlert
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Launch-stage benchmark view focused on practical workflow outcomes.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {(Object.keys(comparisonModes) as Array<keyof typeof comparisonModes>).map(
          (key) => {
            const active = key === mode;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/70 text-muted-foreground hover:bg-muted"
                }`}
              >
                {comparisonModes[key].label}
              </button>
            );
          }
        )}
      </div>

      <p className="mt-3 text-center text-sm text-muted-foreground">{data.subtitle}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
          <div className="flex items-center gap-2">
            <Icon icon="solar:close-circle-bold" className="h-4 w-4 text-destructive/70" />
            <p className="text-sm font-semibold">Typical manual workflow</p>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {data.manualPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2">
            <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-success" />
            <p className="text-sm font-semibold">With JobAlert</p>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground/85">
            {data.jobAlertPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success/80" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {data.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-border/70 bg-card/60 p-4"
          >
            <p className="text-sm font-semibold">{metric.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{metric.helper}</p>
            <div className="mt-3 space-y-3">
              <BenchmarkBar
                label={`Manual · ${metric.manualLabel}`}
                value={metric.manualScore}
                tone="manual"
              />
              <BenchmarkBar
                label={`JobAlert · ${metric.jobAlertLabel}`}
                value={metric.jobAlertScore}
                tone="jobalert"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card/60">
        <div className="hidden grid-cols-4 border-b border-border/70 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <span>Stage</span>
          <span>Manual</span>
          <span>JobAlert</span>
          <span>Impact</span>
        </div>

        <div className="space-y-3 p-3 md:space-y-0 md:p-0">
          {data.rows.map((row, index) => (
            <motion.div
              key={row.stage}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="rounded-xl border border-border/60 bg-background p-4 md:grid md:grid-cols-4 md:rounded-none md:border-0 md:bg-transparent md:px-5 md:py-4"
            >
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
                  Stage
                </p>
                <p className="text-sm font-medium">{row.stage}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
                  Manual
                </p>
                <p className="text-sm text-muted-foreground">{row.manual}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
                  JobAlert
                </p>
                <p className="text-sm text-foreground/85">{row.jobAlert}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
                  Impact
                </p>
                <span className="inline-flex rounded-full bg-success/12 px-2.5 py-0.5 text-xs font-medium text-success">
                  {row.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Benchmark data is directional and intended to show workflow deltas during
        launch, not guaranteed outcomes.
      </p>
    </SectionWrapper>
  );
}
