import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div aria-label="Loading dashboard" className="grid gap-6" role="status">
      <span className="sr-only">Loading dashboard</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-72 rounded-xl" key={index} />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
