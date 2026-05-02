"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { updatePreferences } from "@/app/actions/preferences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALERT_FREQUENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_TYPE_OPTIONS,
  ROLE_OPTIONS,
  LOCATION_OPTIONS,
  MAX_JOBS_PER_EMAIL_OPTIONS,
  MIN_MATCH_SCORE_OPTIONS,
  SALARY_CURRENCY_OPTIONS,
  getSkillOptionsForRole,
} from "@/lib/job-profile-options";

export default function SettingsForm({
  role,
  profileName,
  skill,
  location,
  experienceLevel,
  yearsExperience,
  jobType,
  minSalary,
  salaryCurrency,
  alertFrequency,
  minMatchScore,
  maxJobsPerEmail,
  alertsPaused,
  resumeText,
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  preferredKeywords,
  excludedKeywords,
  hiddenCompanies,
}: {
  role: string;
  profileName: string;
  skill: string;
  location: string;
  experienceLevel: string;
  yearsExperience: number;
  jobType: string;
  minSalary: number | string;
  salaryCurrency: string;
  alertFrequency: string;
  minMatchScore: number;
  maxJobsPerEmail: number;
  alertsPaused: boolean;
  resumeText: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  preferredKeywords: string;
  excludedKeywords: string;
  hiddenCompanies: string;
}) {
  const initialSkills = skill
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const [roleValue, setRoleValue] = useState(role);
  const [skillValues, setSkillValues] = useState<string[]>(initialSkills);
  const [locationValue, setLocationValue] = useState(location);
  const [experienceLevelValue, setExperienceLevelValue] =
    useState(experienceLevel);
  const [jobTypeValue, setJobTypeValue] = useState(jobType);
  const [salaryCurrencyValue, setSalaryCurrencyValue] =
    useState(salaryCurrency);
  const [alertFrequencyValue, setAlertFrequencyValue] =
    useState(alertFrequency);
  const [minMatchScoreValue, setMinMatchScoreValue] = useState(
    String(minMatchScore)
  );
  const [maxJobsValue, setMaxJobsValue] = useState(String(maxJobsPerEmail));
  const [alertsPausedValue, setAlertsPausedValue] = useState(alertsPaused);
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
      toast.error("Could not update preferences", {
        description: result.error,
      });
    } else {
      setStatus("success");
      toast.success("Preferences updated", {
        description: "Changes apply to your next daily alert.",
      });
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5 pb-44 md:pb-28">
      <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-[0_18px_34px_rgba(29,27,24,0.03)] md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Profile
            </p>
            <h2 className="mt-1 text-base font-medium">Role and skills</h2>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Matching input
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Profile name
            </Label>
            <Input
              name="profile_name"
              defaultValue={profileName}
              placeholder="Main profile"
              className="h-10"
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
              Experience level
            </Label>
            <Select
              value={experienceLevelValue}
              onValueChange={setExperienceLevelValue}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="experience_level"
              value={experienceLevelValue}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Years
            </Label>
            <Input
              name="years_experience"
              type="number"
              min={0}
              max={50}
              defaultValue={yearsExperience}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
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
            <input type="hidden" name="skill" value={skillValues.join(", ")} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-[0_18px_34px_rgba(29,27,24,0.03)] md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Candidate signal
            </p>
            <h2 className="mt-1 text-base font-medium">Resume and links</h2>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            AI context
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              LinkedIn
            </Label>
            <Input
              name="linkedin_url"
              defaultValue={linkedinUrl}
              placeholder="https://linkedin.com/in/..."
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              GitHub
            </Label>
            <Input
              name="github_url"
              defaultValue={githubUrl}
              placeholder="https://github.com/..."
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Portfolio
            </Label>
            <Input
              name="portfolio_url"
              defaultValue={portfolioUrl}
              placeholder="https://..."
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Preferred keywords
            </Label>
            <Input
              name="preferred_keywords"
              defaultValue={preferredKeywords}
              placeholder="AI, Next.js, Supabase"
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Excluded keywords
            </Label>
            <Input
              name="excluded_keywords"
              defaultValue={excludedKeywords}
              placeholder="WordPress, unpaid"
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Hidden companies
            </Label>
            <Input
              name="hidden_companies"
              defaultValue={hiddenCompanies}
              placeholder="Company names"
              className="h-10"
            />
          </div>
          <div className="space-y-1.5 lg:col-span-3">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Resume or profile notes
            </Label>
            <textarea
              name="resume_text"
              defaultValue={resumeText}
              placeholder="Paste a concise resume summary, achievements, preferred stack, or job search notes."
              rows={3}
              className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-[0_18px_34px_rgba(29,27,24,0.03)] md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Preferences
            </p>
            <h2 className="mt-1 text-base font-medium">Job filters</h2>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Quality filters
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Job type
            </Label>
            <Select value={jobTypeValue} onValueChange={setJobTypeValue}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="job_type" value={jobTypeValue} />
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
            <input type="hidden" name="location" value={locationValue} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Minimum salary
            </Label>
            <Input
              name="min_salary"
              type="number"
              min={0}
              placeholder="Optional"
              defaultValue={minSalary}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.14em]">
              Currency
            </Label>
            <Select
              value={salaryCurrencyValue}
              onValueChange={setSalaryCurrencyValue}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SALARY_CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="salary_currency"
              value={salaryCurrencyValue}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-[0_18px_34px_rgba(29,27,24,0.03)] md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Alert delivery
            </p>
            <h2 className="mt-1 text-base font-medium">Email rules</h2>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Digest control
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-[0.14em]">
                Frequency
              </Label>
              <Select
                value={alertFrequencyValue}
                onValueChange={setAlertFrequencyValue}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALERT_FREQUENCY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="alert_frequency"
                value={alertFrequencyValue}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-[0.14em]">
                Match score
              </Label>
              <Select
                value={minMatchScoreValue}
                onValueChange={setMinMatchScoreValue}
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value) => `${String(value)}%+`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MIN_MATCH_SCORE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}%+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="min_match_score"
                value={minMatchScoreValue}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-[0.14em]">
                Max jobs
              </Label>
              <Select value={maxJobsValue} onValueChange={setMaxJobsValue}>
                <SelectTrigger>
                  <SelectValue>
                    {(value) => `${String(value)} jobs`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MAX_JOBS_PER_EMAIL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} jobs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="max_jobs_per_email"
                value={maxJobsValue}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-4">
            <input
              type="checkbox"
              name="alerts_paused"
              checked={alertsPausedValue}
              onChange={(event) => setAlertsPausedValue(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>
              <span className="block text-sm font-medium">Pause alerts</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Keep your profile saved, but stop scheduled emails.
              </span>
            </span>
          </label>
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

      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-border/70 bg-card/95 p-3 shadow-[0_-18px_40px_rgba(29,27,24,0.08)] backdrop-blur md:bottom-0 md:left-64">
        <div className="mx-auto grid max-w-6xl gap-3">
          <p className="text-xs text-muted-foreground">
            Save changes before sending the next test email.
          </p>
          <Button
            type="submit"
            disabled={
              status === "loading" ||
              !roleValue.trim() ||
              skillValues.length === 0 ||
              !locationValue.trim()
            }
            size="lg"
            className="w-full"
          >
            {status === "loading" ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
