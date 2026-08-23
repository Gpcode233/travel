import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { nigeriaSpots } from "@/lib/enugu-data"

export const metadata: Metadata = {
  title: "Nigeria Extensions · Enugu Trails AI",
  description:
    "Wider Nigerian destinations worth adding once an Enugu trip runs longer.",
}

export default function NigeriaPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SiteHeader />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <p className="text-sm font-medium text-muted-foreground">
          Beyond Enugu
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-heading font-semibold sm:text-5xl">
          Wider Nigeria extensions for longer trips.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Once a trip runs past a few days, these are the destinations worth
          the extra road or flight time from Enugu.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nigeriaSpots.map((spot) => (
            <article key={spot.name} className="group overflow-hidden border">
              <div
                className="aspect-[4/3] bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${spot.image})` }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-heading font-semibold">
                      {spot.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {spot.area} · {spot.kind}
                    </p>
                  </div>
                  <span className="shrink-0 border px-2 py-1 text-xs">
                    {spot.time}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {spot.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
