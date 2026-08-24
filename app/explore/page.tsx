import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { allPlaces } from "@/lib/enugu-data"

import { ExploreClient } from "./explore-client"

export const metadata: Metadata = {
  title: "Explore Enugu",
  description:
    "Attractions, hotels, resorts, and restaurants across Enugu State, plus wider Nigeria extensions, filterable in one place.",
}

export default function ExplorePage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SiteHeader />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <p className="text-sm font-medium text-muted-foreground">
          Enugu, Nigeria
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-heading font-semibold sm:text-5xl">
          Everything worth building an Enugu trip around.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Attractions, hotels, resorts, and restaurants in Enugu, plus wider
          Nigeria extensions for longer trips. Filter by category, then open
          a place for the full details.
        </p>

        <ExploreClient places={allPlaces} />
      </section>
    </main>
  )
}
