import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SubscribeForm from "./subscribe-form";
import TestEmailButton from "./test-email-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: recentAlerts } = await supabase
    .from("job_alert_history")
    .select("id, sent_at, job_count, role")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(5);

  if (!subscription) {
    return (
      <div className="px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_18px_40px_rgba(29,27,24,0.04)] md:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Get started
            </p>
            <h1 className="mt-2 font-heading text-3xl tracking-tight">
              Set up your alert profile
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Add your target role, top skills, and location preference. Your
              first digest will arrive tomorrow.
            </p>
            <div className="mt-8">
              <SubscribeForm email={user.email!} />
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border/70 bg-card/70 p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                What happens next
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/85">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  Daily matching runs against your preferences.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  Every digest includes fit score and apply links.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  You can edit preferences at any time from settings.
                </li>
              </ul>
            </section>
            <section className="rounded-2xl border border-border/70 bg-card/70 p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Delivery window
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Alerts are sent once a day at 9:00 AM UTC.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can trigger a test email after setup completes.
              </p>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  const subscribedDate = new Date(subscription.created_at).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_20px_42px_rgba(29,27,24,0.04)] md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Overview
              </p>
              <h1 className="mt-2 font-heading text-3xl tracking-tight">
                Your alerts are active
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Next delivery at 9:00 AM UTC tomorrow
              </p>
            </div>
            <span className="rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Active
            </span>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                Role
              </p>
              <p className="mt-1.5 text-sm">{subscription.role}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                Skills
              </p>
              <p className="mt-1.5 text-sm">{subscription.skill}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                Location
              </p>
              <p className="mt-1.5 text-sm">{subscription.location}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                Since
              </p>
              <p className="mt-1.5 text-sm">{subscribedDate}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border/70 bg-card/70 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TestEmailButton />
            <p className="text-xs text-muted-foreground">
              Use this to verify deliverability before the next scheduled run.
            </p>
          </div>
        </section>

        {recentAlerts && recentAlerts.length > 0 && (
          <section className="rounded-2xl border border-border/70 bg-card/70 p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
              Recent alerts
            </p>
            <div className="mt-4 divide-y divide-border/60">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-sm">
                      {alert.job_count} job{alert.job_count !== 1 ? "s" : ""}
                    </span>
                    <span className="truncate rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {alert.role}
                    </span>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground/60">
                    {new Date(alert.sent_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
