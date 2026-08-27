"use client"

import Link from "next/link"
import { enuguAttractions } from "@/lib/enugu-data"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Location03Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export function AppleCarousel() {
  const items = enuguAttractions.slice(0, 6)

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            Curated Highlights
          </p>
          <h2 className="text-2xl font-heading font-bold sm:text-3xl text-foreground">
            Featured Enugu Destinations
          </h2>
        </div>
        <Link
          href="/explore"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Explore all places</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Horizontal Apple-style scrolling track */}
      <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((place) => (
          <Link
            key={place.slug}
            href={`/explore/${place.slug}`}
            className="group relative h-[380px] w-[280px] sm:w-[320px] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-card border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${place.image})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

            {/* Top Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/20">
                <HugeiconsIcon icon={Location03Icon} className="size-3" />
                {place.area}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span>{place.kind}</span>
                {place.time && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                      {place.time}
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-xl font-heading font-bold leading-tight group-hover:text-blue-300 transition-colors">
                {place.name}
              </h3>

              <p className="line-clamp-2 text-xs text-white/80 leading-relaxed">
                {place.note || place.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/explore" className="gap-2">
            <span>Browse Full Directory</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
