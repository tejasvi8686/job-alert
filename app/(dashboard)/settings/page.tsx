import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
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

  if (!subscription) {
    redirect("/");
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your job alert preferences
      </p>

      <Card className="mt-6 max-w-lg">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Changes take effect on the next daily alert.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            email={user.email!}
            role={subscription.role}
            skill={subscription.skill}
            location={subscription.location}
          />
        </CardContent>
      </Card>
    </div>
  );
}
