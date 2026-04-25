"use client";

import { useState } from "react";
import { updatePreferences } from "@/app/actions/preferences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsForm({
  email,
  role,
  skill,
  location,
}: {
  email: string;
  role: string;
  skill: string;
  location: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setErrorMsg("");

    const result = await updatePreferences(formData);

    if (result?.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          readOnly
          className="h-10 bg-muted text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          type="text"
          placeholder="e.g., Frontend Developer"
          required
          defaultValue={role}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skill">Skills</Label>
        <Input
          id="skill"
          name="skill"
          type="text"
          placeholder="e.g., React, Next.js, TypeScript"
          required
          defaultValue={skill}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., Remote, India"
          required
          defaultValue={location}
          className="h-10"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
      {status === "success" && (
        <p className="text-sm text-emerald-600">Preferences updated!</p>
      )}

      <Button type="submit" disabled={status === "loading"} size="lg" className="w-full">
        {status === "loading" ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
