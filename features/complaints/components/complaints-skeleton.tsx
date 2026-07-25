import { Skeleton } from "@/components/ui/skeleton";

export function ComplaintsSkeleton() {
  return (
    <div aria-label="Loading complaints" className="grid gap-6" role="status">
      <span className="sr-only">Loading complaints</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <Skeleton className="h-10 w-80 max-w-full rounded-lg" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
