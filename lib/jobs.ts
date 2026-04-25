import OpenAI from "openai";

interface RemoteOKJob {
  position?: string;
  company?: string;
  location?: string;
  url?: string;
  description?: string;
  tags?: string[];
}

export interface FilteredJob {
  title: string;
  company: string;
  location: string;
  apply_link: string;
  match_score: string;
  reason: string;
}

export async function fetchJobs(): Promise<RemoteOKJob[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: { "User-Agent": "JobAlertAgent/1.0" },
  });
  const data = await res.json();
  // First element is metadata, skip it
  return data.slice(1);
}

export async function filterJobsWithAI(
  jobs: RemoteOKJob[],
  role: string,
  location: string,
  skill: string
): Promise<FilteredJob[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const cleanedJobs = jobs.slice(0, 50).map((j) => ({
    title: j.position || "",
    company: j.company || "",
    location: j.location || "",
    apply_link: j.url || "",
    tags: j.tags || [],
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a job assistant.

Filter and return only the most relevant jobs for:
Role: "${role}"
Location: "${location}"
Skills: "${skill}"

Also assign a match score (0–100).

Return top 5 jobs in JSON:
{
  "jobs": [
    {
      "title": "",
      "company": "",
      "location": "",
      "apply_link": "",
      "match_score": "",
      "reason": ""
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
  return parsed.jobs || [];
}
