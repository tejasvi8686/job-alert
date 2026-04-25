import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SubscribeForm from "./subscribe-form";
import LogoutButton from "./logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">AI Job Alerts</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <LogoutButton />
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            Get the top 5 jobs matched to your profile, delivered to your inbox
            every morning.
          </p>
          <SubscribeForm email={user.email!} />
        </CardContent>
      </Card>
    </div>
  );
}
