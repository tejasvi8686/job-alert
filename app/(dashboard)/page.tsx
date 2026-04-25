import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SubscribeForm from "./subscribe-form";
import TestEmailButton from "./test-email-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    .limit(3);

  if (!subscription) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Set up your profile to receive daily AI-matched job alerts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscribeForm email={user.email!} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your job alert subscription overview
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-lg">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Subscribed {new Date(subscription.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Role</CardDescription>
            <CardTitle className="text-lg">{subscription.role}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Skills: {subscription.skill}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Location</CardDescription>
            <CardTitle className="text-lg">{subscription.location}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Daily alerts at 9:00 AM UTC
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <TestEmailButton />
      </div>

      {recentAlerts && recentAlerts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          <div className="mt-3 space-y-2">
            {recentAlerts.map((alert) => (
              <Card key={alert.id} size="sm">
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">
                      {alert.job_count} jobs matched
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.sent_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {alert.role}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
