function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function HistoryLoading() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="max-w-5xl">
        <SkeletonBlock className="h-9 w-36" />
        <SkeletonBlock className="mt-3 h-4 w-56" />

        <section className="mt-8 rounded-2xl border border-border/70 bg-card/72 p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(150px,0.55fr)_minmax(150px,0.55fr)_minmax(150px,0.55fr)]">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <SkeletonBlock className="h-3 w-40" />
            <SkeletonBlock className="h-7 w-24" />
          </div>
        </section>

        <div className="mt-5 space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <section
              key={index}
              className="rounded-2xl border border-border/70 bg-card/72 p-5 shadow-[0_18px_30px_rgba(29,27,24,0.035)] md:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-5 w-28 rounded-full" />
                </div>
                <SkeletonBlock className="h-3 w-20" />
              </div>
              <div className="mt-4 divide-y divide-border/50">
                {Array.from({ length: 3 }).map((__, jobIndex) => (
                  <div key={jobIndex} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-2">
                        <SkeletonBlock className="h-4 w-2/3" />
                        <SkeletonBlock className="h-3 w-1/2" />
                        <SkeletonBlock className="h-3 w-full" />
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <SkeletonBlock className="h-4 w-20" />
                        <div className="flex gap-2">
                          <SkeletonBlock className="h-8 w-20" />
                          <SkeletonBlock className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
