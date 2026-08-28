import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Clock01Icon,
  Location05Icon,
  SparklesIcon,
  Tag01Icon,
  BedIcon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { SiteHeader } from "@/components/site-header"
import { PlaceCard } from "@/components/place-card"
import { PlaceImageCarousel } from "@/components/place-image-carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { allPlaces, findPlaceBySlug } from "@/lib/enugu-data"

export function generateStaticParams() {
  return allPlaces.map((place) => ({ slug: place.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const place = findPlaceBySlug(slug)

  if (!place) {
    return { title: "Not found" }
  }

  return {
    title: place.name,
    description: place.note,
  }
}

export default async function PlaceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const place = findPlaceBySlug(slug)

  if (!place) {
    notFound()
  }

  const related = allPlaces
    .filter((item) => item.category === place.category && item.slug !== place.slug)
    .slice(0, 3)

  const agentPrompt = `Tell me more about ${place.name} in ${place.area} and how to fit it into an Enugu itinerary.`

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SiteHeader />
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to Explore
        </Link>

        <PlaceImageCarousel
          images={[place.image, ...(place.images ?? [])]}
          alt={place.name}
        />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground capitalize">
              {place.category} · {place.area}
            </p>
            <h1 className="mt-2 text-4xl font-heading font-semibold sm:text-5xl">
              {place.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{place.kind}</p>
          </div>
          <Button asChild size="lg">
            <Link href={`/agent?prompt=${encodeURIComponent(agentPrompt)}`}>
              <HugeiconsIcon icon={SparklesIcon} />
              Ask the agent
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {place.time && (
            <Badge variant="outline" className="h-auto gap-1.5 px-3 py-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
              {place.time}
            </Badge>
          )}
          {place.priceLevel && (
            <Badge variant="outline" className="h-auto gap-1.5 px-3 py-1.5">
              <HugeiconsIcon icon={Tag01Icon} className="size-4" />
              {place.priceLevel}
            </Badge>
          )}
          {place.address && (
            <Badge variant="outline" className="h-auto gap-1.5 px-3 py-1.5">
              <HugeiconsIcon icon={Location05Icon} className="size-4" />
              {place.address}
            </Badge>
          )}
        </div>

        <p className="mt-8 max-w-3xl leading-7 text-foreground">
          {place.description}
        </p>

        {/* Room tiers — hotels only */}
        {place.category === "hotel" && place.rooms && place.rooms.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-semibold">Room types &amp; rates</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prices per night · Select a room when booking through Trails
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {place.rooms.map((room) => (
                <div
                  key={room.name}
                  className="flex flex-col justify-between rounded border border-border bg-card p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={BedIcon} className="size-4 text-muted-foreground" />
                        <h3 className="font-heading font-semibold">{room.name}</h3>
                      </div>
                      {room.maxOccupancy && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <HugeiconsIcon icon={UserGroupIcon} className="size-3" />
                          {room.maxOccupancy}
                        </span>
                      )}
                    </div>
                    {room.description && (
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {room.description}
                      </p>
                    )}
                    <ul className="mt-3 space-y-1">
                      {room.amenities.map((a) => (
                        <li key={a} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3 text-green-500 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <p className="font-heading text-lg font-bold">{room.formattedPrice}</p>
                    <Button asChild size="sm" className="mt-3 w-full bg-blue-600 text-white hover:bg-blue-700">
                      <Link href={`/agent?budget=${encodeURIComponent("mid-range")}&prompt=${encodeURIComponent(`Book a ${room.name} at ${place.name}`)}`}>
                        <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
                        Plan trip with this room
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Website link for partner hotels */}
        {place.website && (
          <div className="mt-8">
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
            >
              Visit official website →
            </a>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <p className="text-sm font-medium text-muted-foreground">
              More {place.category}s
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PlaceCard key={item.slug} place={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
