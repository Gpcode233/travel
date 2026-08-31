import { Skeleton } from "@/components/ui/skeleton"

export default function TripDetailLoading() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <Skeleton className="h-64 w-full rounded-none sm:h-80" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <Skeleton className="h-7 w-56" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </main>
  )
}
