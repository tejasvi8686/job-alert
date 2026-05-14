import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { ok } = rateLimit(`subscribe:${ip}`, 5, 60_000);
  if (!ok) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    email,
    role,
    profileName = "Main profile",
    skill,
    location,
    experienceLevel = "Mid",
    yearsExperience = 2,
    jobType = "Full-time",
    minSalary = null,
    salaryCurrency = "USD",
    alertFrequency = "Daily",
    minMatchScore = 60,
    maxJobsPerEmail = 5,
  } = body;

  if (!email || !role || !skill || !location) {
    return Response.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_roles")
    .insert({
      email,
      profile_name: profileName,
      role,
      skill,
      location,
      user_id: user.id,
      experience_level: experienceLevel,
      years_experience: yearsExperience,
      job_type: jobType,
      min_salary: minSalary,
      salary_currency: salaryCurrency,
      alert_frequency: alertFrequency,
      min_match_score: minMatchScore,
      max_jobs_per_email: maxJobsPerEmail,
      alerts_paused: false,
    });

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }
    logError("subscribe", error, { userId: user.id });
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
