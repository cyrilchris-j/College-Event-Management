/**
 * Skeleton loaders for content placeholders during loading state.
 */

function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function EventRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border">
      <SkeletonBox className="w-[90px] h-[60px] rounded-lg flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBox className="h-4 w-3/5" />
        <SkeletonBox className="h-3 w-4/5" />
      </div>
      <SkeletonBox className="w-20 h-6 rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-shrink-0 w-28">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-4/5" />
      </div>
      <SkeletonBox className="w-24 h-3 flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-shrink-0 w-24">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-1.5 w-full rounded-full" />
      </div>
      <SkeletonBox className="w-24 h-8 rounded-lg flex-shrink-0" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-base flex items-center gap-4 p-5">
      <SkeletonBox className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-3 w-28" />
        <SkeletonBox className="h-3 w-24" />
      </div>
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBox className="w-full h-48 rounded-xl" />
      <SkeletonBox className="h-8 w-3/4" />
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-5/6" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBox className="h-16 rounded-lg" />
        <SkeletonBox className="h-16 rounded-lg" />
        <SkeletonBox className="h-16 rounded-lg" />
        <SkeletonBox className="h-16 rounded-lg" />
      </div>
    </div>
  );
}
