import OpenAI from "openai";

interface RemoteOKJob {
  position?: string;
  company?: string;
  location?: string;
  url?: string;
  description?: string;
  tags?: string[];
  source?: string;
  salary?: string;
  type?: string;
}

export interface FilteredJob {
  title: string;
  company: string;
  location: string;
  apply_link: string;
  match_score: string;
  reason: string;
  source?: string;
  salary?: string;
  job_type?: string;
  missing_skills?: string[];
  fit_summary?: string;
}

export interface JobPreferences {
  role: string;
  location: string;
  skill: string;
  experienceLevel?: string | null;
  yearsExperience?: number | null;
  jobType?: string | null;
  minSalary?: number | null;
  salaryCurrency?: string | null;
  minMatchScore?: number | null;
  maxJobsPerEmail?: number | null;
  resumeText?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  preferredKeywords?: string | null;
  excludedKeywords?: string | null;
  hiddenCompanies?: string | null;
}

async function fetchRemoteOkJobs(): Promise<RemoteOKJob[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: { "User-Agent": "JobAlertAgent/1.0" },
  });
  const data = await res.json();
  return data.slice(1).map((job: RemoteOKJob) => ({
    position: job.position,
    company: job.company,
    location: job.location,
    url: job.url,
    description: job.description,
    tags: job.tags,
    source: "RemoteOK",
  }));
}

async function fetchRemotiveJobs(): Promise<RemoteOKJob[]> {
  const res = await fetch("https://remotive.com/api/remote-jobs", {
    headers: { "User-Agent": "JobAlertAgent/1.0" },
  });
  const data = await res.json();
  return (data.jobs ?? []).map(
    (job: {
      title?: string;
      company_name?: string;
      candidate_required_location?: string;
      url?: string;
      description?: string;
      tags?: string[];
      salary?: string;
      job_type?: string;
    }) => ({
      position: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      url: job.url,
      description: job.description,
      tags: job.tags,
      salary: job.salary,
      type: job.job_type,
      source: "Remotive",
    })
  );
}

async function fetchArbeitnowJobs(): Promise<RemoteOKJob[]> {
  const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
    headers: { "User-Agent": "JobAlertAgent/1.0" },
  });
  const data = await res.json();
  return (data.data ?? []).map(
    (job: {
      title?: string;
      company_name?: string;
      location?: string;
      url?: string;
      description?: string;
      tags?: string[];
      job_types?: string[];
    }) => ({
      position: job.title,
      company: job.company_name,
      location: job.location,
      url: job.url,
      description: job.description,
      tags: job.tags,
      type: job.job_types?.join(", "),
      source: "Arbeitnow",
    })
  );
}

export async function fetchJobs(): Promise<RemoteOKJob[]> {
  const results = await Promise.allSettled([
    fetchRemoteOkJobs(),
    fetchRemotiveJobs(),
    fetchArbeitnowJobs(),
  ]);
  const seen = new Set<string>();
  const jobs = results
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((job) => {
      const key = job.url || `${job.company}-${job.position}`;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return jobs;
}

export async function filterJobsWithAI(
  jobs: RemoteOKJob[],
  roleOrPreferences: string | JobPreferences,
  location?: string,
  skill?: string
): Promise<FilteredJob[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const preferences =
    typeof roleOrPreferences === "string"
      ? {
          role: roleOrPreferences,
          location: location ?? "",
          skill: skill ?? "",
          experienceLevel: "Mid",
          yearsExperience: null,
          jobType: "Full-time",
          minSalary: null,
          salaryCurrency: "USD",
          minMatchScore: 0,
          maxJobsPerEmail: 5,
          resumeText: null,
          linkedinUrl: null,
          githubUrl: null,
          portfolioUrl: null,
          preferredKeywords: null,
          excludedKeywords: null,
          hiddenCompanies: null,
        }
      : roleOrPreferences;
  const maxJobs = Math.min(Math.max(preferences.maxJobsPerEmail ?? 5, 1), 20);
  const minScore = Math.min(Math.max(preferences.minMatchScore ?? 0, 0), 100);

  const cleanedJobs = jobs.slice(0, 50).map((j) => ({
    title: j.position || "",
    company: j.company || "",
    location: j.location || "",
    apply_link: j.url || "",
    source: j.source || "",
    salary: j.salary || "",
    job_type: j.type || "",
    tags: j.tags || [],
    description: (j.description || "").replace(/<[^>]+>/g, " ").slice(0, 500),
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a job assistant.

Filter and return only the most relevant jobs for:
Role: "${preferences.role}"
Experience level: "${preferences.experienceLevel ?? "Any"}"
Years of experience: "${preferences.yearsExperience ?? "Any"}"
Skills: "${preferences.skill}"
Location preference: "${preferences.location}"
Job type: "${preferences.jobType ?? "Any"}"
Minimum salary: "${preferences.minSalary ? `${preferences.salaryCurrency ?? "USD"} ${preferences.minSalary}` : "Not specified"}"
Minimum match score: "${minScore}"
Preferred keywords: "${preferences.preferredKeywords ?? "None"}"
Excluded keywords: "${preferences.excludedKeywords ?? "None"}"
Hidden companies: "${preferences.hiddenCompanies ?? "None"}"
Candidate profile/resume notes: "${preferences.resumeText?.slice(0, 1200) ?? "Not provided"}"
LinkedIn: "${preferences.linkedinUrl ?? "Not provided"}"
GitHub: "${preferences.githubUrl ?? "Not provided"}"
Portfolio: "${preferences.portfolioUrl ?? "Not provided"}"

Also assign a match score (0–100). Prefer jobs that fit the experience level,
required skills, location preference, job type, and minimum salary when salary
information is available. Do not return hidden companies or jobs matching
excluded keywords. Reward preferred keywords when relevant.

Return top ${maxJobs} jobs in JSON:
{
  "jobs": [
    {
      "title": "",
      "company": "",
      "location": "",
      "apply_link": "",
      "match_score": "",
      "reason": "",
      "source": "",
      "salary": "",
      "job_type": "",
      "missing_skills": [],
      "fit_summary": ""
    }
  ]
}

Jobs:
${JSON.stringify(cleanedJobs)}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return [];

  const parsed = JSON.parse(content);
  const parsedJobs = Array.isArray(parsed.jobs) ? parsed.jobs : [];
  return parsedJobs
    .filter((job: FilteredJob) => {
      const score = Number.parseInt(String(job.match_score), 10);
      return Number.isFinite(score) ? score >= minScore : true;
    })
    .slice(0, maxJobs);
}
