export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-champagne/60 bg-white/30 py-16 text-center">
      <div className="mb-3 text-4xl">🍰</div>
      <p className="font-display text-lg text-burgundy-dark">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
    </div>
  );
}

export function CakeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-white/50 bg-white/40">
          <div className="skeleton aspect-square" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-2/3 rounded-full" />
            <div className="skeleton h-3 w-1/3 rounded-full" />
            <div className="skeleton h-3 w-full rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}
