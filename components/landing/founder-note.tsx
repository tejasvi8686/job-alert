import { SectionWrapper } from "./section-wrapper";

interface FounderNoteProps {
  lastUpdated: string;
  supportEmail: string;
}

export function FounderNote({ lastUpdated, supportEmail }: FounderNoteProps) {
  return (
    <SectionWrapper id="launch">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border/70 bg-card/65 p-6">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Founder Note
          </p>
          <h2 className="mt-2 font-heading text-3xl tracking-tight">
            Building this in public
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            JobAlert is currently in launch mode. The goal is straightforward:
            help developers spend less time browsing and more time applying to
            roles that actually fit.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We are shipping in short cycles and using feedback from early users
            to prioritize what gets built next.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/65 p-5">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Next 30 days
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              <li>Improve ranking precision by role seniority</li>
              <li>Roll out cleaner digest format with richer context</li>
              <li>Ship profile templates for faster setup</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/65 p-5">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Support
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Questions or issues? Reach out directly:
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-4"
            >
              {supportEmail}
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
