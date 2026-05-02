import { Resend } from "resend";
import type { FilteredJob } from "./jobs";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "JobAlert <onboarding@resend.dev>";

function getMatchColor(score: string | number): string {
  const n = typeof score === "string" ? parseInt(score, 10) : score;
  if (n >= 80) return "#16a34a";
  if (n >= 60) return "#ca8a04";
  return "#dc2626";
}

function buildJobHtml(job: FilteredJob, index: number): string {
  const color = getMatchColor(job.match_score);
  return `
    <tr>
      <td style="padding: 20px 24px; border-bottom: 1px solid #f0f0f0;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin: 0 0 4px; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px;">
                #${index + 1}
              </p>
              <h3 style="margin: 0 0 4px; font-size: 16px; color: #18181b;">
                ${job.title}
              </h3>
              <p style="margin: 0 0 12px; font-size: 14px; color: #71717a;">
                ${job.company} &middot; ${job.location}
              </p>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding: 3px 10px; border-radius: 100px; background: ${color}15; border: 1px solid ${color}30;">
                    <span style="font-size: 12px; font-weight: 600; color: ${color};">${job.match_score}% match</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 8px 0 0; font-size: 13px; color: #52525b; line-height: 1.5;">
                ${job.reason}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;">
              <a href="${job.apply_link}" style="display: inline-block; padding: 8px 20px; background: #18181b; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 6px;">
                Apply Now
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function buildEmailHtml(
  role: string,
  jobs: FilteredJob[],
  unsubscribeUrl: string
): string {
  const jobRows = jobs.map((job, i) => buildJobHtml(job, i)).join("");
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Daily Job Alerts</title>
</head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 520px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <h1 style="margin: 0 0 4px; font-size: 22px; color: #18181b;">
                Top Jobs for ${role}
              </h1>
              <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                ${today}
              </p>
            </td>
          </tr>

          <!-- Jobs -->
          ${jobRows}

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background: #fafafa;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #a1a1aa;">
                You're receiving this because you subscribed to AI Job Alerts.
              </p>
              <a href="${unsubscribeUrl}" style="font-size: 12px; color: #71717a; text-decoration: underline;">
                Unsubscribe
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendJobEmail(
  email: string,
  role: string,
  jobs: FilteredJob[],
  subscriberId?: number
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?id=${subscriberId ?? ""}`;

  const jobList = jobs
    .map(
      (job, i) =>
        `${i + 1}. ${job.title} at ${job.company}\n   Location: ${job.location}\n   Match: ${job.match_score}%\n   Reason: ${job.reason}\n   Apply: ${job.apply_link}`
    )
    .join("\n\n");

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Top Jobs for You Today",
    html: buildEmailHtml(role, jobs, unsubscribeUrl),
    text: `Top 5 Jobs for ${role}\n\n${jobList}\n\n---\nUnsubscribe: ${unsubscribeUrl}`,
  });
}
