import { Suspense } from "react";
import LoginForm from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-9 w-full animate-pulse rounded-lg bg-muted/70" />
      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
      <div className="h-9 w-full animate-pulse rounded-lg bg-muted/70" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-8 md:py-14">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,430px)]">
        <section className="hidden rounded-2xl border border-border/70 bg-card/70 p-8 md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Welcome back
            </p>
            <h1 className="mt-2 font-heading text-4xl leading-tight tracking-tight">
              Daily job matches, without noisy feeds
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Sign in to manage your role, skills, and location filters. We
              keep your alerts focused and actionable.
            </p>
          </div>

          <div className="mt-8 space-y-2.5 text-sm text-foreground/85">
            <p className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              AI-ranked opportunities delivered every day.
            </p>
            <p className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              Update preferences anytime from your dashboard.
            </p>
            <p className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              One-click apply links and fit rationale in each digest.
            </p>
          </div>
        </section>

        <Card className="w-full bg-card/85 shadow-[0_20px_42px_rgba(29,27,24,0.06)]">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">JobAlert</CardTitle>
            <CardDescription>Sign in to continue to your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
