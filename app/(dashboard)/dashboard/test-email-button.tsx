"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function TestEmailButton() {
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);

    try {
      const res = await fetch("/api/test-email", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Test email failed", {
          description: data.error || "Failed to send test email",
        });
        return;
      }

      toast.success("Test email sent", {
        description: "Check your inbox for the latest alert preview.",
      });
    } catch {
      toast.error("Network error", {
        description: "Could not send the test email. Try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleTest}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      >
        <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
        {loading ? "Sending..." : "Send a test email"}
      </button>
    </div>
  );
}
