function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[0_20px_42px_rgba(29,27,24,0.04)] md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-9 w-64" />
              <SkeletonBlock className="h-4 w-52" />
            </div>
            <SkeletonBlock className="h-7 w-20 rounded-full" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/60 bg-background/70 p-4"
              >
                <SkeletonBlock className="h-3 w-16" />
                <SkeletonBlock className="mt-3 h-4 w-28" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-6">
          <SkeletonBlock className="h-3 w-28" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-12 w-full" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
