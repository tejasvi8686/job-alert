"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const START_KEY = "ja_signup_started_at";
const SOURCE_KEY = "ja_signup_source";

export function InlineSignupCta() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    sessionStorage.setItem(START_KEY, String(Date.now()));
    sessionStorage.setItem(SOURCE_KEY, "landing_inline");

    trackEvent("landing_signup_start", {
      source: "landing_inline",
      entry: "inline_cta",
    });

    router.push(`/login?email=${encodeURIComponent(email)}&source=landing-inline`);
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl px-6" id="signup">
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 md:p-8">
        <div className="grid items-end gap-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Quick Start
            </p>
            <h2 className="mt-1 font-heading text-3xl tracking-tight">
              Start with your email in 10 seconds
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No fake waitlist. You can create your profile and start receiving
              alerts right away.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 min-w-64 bg-background"
            />
            <Button type="submit" className="h-10 px-5" disabled={loading}>
              {loading ? "Starting..." : "Start now"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
