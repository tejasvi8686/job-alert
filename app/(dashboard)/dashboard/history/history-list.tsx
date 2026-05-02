"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Search,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  recordJobFeedback,
  saveJob,
  removeSavedJob,
} from "@/app/actions/saved-jobs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilteredJob {
  title: string;
  company: string;
  location: string;
  apply_link: string;
  match_score: number | string;
  reason: string;
}

export interface AlertHistory {
  id: number;
  role: string;
  job_count: number;
  jobs: FilteredJob[];
  sent_at: string;
}

function toScore(score: number | string) {
  if (typeof score === "number") return score;
  const parsed = Number.parseInt(score, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ScoreBar({ score }: { score: number | string }) {
  const value = toScore(score);
  const color =
    value >= 80
      ? "bg-[#4A7A62]"
      : value >= 60
        ? "bg-[#C08832]"
        : "bg-[#C43E3E]/60";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-14 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}

function getAlertMaxScore(alert: AlertHistory) {
  return Math.max(0, ...(alert.jobs ?? []).map((job) => toScore(job.match_score)));
}

function isInsideDateWindow(sentAt: string, dateFilter: string) {
  if (dateFilter === "all") return true;

  const sentTime = new Date(sentAt).getTime();
  if (Number.isNaN(sentTime)) return false;

  const days = Number.parseInt(dateFilter, 10);
  const windowStart = Date.now() - days * 24 * 60 * 60 * 1000;
  return sentTime >= windowStart;
}

export default function HistoryList({
  alerts,
  initialSavedLinks,
}: {
  alerts: AlertHistory[];
  initialSavedLinks: string[];
}) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [minScore, setMinScore] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [savedLinks, setSavedLinks] = useState(() => new Set(initialSavedLinks));
  const [isPending, startTransition] = useTransition();

  const roles = useMemo(() => {
    return Array.from(new Set(alerts.map((alert) => alert.role).filter(Boolean)));
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const requiredScore = minScore === "all" ? 0 : Number.parseInt(minScore, 10);

    return alerts.filter((alert) => {
      if (role !== "all" && alert.role !== role) return false;
      if (!isInsideDateWindow(alert.sent_at, dateFilter)) return false;
      if (getAlertMaxScore(alert) < requiredScore) return false;

      if (!normalizedQuery) return true;

      const searchable = [
        alert.role,
        ...(alert.jobs ?? []).flatMap((job) => [
          job.title,
          job.company,
          job.location,
          job.reason,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [alerts, dateFilter, minScore, query, role]);

  const totalJobs = filteredAlerts.reduce(
    (total, alert) => total + (alert.jobs?.length ?? 0),
    0
  );
  const hasFilters =
    query.trim() || role !== "all" || minScore !== "all" || dateFilter !== "all";

  function clearFilters() {
    setQuery("");
    setRole("all");
    setMinScore("all");
    setDateFilter("all");
  }

  function toggleSaved(alert: AlertHistory, job: FilteredJob) {
    const nextSaved = !savedLinks.has(job.apply_link);

    setSavedLinks((current) => {
      const next = new Set(current);
      if (nextSaved) {
        next.add(job.apply_link);
      } else {
        next.delete(job.apply_link);
      }
      return next;
    });

    toast.success(nextSaved ? "Job saved" : "Job removed", {
      description: nextSaved
        ? "Added to your saved jobs."
        : "Removed from your saved jobs.",
    });

    startTransition(async () => {
      const result = nextSaved
        ? await saveJob({
            alertHistoryId: alert.id,
            title: job.title,
            company: job.company,
            location: job.location,
            applyLink: job.apply_link,
            matchScore: job.match_score,
            reason: job.reason,
            role: alert.role,
          })
        : await removeSavedJob(job.apply_link);

      if (result?.error) {
        toast.error(nextSaved ? "Could not save job" : "Could not remove job", {
          description: result.error,
        });
        setSavedLinks((current) => {
          const next = new Set(current);
          if (nextSaved) {
            next.delete(job.apply_link);
          } else {
            next.add(job.apply_link);
          }
          return next;
        });
      }
    });
  }

  function sendFeedback(
    alert: AlertHistory,
    job: FilteredJob,
    feedbackType: "not_relevant" | "more_like_this" | "applied" | "hide_company"
  ) {
    const labels = {
      not_relevant: "Marked not relevant",
      more_like_this: "Feedback saved",
      applied: "Marked as applied",
      hide_company: "Company hidden",
    };

    toast.success(labels[feedbackType]);

    startTransition(async () => {
      const result = await recordJobFeedback({
        alertHistoryId: alert.id,
        applyLink: job.apply_link,
        company: job.company,
        title: job.title,
        feedbackType,
      });

      if (result?.error) {
        toast.error("Could not save feedback", {
          description: result.error,
        });
      }
    });
  }

  return (
    <div className="mt-8 space-y-5">
      <section className="rounded-2xl border border-border/70 bg-card/72 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(150px,0.55fr)_minmax(150px,0.55fr)_minmax(150px,0.55fr)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/65" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, company, location, or reason"
              className="h-10 pl-9"
            />
          </div>

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue>
                {(value) => (value === "all" ? "Role" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
            {roles.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>

          <Select value={minScore} onValueChange={setMinScore}>
            <SelectTrigger>
              <SelectValue>
                {(value) =>
                  value === "all" ? "Score" : `${String(value)}%+ match`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scores</SelectItem>
              <SelectItem value="80">80%+ match</SelectItem>
              <SelectItem value="60">60%+ match</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue>
                {(value) =>
                  value === "all" ? "Date" : `Last ${String(value)} days`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {filteredAlerts.length} alert
            {filteredAlerts.length !== 1 ? "s" : ""} and {totalJobs} job
            {totalJobs !== 1 ? "s" : ""}
          </p>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      </section>

      {filteredAlerts.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/70 p-10 text-center">
          <p className="text-sm text-muted-foreground/60">
            No alerts match these filters.
          </p>
        </div>
      ) : (
        filteredAlerts.map((alert) => (
          <section
            key={alert.id}
            className="rounded-2xl border border-border/70 bg-card/72 p-5 shadow-[0_18px_30px_rgba(29,27,24,0.035)] md:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-sm font-medium">
                  {alert.job_count} job{alert.job_count !== 1 ? "s" : ""}{" "}
                  matched
                </h2>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  {alert.role}
                </span>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground/50">
                {new Date(alert.sent_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="mt-4 divide-y divide-border/50">
              {(alert.jobs ?? []).map((job, index) => (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-snug">
                        {job.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {job.company}
                        {job.location ? ` \u00B7 ${job.location}` : ""}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/70">
                        {job.reason}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                      <ScoreBar score={job.match_score} />
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {job.apply_link && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() => toggleSaved(alert, job)}
                            className="gap-1.5"
                          >
                            {savedLinks.has(job.apply_link) ? (
                              <>
                                Saved
                                <BookmarkCheck className="h-3.5 w-3.5 text-success" />
                              </>
                            ) : (
                              <>
                                Save
                                <Bookmark className="h-3.5 w-3.5" />
                              </>
                            )}
                          </Button>
                        )}
                        {job.apply_link && (
                          <a
                            href={job.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({
                              size: "sm",
                              className: "gap-1.5",
                            })}
                          >
                            Apply
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {job.apply_link && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                sendFeedback(alert, job, "more_like_this")
                              }
                              className="gap-1.5"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              More
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                sendFeedback(alert, job, "not_relevant")
                              }
                              className="gap-1.5"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                              Hide
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
