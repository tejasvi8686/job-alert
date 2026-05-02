function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function SavedJobsLoading() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="max-w-5xl">
        <SkeletonBlock className="h-9 w-44" />
        <SkeletonBlock className="mt-3 h-4 w-72" />

        <section className="mt-8 rounded-2xl border border-border/70 bg-card/72 p-4">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="mt-3 h-3 w-36" />
        </section>

        <div className="mt-5 grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <section
              key={index}
              className="rounded-2xl border border-border/70 bg-card/72 p-5 shadow-[0_18px_30px_rgba(29,27,24,0.035)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-56" />
                    <SkeletonBlock className="h-5 w-24 rounded-full" />
                  </div>
                  <SkeletonBlock className="h-3 w-44" />
                  <SkeletonBlock className="h-3 w-full max-w-2xl" />
                  <SkeletonBlock className="h-3 w-28" />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <SkeletonBlock className="h-7 w-20 rounded-full" />
                  <SkeletonBlock className="h-8 w-24" />
                  <SkeletonBlock className="h-8 w-20" />
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
