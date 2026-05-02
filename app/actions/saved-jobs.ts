"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export interface SaveJobInput {
  alertHistoryId?: number;
  title: string;
  company: string;
  location?: string;
  applyLink: string;
  matchScore?: number | string;
  reason?: string;
  role?: string;
  source?: string;
}

function toScore(score: number | string | undefined) {
  if (typeof score === "number") return score;
  if (!score) return null;

  const parsed = Number.parseInt(score, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function saveJob(input: SaveJobInput) {
  if (!input.applyLink || !input.title || !input.company) {
    return { error: "Missing job details" };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("saved_jobs").upsert(
    {
      user_id: claims.sub,
      alert_history_id: input.alertHistoryId ?? null,
      title: input.title,
      company: input.company,
      location: input.location ?? null,
      apply_link: input.applyLink,
      match_score: toScore(input.matchScore),
      reason: input.reason ?? null,
      role: input.role ?? null,
      last_action_at: new Date().toISOString(),
      saved_at: new Date().toISOString(),
    },
    { onConflict: "user_id,apply_link" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard/saved");
  return { success: true };
}

export async function updateSavedJobStatus(applyLink: string, status: string) {
  if (!applyLink || !status) {
    return { error: "Missing tracker details" };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("saved_jobs")
    .update({ status, last_action_at: new Date().toISOString() })
    .eq("user_id", claims.sub)
    .eq("apply_link", applyLink);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/saved");
  return { success: true };
}

export async function recordJobFeedback(input: {
  alertHistoryId?: number;
  savedJobId?: number;
  applyLink: string;
  company?: string;
  title?: string;
  feedbackType: "not_relevant" | "more_like_this" | "applied" | "hide_company";
}) {
  if (!input.applyLink || !input.feedbackType) {
    return { error: "Missing feedback details" };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("job_feedback").upsert(
    {
      user_id: claims.sub,
      alert_history_id: input.alertHistoryId ?? null,
      saved_job_id: input.savedJobId ?? null,
      apply_link: input.applyLink,
      company: input.company ?? null,
      title: input.title ?? null,
      feedback_type: input.feedbackType,
    },
    { onConflict: "user_id,apply_link,feedback_type" }
  );

  if (error) {
    return { error: error.message };
  }

  if (input.feedbackType === "applied") {
    await supabase
      .from("saved_jobs")
      .update({ status: "applied", last_action_at: new Date().toISOString() })
      .eq("user_id", claims.sub)
      .eq("apply_link", input.applyLink);
  }

  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard/saved");
  return { success: true };
}

export async function removeSavedJob(applyLink: string) {
  if (!applyLink) {
    return { error: "Missing job link" };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", claims.sub)
    .eq("apply_link", applyLink);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard/saved");
  return { success: true };
}
