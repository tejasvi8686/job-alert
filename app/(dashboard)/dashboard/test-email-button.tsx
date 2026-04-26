"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function TestEmailButton() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleTest() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/test-email", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send test email");
        return;
      }

      setStatus("success");
      setMessage("Sent — check your inbox");
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleTest}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      >
        <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
        {status === "loading" ? "Sending..." : "Send a test email"}
      </button>
      {message && (
        <span
          className={`text-xs ${
            status === "success" ? "text-[#4A7A62]" : "text-destructive"
          }`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
