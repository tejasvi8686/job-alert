import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";

interface FilteredJob {
  title: string;
  company: string;
  location: string;
  apply_link: string;
  match_score: number;
  reason: string;
}

interface AlertHistory {
  id: number;
  role: string;
  job_count: number;
  jobs: FilteredJob[];
  sent_at: string;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-[#4A7A62]"
      : score >= 60
        ? "bg-[#C08832]"
        : "bg-[#C43E3E]/60";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-14 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
        {score}%
      </span>
    </div>
  );
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: alerts } = await supabase
    .from("job_alert_history")
    .select("id, role, job_count, jobs, sent_at")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(20);

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="max-w-5xl">
        <h1 className="font-heading text-3xl tracking-tight">History</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Past alerts sent to your inbox
        </p>

        {!alerts || alerts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border/70 bg-card/70 p-10 text-center">
            <p className="text-sm text-muted-foreground/60">
              No alerts sent yet. Your first alert arrives after the next daily
              run or when you send a test email.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {(alerts as AlertHistory[]).map((alert) => (
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
                  {(alert.jobs ?? []).map((job, i) => (
                    <div key={i} className="py-3.5 first:pt-0 last:pb-0">
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
                          {job.apply_link && (
                            <a
                              href={job.apply_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                            >
                              Apply
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
