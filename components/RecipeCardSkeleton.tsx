export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs animate-pulse">
      {/* Image Skeleton */}
      <div className="h-44 w-full bg-muted/60" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-14 bg-muted rounded" />
        </div>

        <div className="h-5 w-4/5 bg-muted rounded" />

        <div className="flex gap-2 py-1">
          <div className="h-6 w-16 bg-muted rounded-md" />
          <div className="h-6 w-14 bg-muted rounded-md" />
          <div className="h-6 w-14 bg-muted rounded-md" />
        </div>

        <div className="h-14 w-full bg-muted/50 rounded-xl" />

        <div className="pt-3 border-t border-border/40 flex items-center justify-between">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-8 w-28 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}

