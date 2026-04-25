import { createClient } from "@/lib/supabase-server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { fetchJobs, filterJobsWithAI } from "@/lib/jobs";
import { sendJobEmail } from "@/lib/email";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get subscription
  const { data: subscription } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!subscription) {
    return Response.json(
      { error: "No subscription found. Subscribe first." },
      { status: 404 }
    );
  }

  // Rate limit: 1 test per hour
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: recent } = await serviceSupabase
    .from("job_alert_history")
    .select("id")
    .eq("user_id", user.id)
    .gte("sent_at", oneHourAgo)
    .limit(1);

  if (recent && recent.length > 0) {
    return Response.json(
      { error: "Test email already sent recently. Try again in an hour." },
      { status: 429 }
    );
  }

  try {
    const jobs = await fetchJobs();
    const filtered = await filterJobsWithAI(
      jobs,
      subscription.role,
      subscription.location,
      subscription.skill
    );

    if (filtered.length === 0) {
      return Response.json(
        { error: "No matching jobs found. Try updating your preferences." },
        { status: 404 }
      );
    }

    await sendJobEmail(
      subscription.email,
      subscription.role,
      filtered,
      subscription.id
    );

    await serviceSupabase.from("job_alert_history").insert({
      user_id: user.id,
      subscriber_id: subscription.id,
      email: subscription.email,
      role: subscription.role,
      jobs: filtered,
      job_count: filtered.length,
    });

    return Response.json({ success: true, jobCount: filtered.length });
  } catch (err) {
    console.error("Test email failed:", err);
    return Response.json(
      { error: "Failed to send test email. Please try again." },
      { status: 500 }
    );
  }
}
