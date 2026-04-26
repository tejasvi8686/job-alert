import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";

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
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border/70 bg-card/72 p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Settings
          </p>
          <h1 className="mt-2 font-heading text-3xl tracking-tight">
            Preferences
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Update your role, skill stack, or location filter. Changes take
            effect on the next daily alert.
          </p>
          <div className="mt-6 rounded-xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm text-foreground/90">{user.email}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_18px_40px_rgba(29,27,24,0.04)] md:p-7">
          <SettingsForm
            email={user.email!}
            role={subscription.role}
            skill={subscription.skill}
            location={subscription.location}
          />
        </section>
      </div>
    </div>
  );
}
