import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Location03Icon,
  UserGroupIcon,
  ArrowRight02Icon,
  CompassIcon,
} from "@hugeicons/core-free-icons"

import { prisma } from "@/lib/prisma"
import { getSessionUserId } from "@/lib/db-user"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import type { TripItinerary } from "@/lib/itinerary-types"

export default async function TripsPage() {
  const userId = await getSessionUserId()
  if (!userId) redirect("/")

  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SiteHeader />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <h1 className="font-heading text-3xl font-semibold">My Trips</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every itinerary you've saved with the Trails agent.
        </p>

        {trips.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 py-16 text-center">
            <HugeiconsIcon icon={CompassIcon} className="size-10 text-muted-foreground/40" />
            <p className="font-medium">No saved trips yet</p>
            <p className="text-sm text-muted-foreground">
              Plan a trip with the Trails agent and save it here.
            </p>
            <Button asChild className="mt-2">
              <Link href="/agent">Start planning</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => {
              const itinerary = trip.itinerary as unknown as TripItinerary
              const dossier = itinerary?.dossier

              return (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="group block overflow-hidden rounded-3xl border transition hover:border-primary/40"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    {dossier?.heroImageUrl && (
                      <Image
                        src={dossier.heroImageUrl}
                        alt={trip.title || dossier?.title || "Trip plan"}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-heading font-semibold">
                      {trip.title || dossier?.title || "Trip plan"}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {dossier?.destination && (
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Location03Icon} className="size-3.5" />
                          {dossier.destination}
                        </span>
                      )}
                      {dossier?.dateRangeLabel && (
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
                          {dossier.dateRangeLabel}
                        </span>
                      )}
                      {dossier?.travelersLabel && (
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
                          {dossier.travelersLabel}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                      View trip
                      <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
