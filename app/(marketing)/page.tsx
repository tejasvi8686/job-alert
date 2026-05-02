import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { InlineSignupCta } from "@/components/landing/inline-signup-cta";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustStrip } from "@/components/landing/trust-strip";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Comparison } from "@/components/landing/comparison";
import { RealProof } from "@/components/landing/real-proof";
import { LaunchFaq } from "@/components/landing/launch-faq";
import { LAUNCH_FAQS } from "@/components/landing/launch-faq-data";
import { FounderNote } from "@/components/landing/founder-note";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

const PAGE_TITLE = "JobAlert — Daily AI Job Alerts for Developers";
const PAGE_DESCRIPTION =
  "Launch-stage job alert platform for developers. Set role, skills, and location once, then receive a focused daily digest.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "developer job alerts",
    "ai job matching",
    "daily job digest",
    "job search automation",
    "developer jobs",
  ],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@jobalert.app";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let alertsThisWeek: number | null = null;

  if (serviceRoleKey) {
    const adminClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );
    const oneWeekAgoDate = new Date();
    oneWeekAgoDate.setDate(oneWeekAgoDate.getDate() - 7);
    const oneWeekAgo = oneWeekAgoDate.toISOString();
    const { count } = await adminClient
      .from("job_alert_history")
      .select("id", { count: "exact", head: true })
      .gte("sent_at", oneWeekAgo);
    if (typeof count === "number") {
      alertsThisWeek = count;
    }
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LAUNCH_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Navbar isAuthenticated={Boolean(user)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <Hero />
        <InlineSignupCta />
        <HowItWorks />
        <DashboardPreview />
        <Comparison />
        <TrustStrip />
        <Testimonials />
        <RealProof alertsThisWeek={alertsThisWeek} lastUpdated={lastUpdated} />
        <Pricing />
        <LaunchFaq />
        <FounderNote lastUpdated={lastUpdated} supportEmail={supportEmail} />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
