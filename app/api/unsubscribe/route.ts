import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { ok } = rateLimit(`unsub:${ip}`, 10, 60_000);
  if (!ok) {
    return new Response(html("Too many requests. Please try again later."), {
      status: 429,
      headers: { "Content-Type": "text/html" },
    });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(html("Invalid unsubscribe link."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("id", id);

  if (error) {
    logError("unsubscribe", error, { subscriberId: id });
    return new Response(html("Something went wrong. Please try again."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new Response(
    html("You have been unsubscribed. You will no longer receive daily job alerts."),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function html(message: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head>
<body style="margin:0;padding:40px 16px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;">
  <div style="max-width:400px;background:#fff;border-radius:12px;padding:32px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h1 style="font-size:20px;color:#18181b;margin:0 0 8px;">Job Alerts</h1>
    <p style="font-size:14px;color:#52525b;line-height:1.6;">${message}</p>
  </div>
</body>
</html>`;
}
