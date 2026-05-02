function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted/70 ${className}`}
      aria-hidden="true"
    />
  );
}

function SettingsSectionSkeleton({
  titleWidth,
  rows,
  includeTextarea = false,
}: {
  titleWidth: string;
  rows: number;
  includeTextarea?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-[0_18px_34px_rgba(29,27,24,0.03)] md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className={`mt-2 h-5 ${titleWidth}`} />
        </div>
        <SkeletonBlock className="h-3 w-24" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 lg:grid-cols-3"
          >
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
          </div>
        ))}
        {includeTextarea && <SkeletonBlock className="h-24 w-full" />}
      </div>
    </section>
  );
}

export default function SettingsLoading() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl pb-44 md:pb-28">
        <section className="mb-6 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_18px_40px_rgba(29,27,24,0.035)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="mt-3 h-9 w-64" />
              <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />
              <SkeletonBlock className="mt-2 h-4 w-80" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SkeletonBlock className="h-7 w-56 rounded-full" />
              <SkeletonBlock className="h-7 w-20 rounded-full" />
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <SettingsSectionSkeleton titleWidth="w-40" rows={2} />
          <SettingsSectionSkeleton
            titleWidth="w-40"
            rows={2}
            includeTextarea
          />
          <SettingsSectionSkeleton titleWidth="w-32" rows={2} />
          <SettingsSectionSkeleton titleWidth="w-32" rows={1} />

          <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-border/70 bg-card/95 p-3 shadow-[0_-18px_40px_rgba(29,27,24,0.08)] backdrop-blur md:bottom-0 md:left-64">
            <div className="mx-auto grid max-w-6xl gap-3">
              <SkeletonBlock className="h-3 w-64" />
              <SkeletonBlock className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
