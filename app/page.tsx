"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Loading03Icon,
  MapPinIcon,
  MountainIcon,
  Search01Icon,
  SparklesIcon,
  SpoonAndForkIcon,
  Tree01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"
import { enuguLocations, nigeriaSpots } from "@/lib/enugu-data"

const featuredLocations = enuguLocations.slice(0, 4)

const interests = ["Nature", "Food", "Culture", "Hiking", "Photography"]

type PlanResponse = {
  plan: string
  source: "web" | "fallback"
}

export default function Page() {
  const [days, setDays] = useState("3")
  const [budget, setBudget] = useState("mid-range")
  const [pace, setPace] = useState("balanced")
  const [selected, setSelected] = useState(["Nature", "Food", "Photography"])
  const [plan, setPlan] = useState<PlanResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const summary = useMemo(
    () => `${days} days · ${budget} · ${pace} pace`,
    [days, budget, pace]
  )

  async function generatePlan() {
    setLoading(true)
    setPlan(null)

    const response = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, budget, pace, interests: selected }),
    })

    const data = (await response.json()) as PlanResponse
    setPlan(data)
    setLoading(false)
  }

  function toggleInterest(interest: string) {
    setSelected((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    )
  }

  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[92svh] border-b">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,12,18,.9), rgba(8,12,18,.5), rgba(8,12,18,.18)), url(https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="relative mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col px-5 py-5 text-white sm:px-8 lg:px-10">
          <SiteHeader variant="overlay" />

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_420px]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                <HugeiconsIcon icon={MapPinIcon} className="size-3.5" />
                Enugu first, Nigeria next
              </div>
              <h1 className="max-w-3xl text-5xl leading-[.98] font-heading font-semibold tracking-normal sm:text-7xl lg:text-8xl">
                Plan a smarter adventure through Enugu.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                Browse waterfalls, caves, lakefronts, pine trails, and cultural
                stops, then ask an AI travel agent to shape a practical
                itinerary with local context.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={generatePlan}>
                  <HugeiconsIcon icon={SparklesIcon} />
                  Generate trip
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/locations">
                    <HugeiconsIcon icon={Search01Icon} />
                    Explore places
                  </Link>
                </Button>
              </div>
            </div>

            <div className="border border-white/18 bg-black/30 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[.16em] text-white/55 uppercase">
                    AI itinerary agent
                  </p>
                  <h2 className="mt-1 text-2xl font-heading font-semibold">
                    Build plan
                  </h2>
                </div>
                <HugeiconsIcon
                  icon={SparklesIcon}
                  className="size-5 text-white/70"
                />
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm">
                  Days
                  <Select value={days} onValueChange={setDays}>
                    <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="6">6 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="8">8 days</SelectItem>
                      <SelectItem value="9">9 days</SelectItem>
                      <SelectItem value="10">10 days</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2 text-sm">
                    Budget
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lean">Lean</SelectItem>
                        <SelectItem value="mid-range">Mid-range</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid gap-2 text-sm">
                    Pace
                    <Select value={pace} onValueChange={setPace}>
                      <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="packed">Packed</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <div>
                  <p className="text-sm">Interests</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          "border px-3 py-1.5 text-xs transition",
                          selected.includes(interest)
                            ? "border-white bg-white text-black"
                            : "border-white/20 bg-white/10 text-white"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={generatePlan} disabled={loading}>
                  {loading ? (
                    <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={Calendar01Icon} />
                  )}
                  {loading ? "Planning..." : "Plan my route"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.75fr_1fr] lg:px-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Featured Enugu
          </p>
          <h2 className="mt-3 text-4xl font-heading font-semibold">
            Nature routes with enough detail to plan around.
          </h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">
            Start with high-signal places around Enugu, then expand into wider
            Nigerian destinations when trip gets longer.
          </p>
          <Link
            href="/locations"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            See all Enugu locations
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featuredLocations.map((location) => (
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
                    <h3 className="text-xl font-heading font-semibold">
                      {location.name}
                    </h3>
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

      <section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div className="flex gap-4">
            <HugeiconsIcon icon={MountainIcon} className="mt-1 size-5 text-primary" />
            <div>
              <h3 className="font-medium">Adventure fit</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Routes balance distance, daylight, terrain, and rest windows.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <HugeiconsIcon icon={Tree01Icon} className="mt-1 size-5 text-primary" />
            <div>
              <h3 className="font-medium">Local context</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Enugu places get priority before wider Nigeria suggestions.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <HugeiconsIcon icon={SpoonAndForkIcon} className="mt-1 size-5 text-primary" />
            <div>
              <h3 className="font-medium">Food stops</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Plans include breaks for local meals, not only sightseeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[420px_1fr] lg:px-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Current request
          </p>
          <h2 className="mt-3 text-4xl font-heading font-semibold">
            {summary}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {selected.map((item) => (
              <span key={item} className="border px-3 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Useful Nigeria extensions</p>
              <Link
                href="/nigeria"
                className="text-sm font-medium text-primary hover:underline"
              >
                See all
              </Link>
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {nigeriaSpots.map((spot) => (
                <li key={spot.name}>
                  • {spot.name}, {spot.area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-h-[420px] border bg-background p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Generated itinerary</p>
              <p className="text-xs text-muted-foreground">
                Uses Groq (gpt-oss-20b) web search when `GROQ_API_KEY` is
                configured.
              </p>
            </div>
            {plan?.source ? (
              <span className="border px-2 py-1 text-xs uppercase">
                {plan.source}
              </span>
            ) : null}
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 size-4 animate-spin"
              />
              Checking context and drafting route...
            </div>
          ) : plan ? (
            <pre className="font-mono text-sm leading-7 whitespace-pre-wrap text-foreground">
              {plan.plan}
            </pre>
          ) : (
            <div className="grid min-h-[300px] place-items-center text-center">
              <div className="max-w-sm">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  className="mx-auto mb-4 size-8 text-primary"
                />
                <p className="font-medium">No route generated yet.</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Choose trip settings above, then generate practical Enugu
                  itinerary.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
