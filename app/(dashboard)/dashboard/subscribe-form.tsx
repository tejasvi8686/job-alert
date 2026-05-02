"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ROLE_OPTIONS,
  LOCATION_OPTIONS,
  getSkillOptionsForRole,
} from "@/lib/job-profile-options";

export default function SubscribeForm({ email }: { email: string }) {
  const [form, setForm] = useState({
    email,
    role: "",
    skills: [] as string[],
    location: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const skillOptions = getSkillOptionsForRole(form.role);

  function handleRoleChange(nextRole: string) {
    const nextSkillOptions = getSkillOptionsForRole(nextRole);

    setForm((prev) => {
      return {
        ...prev,
        role: nextRole,
        skills: prev.skills.filter((selectedSkill) =>
          nextSkillOptions.some(
            (option) =>
              option.toLowerCase() === selectedSkill.trim().toLowerCase()
          )
        ),
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          role: form.role,
          skill: form.skills.join(", "),
          location: form.location,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
        toast.error("Could not create alert", {
          description: data.error || "Something went wrong",
        });
        return;
      }

      setStatus("success");
      toast.success("Alert profile created", {
        description: "Your first alert arrives at 9:00 AM UTC tomorrow.",
      });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
      toast.error("Network error", {
        description: "Could not create your alert profile. Try again.",
      });
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-success/25 bg-success/5 px-6 py-8 text-center">
        <p className="font-heading text-xl text-success">You&apos;re all set</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your first alert arrives at 9:00 AM UTC tomorrow.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-success underline underline-offset-4 hover:no-underline"
        >
          Change preferences
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-border/60 bg-background/70 p-4">
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Email
            </Label>
            <Input
              type="email"
              value={form.email}
              readOnly
              className="h-10 bg-muted/45 text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Role
            </Label>
            <SearchableSelect
              value={form.role}
              onValueChange={handleRoleChange}
              options={ROLE_OPTIONS}
              placeholder="Search role"
              searchPlaceholder="Search role..."
            />
            <p className="text-xs text-muted-foreground">Type to search roles</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Skills
            </Label>
            <MultiSelect
              value={form.skills}
              onChange={(skills) => setForm({ ...form, skills })}
              options={skillOptions}
              placeholder="Search skills"
              searchPlaceholder="Search skills..."
            />
            <p className="text-xs text-muted-foreground">
              Search and select multiple skills based on selected role
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Location
            </Label>
            <SearchableSelect
              value={form.location}
              onValueChange={(location) => setForm({ ...form, location })}
              options={LOCATION_OPTIONS}
              placeholder="Search location"
              searchPlaceholder="Search location..."
            />
            <p className="text-xs text-muted-foreground">
              Use city, country, remote, or hybrid preference
            </p>
          </div>
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      {form.skills.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least one skill
        </p>
      )}

      <Button
        type="submit"
        disabled={
          status === "loading" ||
          !form.role.trim() ||
          form.skills.length === 0 ||
          !form.location.trim()
        }
        size="lg"
        className="mt-1 w-full"
      >
        {status === "loading" ? "Setting up..." : "Start receiving alerts"}
      </Button>
    </form>
  );
}
