"use client"

import { useState } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { GridViewIcon } from "@hugeicons/core-free-icons"

import { categoryMeta, PlaceCard } from "@/components/place-card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { Place, PlaceCategory } from "@/lib/enugu-data"

const filters: {
  value: "all" | PlaceCategory
  label: string
  icon: IconSvgElement
}[] = [
  { value: "all", label: "All", icon: GridViewIcon },
  { value: "attraction", label: "Attractions", icon: categoryMeta.attraction.icon },
  { value: "hotel", label: "Hotels", icon: categoryMeta.hotel.icon },
  { value: "resort", label: "Resorts", icon: categoryMeta.resort.icon },
  { value: "restaurant", label: "Restaurants", icon: categoryMeta.restaurant.icon },
  { value: "nightlife", label: "Nightlife", icon: categoryMeta.nightlife.icon },
]

const SECTION_ORDER: PlaceCategory[] = ["attraction", "hotel", "resort", "restaurant", "nightlife"]

function SectionHeading({
  category,
  count,
  onShowAll,
}: {
  category: PlaceCategory
  count: number
  onShowAll: () => void
}) {
  const meta = categoryMeta[category]
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={meta.icon} className="size-5 text-muted-foreground" />
        <h2 className="font-heading text-xl font-semibold">{meta.label}s</h2>
        <span className="text-sm text-muted-foreground">({count})</span>
      </div>
      <button
        onClick={onShowAll}
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        See all →
      </button>
    </div>
  )
}

export function ExploreClient({ places }: { places: Place[] }) {
  const [filter, setFilter] = useState<"all" | PlaceCategory>("all")

  const byCategory = (cat: PlaceCategory) => places.filter((p) => p.category === cat)
  const filtered = filter === "all" ? places : places.filter((p) => p.category === filter)

  return (
    <Tabs
      className="mt-8"
      value={filter}
      onValueChange={(value) => setFilter(value as "all" | PlaceCategory)}
    >
      <TabsList>
        {filters.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            <HugeiconsIcon icon={item.icon} className="size-5" />
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Specific-category view: flat grid */}
      {filter !== "all" && (
        <TabsContent value={filter}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((place) => (
              <PlaceCard key={place.slug} place={place} />
            ))}
          </div>
        </TabsContent>
      )}

      {/* All view: segmented by category */}
      {filter === "all" && (
        <TabsContent value="all">
          <div className="mt-10 space-y-14">
            {SECTION_ORDER.map((cat) => {
              const items = byCategory(cat)
              if (items.length === 0) return null
              const preview = items.slice(0, 3)
              return (
                <section key={cat}>
                  <SectionHeading
                    category={cat}
                    count={items.length}
                    onShowAll={() => setFilter(cat)}
                  />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {preview.map((place) => (
                      <PlaceCard key={place.slug} place={place} />
                    ))}
                  </div>
                  {items.length > 3 && (
                    <button
                      onClick={() => setFilter(cat)}
                      className="mt-4 text-sm text-muted-foreground hover:text-foreground"
                    >
                      +{items.length - 3} more {categoryMeta[cat].label.toLowerCase()}s
                    </button>
                  )}
                </section>
              )
            })}
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}
