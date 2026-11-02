import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-5">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <Skeleton className="mt-4 h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 lg:col-span-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3 w-56" />
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-6 h-64 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
