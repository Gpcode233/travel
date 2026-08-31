import { Skeleton } from "@/components/ui/skeleton"

export default function TripsLoading() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-3xl border">
              <Skeleton className="aspect-4/3 w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
