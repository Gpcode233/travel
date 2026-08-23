import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { enuguLocations } from "@/lib/enugu-data"

export const metadata: Metadata = {
  title: "Enugu Locations · Enugu Trails AI",
  description:
    "Waterfalls, caves, forests, lakefronts, and cultural stops across Enugu State.",
}

export default function LocationsPage() {
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
          Every Enugu stop worth building a route around.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Waterfalls, cave trails, lakefronts, and city-day stops. Pick a few
          and hand them to the planner on the home page for a full itinerary.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enuguLocations.map((location) => (
            <article
              key={location.name}
              className="group overflow-hidden border"
            >
              <div
                className="aspect-[4/3] bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${location.image})` }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-heading font-semibold">
                      {location.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {location.area} · {location.kind}
                    </p>
                  </div>
                  <span className="shrink-0 border px-2 py-1 text-xs">
                    {location.time}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {location.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
