"use client";

import { useMemo, useState } from "react";
import { updatePreferences } from "@/app/actions/preferences";
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
  const initialSkills = skill
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const [roleValue, setRoleValue] = useState(role);
  const [skillValues, setSkillValues] = useState<string[]>(initialSkills);
  const [locationValue, setLocationValue] = useState(location);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const skillOptions = useMemo(
    () => getSkillOptionsForRole(roleValue),
    [roleValue]
  );

  function handleRoleChange(nextRole: string) {
    const nextSkillOptions = getSkillOptionsForRole(nextRole);

    setRoleValue(nextRole);
    setSkillValues((currentSkills) => {
      return currentSkills.filter((selectedSkill) =>
        nextSkillOptions.some(
          (option) =>
            option.toLowerCase() === selectedSkill.trim().toLowerCase()
        )
      );
    });
  }

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
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-border/60 bg-background/70 p-4">
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              readOnly
              className="h-10 bg-muted/45 text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Role
            </Label>
            <SearchableSelect
              value={roleValue}
              onValueChange={handleRoleChange}
              options={ROLE_OPTIONS}
              placeholder="Search role"
              searchPlaceholder="Search role..."
            />
            <p className="text-xs text-muted-foreground">
              Type to search roles
            </p>
            <input type="hidden" name="role" value={roleValue} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Skills
            </Label>
            <MultiSelect
              value={skillValues}
              onChange={setSkillValues}
              options={skillOptions}
              placeholder="Search skills"
              searchPlaceholder="Search skills..."
            />
            <p className="text-xs text-muted-foreground">
              Search and select multiple skills based on selected role
            </p>
            <input type="hidden" name="skill" value={skillValues.join(", ")} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Location
            </Label>
            <SearchableSelect
              value={locationValue}
              onValueChange={setLocationValue}
              options={LOCATION_OPTIONS}
              placeholder="Search location"
              searchPlaceholder="Search location..."
            />
            <p className="text-xs text-muted-foreground">
              Use city, country, remote, or hybrid preference
            </p>
            <input type="hidden" name="location" value={locationValue} />
          </div>
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
      {status === "success" && (
        <p className="text-xs text-success">Preferences updated</p>
      )}
      {skillValues.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least one skill
        </p>
      )}

      <Button
        type="submit"
        disabled={
          status === "loading" ||
          !roleValue.trim() ||
          skillValues.length === 0 ||
          !locationValue.trim()
        }
        size="lg"
        className="mt-1 w-full"
      >
        {status === "loading" ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
