import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use · JobAlert",
  description: "Terms of use for JobAlert launch beta users.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20">
      <h1 className="font-heading text-4xl tracking-tight">Terms of Use</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: April 26, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/85">
        <section>
          <h2 className="font-semibold">Beta service</h2>
          <p className="mt-2">
            JobAlert is currently offered as a launch beta and may change
            rapidly. Features and availability can be updated without notice.
          </p>
        </section>
        <section>
          <h2 className="font-semibold">User responsibility</h2>
          <p className="mt-2">
            You are responsible for verifying job details before applying and
            for keeping your account credentials secure.
          </p>
        </section>
        <section>
          <h2 className="font-semibold">Limitations</h2>
          <p className="mt-2">
            We do not guarantee interview outcomes, offer acceptance, or the
            continued availability of external job listings.
          </p>
        </section>
      </div>
    </main>
  );
}
