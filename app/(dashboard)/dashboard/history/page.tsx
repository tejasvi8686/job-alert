import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import HistoryList, { type AlertHistory } from "./history-list";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  const [{ data: alerts }, { data: savedJobs }] = await Promise.all([
    supabase
      .from("job_alert_history")
      .select("id, role, job_count, jobs, sent_at")
      .eq("user_id", claims.sub)
      .order("sent_at", { ascending: false })
      .limit(20),
    supabase
      .from("saved_jobs")
      .select("apply_link")
      .eq("user_id", claims.sub),
  ]);

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
          <HistoryList
            alerts={alerts as AlertHistory[]}
            initialSavedLinks={(savedJobs ?? []).map((job) => job.apply_link)}
          />
        )}
      </div>
    </div>
  );
}
