"use client";

import { useMemo, useState, useTransition } from "react";
import { BookmarkX, ExternalLink, Search, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import {
  recordJobFeedback,
  removeSavedJob,
  updateSavedJobStatus,
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

export interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string | null;
  apply_link: string;
  match_score: number | null;
  reason: string | null;
  role: string | null;
  status: string;
  saved_at: string;
}

export default function SavedJobsList({ jobs }: { jobs: SavedJob[] }) {
  const [query, setQuery] = useState("");
  const [visibleJobs, setVisibleJobs] = useState(jobs);
  const [isPending, startTransition] = useTransition();

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return visibleJobs;

    return visibleJobs.filter((job) =>
      [job.title, job.company, job.location, job.reason, job.role]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query, visibleJobs]);

  function removeJob(job: SavedJob) {
    setVisibleJobs((current) =>
      current.filter((item) => item.apply_link !== job.apply_link)
    );
    toast.success("Job removed", {
      description: "Removed from your saved jobs.",
    });

    startTransition(async () => {
      const result = await removeSavedJob(job.apply_link);
      if (result?.error) {
        toast.error("Could not remove job", {
          description: result.error,
        });
        setVisibleJobs((current) => [job, ...current]);
      }
    });
  }

  function changeStatus(job: SavedJob, status: string) {
    setVisibleJobs((current) =>
      current.map((item) =>
        item.apply_link === job.apply_link ? { ...item, status } : item
      )
    );
    toast.success("Tracker updated", {
      description: `Moved to ${status}.`,
    });

    startTransition(async () => {
      const result = await updateSavedJobStatus(job.apply_link, status);
      if (result?.error) {
        toast.error("Could not update tracker", {
          description: result.error,
        });
        setVisibleJobs((current) =>
          current.map((item) =>
            item.apply_link === job.apply_link
              ? { ...item, status: job.status }
              : item
          )
        );
      }
    });
  }

  function sendPositiveFeedback(job: SavedJob) {
    toast.success("Feedback saved", {
      description: "Future matches will favor jobs like this.",
    });

    startTransition(async () => {
      const result = await recordJobFeedback({
        savedJobId: job.id,
        applyLink: job.apply_link,
        company: job.company,
        title: job.title,
        feedbackType: "more_like_this",
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/65" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search saved jobs"
            className="h-10 pl-9"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filteredJobs.length} saved job
          {filteredJobs.length !== 1 ? "s" : ""}
        </p>
      </section>

      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/70 p-10 text-center">
          <p className="text-sm text-muted-foreground/60">
            No saved jobs match this search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <section
              key={job.id}
              className="rounded-2xl border border-border/70 bg-card/72 p-5 shadow-[0_18px_30px_rgba(29,27,24,0.035)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-medium leading-snug">
                      {job.title}
                    </h2>
                    {job.role && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                        {job.role}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.company}
                    {job.location ? ` \u00B7 ${job.location}` : ""}
                  </p>
                  {job.reason && (
                    <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground/75">
                      {job.reason}
                    </p>
                  )}
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground/50">
                    Saved{" "}
                    {new Date(job.saved_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {typeof job.match_score === "number" && (
                    <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                      {job.match_score}% match
                    </span>
                  )}
                  <Select
                    value={job.status ?? "saved"}
                    onValueChange={(value) => changeStatus(job, value)}
                  >
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => sendPositiveFeedback(job)}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    More
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeJob(job)}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    <BookmarkX className="h-3.5 w-3.5" />
                    Remove
                  </Button>
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
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
