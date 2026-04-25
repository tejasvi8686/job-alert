"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function TestEmailButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
      setMessage("Test email sent! Check your inbox.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleTest}
        disabled={status === "loading"}
        variant="outline"
        className="gap-2"
      >
        <Mail className="h-4 w-4" />
        {status === "loading" ? "Sending..." : "Send Test Email"}
      </Button>
      {message && (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-600" : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
