"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updatePreferences(formData: FormData) {
  const role = formData.get("role") as string;
  const profileName = formData.get("profile_name") as string;
  const skill = formData.get("skill") as string;
  const location = formData.get("location") as string;
  const experienceLevel = formData.get("experience_level") as string;
  const yearsExperience = Number.parseInt(
    String(formData.get("years_experience") ?? "0"),
    10
  );
  const jobType = formData.get("job_type") as string;
  const minSalaryRaw = String(formData.get("min_salary") ?? "").trim();
  const minSalary = minSalaryRaw ? Number.parseInt(minSalaryRaw, 10) : null;
  const salaryCurrency = formData.get("salary_currency") as string;
  const alertFrequency = formData.get("alert_frequency") as string;
  const minMatchScore = Number.parseInt(
    String(formData.get("min_match_score") ?? "60"),
    10
  );
  const maxJobsPerEmail = Number.parseInt(
    String(formData.get("max_jobs_per_email") ?? "5"),
    10
  );
  const alertsPaused = formData.get("alerts_paused") === "on";
  const resumeText = String(formData.get("resume_text") ?? "").trim() || null;
  const linkedinUrl = String(formData.get("linkedin_url") ?? "").trim() || null;
  const githubUrl = String(formData.get("github_url") ?? "").trim() || null;
  const portfolioUrl =
    String(formData.get("portfolio_url") ?? "").trim() || null;
  const preferredKeywords =
    String(formData.get("preferred_keywords") ?? "").trim() || null;
  const excludedKeywords =
    String(formData.get("excluded_keywords") ?? "").trim() || null;
  const hiddenCompanies =
    String(formData.get("hidden_companies") ?? "").trim() || null;

  if (!role || !skill || !location || !experienceLevel || !jobType) {
    return { error: "All fields are required" };
  }

  if (
    Number.isNaN(yearsExperience) ||
    yearsExperience < 0 ||
    yearsExperience > 50
  ) {
    return { error: "Years of experience must be between 0 and 50" };
  }

  if (minSalary !== null && (Number.isNaN(minSalary) || minSalary < 0)) {
    return { error: "Minimum salary must be a positive number" };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("user_roles")
    .update({
      role,
      profile_name: profileName?.trim() || "Main profile",
      skill,
      location,
      experience_level: experienceLevel,
      years_experience: yearsExperience,
      job_type: jobType,
      min_salary: minSalary,
      salary_currency: salaryCurrency,
      alert_frequency: alertFrequency,
      min_match_score: minMatchScore,
      max_jobs_per_email: maxJobsPerEmail,
      alerts_paused: alertsPaused,
      resume_text: resumeText,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      portfolio_url: portfolioUrl,
      preferred_keywords: preferredKeywords,
      excluded_keywords: excludedKeywords,
      hidden_companies: hiddenCompanies,
    })
    .eq("user_id", claims.sub);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
