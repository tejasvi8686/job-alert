import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SavedJobsList, { type SavedJob } from "./saved-jobs-list";

export default async function SavedJobsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  const { data: jobs, error } = await supabase
    .from("saved_jobs")
    .select(
      "id, title, company, location, apply_link, match_score, reason, role, status, saved_at"
    )
    .eq("user_id", claims.sub)
    .order("saved_at", { ascending: false });

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="max-w-5xl">
        <h1 className="font-heading text-3xl tracking-tight">Saved Jobs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Jobs you want to revisit and apply to later
        </p>

        {!jobs || jobs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border/70 bg-card/70 p-10 text-center">
            <p className="text-sm text-muted-foreground/60">
              No saved jobs yet. Save jobs from your alert history to build a
              shortlist.
            </p>
          </div>
        ) : (
          <SavedJobsList jobs={jobs as SavedJob[]} />
        )}
      </div>
    </div>
  );
}
