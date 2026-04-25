"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SubscribeForm({ email }: { email: string }) {
  const [form, setForm] = useState({
    email,
    role: "",
    skill: "",
    location: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-950">
        <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          You&apos;re subscribed!
        </p>
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          You will receive daily job alerts at your email.
        </p>
        <Button
          variant="link"
          onClick={() => setStatus("idle")}
          className="mt-4 text-emerald-700 dark:text-emerald-300"
        >
          Update preferences
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          readOnly
          className="h-10 bg-muted text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          type="text"
          placeholder="e.g., Frontend Developer"
          required
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skill">Skills</Label>
        <Input
          id="skill"
          type="text"
          placeholder="e.g., React, Next.js, TypeScript"
          required
          value={form.skill}
          onChange={(e) => setForm({ ...form, skill: e.target.value })}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          placeholder="e.g., Remote, India"
          required
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="h-10"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button type="submit" disabled={status === "loading"} size="lg" className="w-full">
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
