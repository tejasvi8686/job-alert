"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap-config";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";

interface MockJob {
  company: string;
  role: string;
  location: string;
  match: number;
  tags: string[];
}

interface Scenario {
  id: string;
  label: string;
  accuracy: number;
  jobs: MockJob[];
}

const scenarios: Scenario[] = [
  {
    id: "frontend",
    label: "Frontend",
    accuracy: 95,
    jobs: [
      {
        company: "CraftLoop",
        role: "Senior Frontend Engineer",
        location: "Remote",
        match: 95,
        tags: ["React", "TypeScript"],
      },
      {
        company: "PixelStack",
        role: "UI Engineer",
        location: "Bengaluru",
        match: 90,
        tags: ["Next.js", "Design Systems"],
      },
      {
        company: "CloudBase",
        role: "React Developer",
        location: "Remote",
        match: 84,
        tags: ["React", "Tailwind"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    accuracy: 91,
    jobs: [
      {
        company: "DataForge",
        role: "Backend Engineer",
        location: "Pune",
        match: 92,
        tags: ["Node.js", "PostgreSQL"],
      },
      {
        company: "ScaleNest",
        role: "API Platform Engineer",
        location: "Remote",
        match: 89,
        tags: ["Go", "Kubernetes"],
      },
      {
        company: "QueueLabs",
        role: "Distributed Systems Engineer",
        location: "Hyderabad",
        match: 83,
        tags: ["Kafka", "Redis"],
      },
    ],
  },
  {
    id: "aiml",
    label: "AI / ML",
    accuracy: 88,
    jobs: [
      {
        company: "ModelWorks",
        role: "ML Engineer",
        location: "Remote",
        match: 90,
        tags: ["Python", "PyTorch"],
      },
      {
        company: "SignalMint",
        role: "Applied AI Engineer",
        location: "Delhi",
        match: 87,
        tags: ["LLMs", "RAG"],
      },
      {
        company: "OrbitData",
        role: "Data Scientist",
        location: "Remote",
        match: 82,
        tags: ["SQL", "XGBoost"],
      },
    ],
  },
];

export function DashboardPreview() {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const counterRef = useRef<HTMLSpanElement>(null);

  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];

  useEffect(() => {
    if (!counterRef.current) return;

    const previous = Number(counterRef.current.dataset.value ?? "0");
    const obj = { val: previous };
    const tween = gsap.to(obj, {
      val: activeScenario.accuracy,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        if (!counterRef.current) return;
        const rounded = Math.round(obj.val);
        counterRef.current.textContent = `${rounded}%`;
        counterRef.current.dataset.value = String(rounded);
      },
    });

    return () => {
      tween.kill();
    };
  }, [activeScenario.accuracy]);

  return (
    <SectionWrapper id="preview">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Live Preview
          </p>
          <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
            Try different roles and watch the feed adapt
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This preview is interactive. Switch roles to see how matching shifts
            by domain and skills.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {scenarios.map((scenario) => {
              const active = scenario.id === activeScenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>

          <ul className="mt-6 space-y-3">
            {[
              "AI-ranked by relevance",
              "Match scores for every job",
              "One-click apply links",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground/85">
                <Icon
                  icon="solar:check-circle-bold"
                  className="h-4 w-4 shrink-0 text-success"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground/80">
              Average match accuracy for {activeScenario.label}
            </p>
            <span
              ref={counterRef}
              data-value="0"
              className="font-mono text-4xl font-semibold tabular-nums text-primary"
            >
              0%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border/70 bg-card/70 p-1 backdrop-blur-lg"
        >
          <div className="rounded-xl border border-border/60 bg-background p-5">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-2">
                <Icon icon="solar:suitcase-bold" className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  {activeScenario.label} matches
                </span>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs text-primary">
                {activeScenario.jobs.length} new
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {activeScenario.jobs.map((job) => (
                <div
                  key={`${activeScenario.id}-${job.role}`}
                  className="rounded-lg border border-border/60 bg-card/50 p-4 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{job.role}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        job.match >= 90
                          ? "bg-success/10 text-success"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {job.match}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon icon="solar:map-point-bold" className="h-3 w-3" />
                      {job.location}
                    </span>
                    <div className="flex gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
