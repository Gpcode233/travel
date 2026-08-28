"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight02Icon,
  CompassIcon,
  MapsIcon,
  RestaurantIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlaceCard } from "@/components/place-card"
import { cn } from "@/lib/utils"
import { travelerOptions, budgetTierList } from "@/lib/budget-tiers"
import { enuguAttractions, enuguHotels } from "@/lib/enugu-data"

const paceOptions = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "fast", label: "Fast-paced" },
]

const interestOptions = ["Nature", "Food", "Culture", "Adventure", "Nightlife"]

const featuredPlaces = [...enuguAttractions.slice(0, 3), ...enuguHotels.slice(0, 1)]

export default function HomePage() {
  const router = useRouter()

  const [days, setDays] = useState("3")
  const [travelers, setTravelers] = useState("2")
  const [budget, setBudget] = useState("mid-range")
  const [pace, setPace] = useState("relaxed")
  const [interests, setInterests] = useState<string[]>(["Nature", "Food", "Culture"])

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  function handleGenerate() {
    const params = new URLSearchParams({
      days,
      travelers,
      budget,
      pace,
      interests: interests.join(", "),
      destination: "Enugu",
    })
    router.push(`/agent?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="size-full bg-cover bg-center"
            style={{ backgroundImage: "url(/images/landmark-resort-1.webp)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(26,17,10,.88), rgba(26,17,10,.55) 55%, rgba(26,17,10,.2))",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
          <SiteHeader variant="overlay" />

          <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="text-white">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[.16em] text-white/70 uppercase">
                <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
                Trails AI
              </span>
              <h1 className="mt-4 font-heading text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Plan a smarter adventure through Enugu.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Browse waterfalls, hotels, restaurants, and cultural stops, then
                hand off to the Trails agent to shape a practical itinerary
                with local context.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleGenerate}>
                  Generate trip
                  <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
                </Button>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Explore places
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-6">
                <div>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/20">
                    <HugeiconsIcon icon={CompassIcon} className="size-5 text-primary" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Adventure fit</p>
                  <p className="mt-1 text-xs text-white/60">Matched to your pace and interests.</p>
                </div>
                <div>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/20">
                    <HugeiconsIcon icon={MapsIcon} className="size-5 text-primary" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Local context</p>
                  <p className="mt-1 text-xs text-white/60">Real areas, real travel times.</p>
                </div>
                <div>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/20">
                    <HugeiconsIcon icon={RestaurantIcon} className="size-5 text-primary" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Food, stays, and stops</p>
                  <p className="mt-1 text-xs text-white/60">A full trip, not just a list.</p>
                </div>
              </div>
            </div>

            {/* Planner form */}
            <div className="rounded-3xl border border-white/18 bg-black/30 p-6 backdrop-blur-md sm:p-8">
              <h2 className="font-heading text-lg font-semibold text-white">
                Build your trip
              </h2>
              <p className="mt-1 text-sm text-white/60">
                A few details, then the Trails agent takes it from here.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-white/70">
                  Days
                  <Select value={days} onValueChange={setDays}>
                    <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-white/70">
                  Travelers
                  <Select value={travelers} onValueChange={setTravelers}>
                    <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {travelerOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-white/70">Budget</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {budgetTierList.map((tier) => (
                    <Button
                      key={tier.value}
                      type="button"
                      size="sm"
                      variant={budget === tier.value ? "default" : "outline"}
                      onClick={() => setBudget(tier.value)}
                      className={cn(
                        budget !== tier.value &&
                          "border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {tier.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-white/70">Pace</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {paceOptions.map((p) => (
                    <Button
                      key={p.value}
                      type="button"
                      size="sm"
                      variant={pace === p.value ? "default" : "outline"}
                      onClick={() => setPace(p.value)}
                      className={cn(
                        pace !== p.value &&
                          "border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-white/70">Interests</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      size="sm"
                      variant={interests.includes(interest) ? "secondary" : "outline"}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        !interests.includes(interest) &&
                          "border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              <Button size="lg" className="mt-6 w-full" onClick={handleGenerate}>
                Generate trip
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured places */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium tracking-[.16em] text-muted-foreground uppercase">
              Featured Enugu
            </span>
            <h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">
              Start with a few favorites
            </h2>
          </div>
          <Link
            href="/explore"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            See all places
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>

        <Link
          href="/explore"
          className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
        >
          See all places
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Link>
      </section>
    </main>
  )
}
