import { createClient } from "@supabase/supabase-js";
import { fetchJobs, filterJobsWithAI } from "@/lib/jobs";
import { sendJobEmail } from "@/lib/email";
import { logError } from "@/lib/logger";

function getFrequencyWindowMs(frequency?: string | null) {
  if (frequency === "Weekly") return 7 * 24 * 60 * 60 * 1000;
  if (frequency === "Every 2 days") return 2 * 24 * 60 * 60 * 1000;
  return 20 * 60 * 60 * 1000;
}

export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role to bypass RLS and read all subscribers
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: subscribers, error } = await supabase
    .from("user_roles")
    .select("*");

  if (error || !subscribers?.length) {
    return Response.json({ error: "No subscribers found" }, { status: 404 });
  }

  const jobs = await fetchJobs();
  let sent = 0;

  for (const sub of subscribers) {
    try {
      if (sub.alerts_paused) {
        continue;
      }

      const windowStart = new Date(
        Date.now() - getFrequencyWindowMs(sub.alert_frequency)
      ).toISOString();
      const { data: recentSend } = await supabase
        .from("job_alert_history")
        .select("id")
        .eq("user_id", sub.user_id)
        .gte("sent_at", windowStart)
        .limit(1);

      if (recentSend && recentSend.length > 0) {
        continue;
      }

      const filtered = await filterJobsWithAI(jobs, {
        role: sub.role,
        location: sub.location,
        skill: sub.skill,
        experienceLevel: sub.experience_level,
        yearsExperience: sub.years_experience,
        jobType: sub.job_type,
        minSalary: sub.min_salary,
        salaryCurrency: sub.salary_currency,
        minMatchScore: sub.min_match_score,
        maxJobsPerEmail: sub.max_jobs_per_email,
        resumeText: sub.resume_text,
        linkedinUrl: sub.linkedin_url,
        githubUrl: sub.github_url,
        portfolioUrl: sub.portfolio_url,
        preferredKeywords: sub.preferred_keywords,
        excludedKeywords: sub.excluded_keywords,
        hiddenCompanies: sub.hidden_companies,
      });
      if (filtered.length > 0) {
        await sendJobEmail(sub.email, sub.role, filtered, sub.id);
        await supabase.from("job_alert_history").insert({
          user_id: sub.user_id,
          subscriber_id: sub.id,
          email: sub.email,
          role: sub.role,
          jobs: filtered,
          job_count: filtered.length,
        });
        sent++;
      }
    } catch (err) {
      logError("cron", err, { subscriberId: sub.id, email: sub.email });
    }
  }

  return Response.json({ success: true, sent, total: subscribers.length });
}
