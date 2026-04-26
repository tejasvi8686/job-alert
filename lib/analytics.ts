"use client";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushToDataLayer(event: Record<string, unknown>) {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  window.dataLayer.push(event);
}

export function trackEvent(name: string, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;

  const event = {
    event: name,
    path: window.location.pathname,
    timestamp: Date.now(),
    ...payload,
  };

  pushToDataLayer(event);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event);
  }
}
