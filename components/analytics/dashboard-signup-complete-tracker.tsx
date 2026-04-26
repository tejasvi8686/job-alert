"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const START_KEY = "ja_signup_started_at";
const SOURCE_KEY = "ja_signup_source";

export default function DashboardSignupCompleteTracker() {
  useEffect(() => {
    const startedAt = sessionStorage.getItem(START_KEY);
    if (!startedAt) return;

    const startedMs = Number(startedAt);
    const elapsedSeconds =
      Number.isFinite(startedMs) && startedMs > 0
        ? Math.max(0, Math.round((Date.now() - startedMs) / 1000))
        : undefined;
    const source = sessionStorage.getItem(SOURCE_KEY) ?? "unknown";

    trackEvent("landing_signup_complete", {
      source,
      elapsed_seconds: elapsedSeconds,
    });

    sessionStorage.removeItem(START_KEY);
    sessionStorage.removeItem(SOURCE_KEY);
  }, []);

  return null;
}
