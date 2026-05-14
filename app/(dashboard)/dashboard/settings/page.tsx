import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";
import DeleteAccountSection from "./delete-account-section";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (!subscription) {
    redirect("/");
  }

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_18px_40px_rgba(29,27,24,0.035)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Settings
              </p>
              <h1 className="mt-2 font-heading text-3xl tracking-tight">
                Job preferences
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Tune the profile used by AI matching, salary filters, and email
                delivery. Changes apply to the next alert.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="max-w-[260px] truncate rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                {claims.email}
              </span>
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  subscription.alerts_paused
                    ? "border-muted-foreground/20 bg-muted text-muted-foreground"
                    : "border-success/25 bg-success/10 text-success"
                }`}
              >
                {subscription.alerts_paused ? "Paused" : "Active"}
              </span>
            </div>
          </div>
        </section>

        <SettingsForm
          role={subscription.role}
          profileName={subscription.profile_name ?? "Main profile"}
          skill={subscription.skill}
          location={subscription.location}
          experienceLevel={subscription.experience_level ?? "Mid"}
          yearsExperience={subscription.years_experience ?? 2}
          jobType={subscription.job_type ?? "Full-time"}
          minSalary={subscription.min_salary ?? ""}
          salaryCurrency={subscription.salary_currency ?? "USD"}
          alertFrequency={subscription.alert_frequency ?? "Daily"}
          minMatchScore={subscription.min_match_score ?? 60}
          maxJobsPerEmail={subscription.max_jobs_per_email ?? 5}
          alertsPaused={subscription.alerts_paused ?? false}
          resumeText={subscription.resume_text ?? ""}
          linkedinUrl={subscription.linkedin_url ?? ""}
          githubUrl={subscription.github_url ?? ""}
          portfolioUrl={subscription.portfolio_url ?? ""}
          preferredKeywords={subscription.preferred_keywords ?? ""}
          excludedKeywords={subscription.excluded_keywords ?? ""}
          hiddenCompanies={subscription.hidden_companies ?? ""}
        />

        <DeleteAccountSection />
      </div>
    </div>
  );
}
