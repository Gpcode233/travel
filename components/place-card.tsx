import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  BeachIcon,
  CompassIcon,
  Hotel01Icon,
  Moon01Icon,
  Restaurant01Icon,
} from "@hugeicons/core-free-icons"

import type { Place, PlaceCategory } from "@/lib/enugu-data"
import { cn } from "@/lib/utils"

export const categoryMeta: Record<
  PlaceCategory,
  { label: string; icon: IconSvgElement }
> = {
  attraction: { label: "Attraction", icon: CompassIcon },
  hotel: { label: "Hotel", icon: Hotel01Icon },
  resort: { label: "Resort", icon: BeachIcon },
  restaurant: { label: "Restaurant", icon: Restaurant01Icon },
  nightlife: { label: "Nightlife", icon: Moon01Icon },
}

const timeBadgeCategories: PlaceCategory[] = ["attraction"]

export function PlaceCard({
  place,
  className,
}: {
  place: Place
  className?: string
}) {
  const meta = categoryMeta[place.category]
  const badge = timeBadgeCategories.includes(place.category)
    ? place.time
    : place.priceLevel

  return (
    <Link
      href={`/explore/${place.slug}`}
      className={cn(
        "group block overflow-hidden border transition hover:border-foreground/30",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className="size-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${place.image})` }}
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
          <HugeiconsIcon icon={meta.icon} className="size-3.5" />
          {meta.label}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-heading font-semibold">
              {place.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {place.area} · {place.kind}
            </p>
          </div>
          {badge && (
            <span className="shrink-0 border px-2 py-1 text-xs whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {place.note}
        </p>
      </div>
    </Link>
  )
}
