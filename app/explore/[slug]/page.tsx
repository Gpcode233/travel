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
} from "@hugeicons/core-free-icons"

import { SiteHeader } from "@/components/site-header"
import { PlaceCard } from "@/components/place-card"
import { Button } from "@/components/ui/button"
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

        <div
          className="mt-6 aspect-video w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${place.image})` }}
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
            <span className="inline-flex items-center gap-1.5 border px-3 py-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
              {place.time}
            </span>
          )}
          {place.priceLevel && (
            <span className="inline-flex items-center gap-1.5 border px-3 py-1.5">
              <HugeiconsIcon icon={Tag01Icon} className="size-4" />
              {place.priceLevel}
            </span>
          )}
          {place.address && (
            <span className="inline-flex items-center gap-1.5 border px-3 py-1.5">
              <HugeiconsIcon icon={Location05Icon} className="size-4" />
              {place.address}
            </span>
          )}
        </div>

        <p className="mt-8 max-w-3xl leading-7 text-foreground">
          {place.description}
        </p>

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
