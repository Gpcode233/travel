import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Location03Icon,
  UserGroupIcon,
  BedIcon,
  Clock01Icon,
  SparklesIcon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"

import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import type { TripItinerary, ItineraryDay, AccommodationOption } from "@/lib/itinerary-types"

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  hotel: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  nature: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  culture: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  attraction: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  adventure: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  relaxation: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  nightlife: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  transport: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getOrCreateDbUser()
  if (!user) redirect("/")

  const trip = await prisma.trip.findFirst({
    where: { id, userId: user.id },
  })

  if (!trip) notFound()

  const itinerary = trip.itinerary as unknown as TripItinerary
  const { dossier, days, accommodations, selectedAccommodationId, budgetBreakdown } = itinerary

  const hotel: AccommodationOption | undefined =
    accommodations.find((a) => a.id === selectedAccommodationId) ?? accommodations[0]

  return (
    <main className="min-h-svh bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SiteHeader />
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative h-64 sm:h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${dossier.heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <Link
              href="/account"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              My trips
            </Link>
            <h1 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
              {dossier.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Location03Icon} className="size-4" />
                {dossier.destination}, {dossier.destinationCountry}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
                {dossier.dateRangeLabel}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                {dossier.travelersLabel}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Tag01Icon} className="size-4" />
                {dossier.budgetTierLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left: Itinerary */}
          <div>
            <h2 className="font-heading text-2xl font-semibold">Your Itinerary</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {dossier.daysCount} days · {dossier.pace} pace · {dossier.interests.join(", ")}
            </p>

            <div className="mt-8 space-y-10">
              {days.map((day: ItineraryDay) => (
                <div key={day.id}>
                  {/* Day header */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {day.dayNumber}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Day {day.dayNumber} · {day.dateLabel}
                      </p>
                      <h3 className="font-heading text-lg font-semibold">{day.title}</h3>
                    </div>
                  </div>
                  {day.summary && (
                    <p className="ml-12 mt-1 text-sm text-muted-foreground">{day.summary}</p>
                  )}

                  {/* Activities */}
                  <div className="ml-4 mt-4 border-l-2 border-border pl-8 space-y-5">
                    {day.activities.map((act) => (
                      <div key={act.id} className="relative">
                        <div className="absolute -left-[2.15rem] top-1.5 size-3.5 rounded-full border-2 border-blue-500 bg-background" />
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                                <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                                {act.startTime}
                                {act.durationLabel && ` · ${act.durationLabel}`}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                                  categoryColors[act.category] ?? categoryColors.attraction
                                }`}
                              >
                                {act.category}
                              </span>
                            </div>
                            <p className="mt-1 font-medium">{act.title}</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                              {act.description}
                            </p>
                            {act.location.area && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <HugeiconsIcon icon={Location03Icon} className="size-3" />
                                {act.location.name}
                                {act.location.area && act.location.area !== act.location.name
                                  ? ` · ${act.location.area}`
                                  : ""}
                              </p>
                            )}
                          </div>
                          {act.estimatedCost > 0 && (
                            <span className="shrink-0 text-sm font-medium">
                              {act.formattedCost ?? formatNGN(act.estimatedCost)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hotel + Budget */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Hotel card */}
            {hotel && (
              <div className="overflow-hidden rounded-sm border bg-card">
                <div className="relative h-40 w-full bg-muted">
                  {hotel.imageUrl && (
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {hotel.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {hotel.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{hotel.area}</p>
                      <h3 className="font-heading text-lg font-semibold">{hotel.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading text-base font-bold">{hotel.formattedPrice}</p>
                      <p className="text-xs text-muted-foreground">/night</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {hotel.description}
                  </p>
                  {hotel.amenities.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {hotel.amenities.slice(0, 5).map((a) => (
                        <li key={a} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3 shrink-0 text-green-500" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  {hotel.slug && (
                    <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                      <Link href={`/explore/${hotel.slug}`}>View hotel details</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Budget breakdown */}
            <div className="rounded-sm border bg-card p-4">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={SparklesIcon} className="size-4 text-blue-500" />
                <h3 className="font-heading font-semibold">Estimated Budget</h3>
              </div>
              <div className="mt-4 space-y-2">
                {budgetBreakdown.categories.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{cat.label}</span>
                    <span className="font-medium">{cat.formattedAmount}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex items-center justify-between font-heading font-semibold">
                  <span>Total estimate</span>
                  <span className="text-blue-600">{budgetBreakdown.formattedRange}</span>
                </div>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">Plan another trip</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
