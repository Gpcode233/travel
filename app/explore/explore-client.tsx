"use client"

import { useMemo, useState } from "react"
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
  {
    value: "attraction",
    label: "Attractions",
    icon: categoryMeta.attraction.icon,
  },
  { value: "hotel", label: "Hotels", icon: categoryMeta.hotel.icon },
  { value: "resort", label: "Resorts", icon: categoryMeta.resort.icon },
  {
    value: "restaurant",
    label: "Restaurants",
    icon: categoryMeta.restaurant.icon,
  },
  { value: "nigeria", label: "Nigeria", icon: categoryMeta.nigeria.icon },
]

export function ExploreClient({ places }: { places: Place[] }) {
  const [filter, setFilter] = useState<"all" | PlaceCategory>("all")

  const filtered = useMemo(
    () =>
      filter === "all"
        ? places
        : places.filter((place) => place.category === filter),
    [places, filter]
  )

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
      <TabsContent value={filter}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
