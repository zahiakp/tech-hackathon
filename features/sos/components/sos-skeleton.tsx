import { Skeleton } from "@/components/ui/skeleton";

export function SosSkeleton() {
  return (
    <div aria-label="Loading SOS interface" className="grid gap-6" role="status">
      <span className="sr-only">Loading SOS interface</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
