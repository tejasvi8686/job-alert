import { createClient } from "@supabase/supabase-js";
import { fetchJobs, filterJobsWithAI } from "@/lib/jobs";
import { sendJobEmail } from "@/lib/email";

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
      const filtered = await filterJobsWithAI(
        jobs,
        sub.role,
        sub.location,
        sub.skill
      );
      if (filtered.length > 0) {
        await sendJobEmail(sub.email, sub.role, filtered, sub.id);
        sent++;
      }
    } catch (err) {
      console.error(`Failed for ${sub.email}:`, err);
    }
  }

  return Response.json({ success: true, sent, total: subscribers.length });
}
