import Link from "next/link"
import Image from "next/image"
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
import { Badge } from "@/components/ui/badge"

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
        "group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition hover:border-primary/40 shadow-xs",
        className
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={place.image}
          alt={place.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 h-auto gap-1 bg-background/90 px-2.5 py-1 backdrop-blur"
        >
          <HugeiconsIcon icon={meta.icon} className="size-3.5" />
          {meta.label}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-[2.8rem] text-lg font-heading font-semibold leading-snug text-foreground">
            {place.name}
          </h3>
          {badge && (
            <Badge variant="outline" className="h-auto shrink-0 px-2 py-0.5 text-[11px] font-normal whitespace-nowrap">
              {badge}
            </Badge>
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
          {place.area} · {place.kind}
        </p>
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {place.note}
        </p>
      </div>
    </Link>
  )
}
