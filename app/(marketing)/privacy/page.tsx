import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · JobAlert",
  description: "Privacy information for JobAlert launch beta users.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20">
      <h1 className="font-heading text-4xl tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: April 26, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/85">
        <section>
          <h2 className="font-semibold">What we collect</h2>
          <p className="mt-2">
            We collect account information (such as email) and profile
            preferences (role, skills, location) required to send job alerts.
          </p>
        </section>
        <section>
          <h2 className="font-semibold">How data is used</h2>
          <p className="mt-2">
            Data is used only for authentication, matching jobs, and improving
            product quality during launch.
          </p>
        </section>
        <section>
          <h2 className="font-semibold">Data sharing</h2>
          <p className="mt-2">
            We do not sell personal data. Access is limited to core operational
            systems and required service providers.
          </p>
        </section>
      </div>
    </main>
  );
}
