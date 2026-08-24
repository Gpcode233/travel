"use client"

import { useMemo, useState } from "react"

import { PlaceCard } from "@/components/place-card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { Place, PlaceCategory } from "@/lib/enugu-data"

const filters: { value: "all" | PlaceCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "attraction", label: "Attractions" },
  { value: "hotel", label: "Hotels" },
  { value: "resort", label: "Resorts" },
  { value: "restaurant", label: "Restaurants" },
  { value: "nigeria", label: "Nigeria" },
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
