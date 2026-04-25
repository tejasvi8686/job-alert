import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

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
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold">Alert History</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Past job alerts sent to your inbox
      </p>

      {!alerts || alerts.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No alerts sent yet. Your first alert will appear here after the
              next daily run or when you send a test email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {(alerts as AlertHistory[]).map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {alert.job_count} jobs matched
                    </CardTitle>
                    <CardDescription>
                      {new Date(alert.sent_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {alert.role}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alert.jobs.map((job, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.company}
                          {job.location ? ` \u00B7 ${job.location}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {job.reason}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            job.match_score >= 80
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              : job.match_score >= 60
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {job.match_score}%
                        </span>
                        {job.apply_link && (
                          <a
                            href={job.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary underline-offset-2 hover:underline"
                          >
                            Apply
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
