"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Location03Icon,
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
import { PlaceCard } from "@/components/place-card"
import { AppleCarousel } from "@/components/AppleCarousel"
import { PromoTicker } from "@/components/promo-ticker"
import { cn } from "@/lib/utils"
import { enuguAttractions } from "@/lib/enugu-data"
import {
  budgetTierList,
  calculateBudgetBaseline,
  formatBudgetBaseline,
  getBudgetTier,
  travelerCount,
  travelerOptions,
} from "@/lib/budget-tiers"

const featuredLocations = enuguAttractions.slice(0, 4)

const interests = ["Nature", "Food", "Culture", "Hiking", "Photography"]

export default function Page() {
  const router = useRouter()
  const [days, setDays] = useState<string | null>(null)
  const [travelers, setTravelers] = useState<string | null>(null)
  const [budget, setBudget] = useState<string | null>(null)
  const [pace, setPace] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  const duration = days ? Number(days) : null
  const travelerN = travelerCount(travelers)
  const budgetTier = getBudgetTier(budget)

  const baseline = useMemo(() => {
    if (!budgetTier || !travelerN || !duration) return null
    return calculateBudgetBaseline(budgetTier, travelerN, duration)
  }, [budgetTier, travelerN, duration])

  const [validationError, setValidationError] = useState(false)
  const [heroBg, setHeroBg] = useState(0)
  const heroBgs = [
    "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=1800",
    "/images/trails-background-2.png",
    "/images/trails-background-3.webp",
  ]
  useEffect(() => {
    const t = setInterval(() => setHeroBg((p) => (p + 1) % heroBgs.length), 6000)
    return () => clearInterval(t)
  }, [])

  const canPlanRoute = Boolean(days && travelers && budget && pace)

  const summary = useMemo(() => {
    const parts = [
      days ? `${days} days` : "Select duration",
      travelers ? `${travelers} traveler${travelers === "1" ? "" : "s"}` : "Select travelers",
      budgetTier ? budgetTier.label : "Select budget",
      pace ? `${pace} pace` : "Select pace",
    ]
    return parts.join(" · ")
  }, [days, travelers, budgetTier, pace])

  function openGuidedPlan() {
    if (!canPlanRoute || !days || !travelers) {
      setValidationError(true)
      const el = document.getElementById("build-plan-box")
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    const params = new URLSearchParams({
      mode: "guided",
      days,
      travelers,
      budget: budget ?? "",
      pace: pace ?? "",
      interests: selected.join(", "),
    })
    router.push(`/agent?${params.toString()}`)
  }

  function openOpenPlan() {
    if (!canPlanRoute) {
      setValidationError(true)
      const el = document.getElementById("build-plan-box")
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    openGuidedPlan()
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
        {heroBgs.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(8,12,18,.9), rgba(8,12,18,.5), rgba(8,12,18,.18)), url(${src})`,
              opacity: i === heroBg ? 1 : 0,
            }}
          />
        ))}
        <div className="relative mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col px-5 py-5 text-white sm:px-8 lg:px-10">
          <SiteHeader variant="overlay" />

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_420px]">
            <div className="max-w-3xl">
              <h1 className="max-w-3xl text-5xl leading-[.98] font-heading font-semibold tracking-normal sm:text-7xl lg:text-8xl">
                Plan a smarter adventure through Enugu.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                Browse waterfalls, hotels, restaurants, and cultural stops,
                then hand off to the Trails agent to shape a practical
                itinerary with local context.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={openOpenPlan}>
                  <HugeiconsIcon icon={Location03Icon} />
                  Generate trip
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/explore">
                    <HugeiconsIcon icon={Search01Icon} />
                    Explore places
                  </Link>
                </Button>
              </div>
            </div>

            <div
              id="build-plan-box"
              className={cn(
                "border bg-black/30 p-4 shadow-2xl backdrop-blur-md transition-all duration-300",
                validationError && !canPlanRoute
                  ? "border-red-500 ring-2 ring-red-500/50"
                  : "border-white/18"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[.16em] text-white/55 uppercase">
                    Trails Ai
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
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2 text-sm">
                    Duration
                    <Select value={days ?? ""} onValueChange={setDays}>
                      <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="4">4 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="6">6 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="8">8 days</SelectItem>
                        <SelectItem value="9">9 days</SelectItem>
                        <SelectItem value="10">10 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid gap-2 text-sm">
                    Travelers
                    <Select value={travelers ?? ""} onValueChange={setTravelers}>
                      <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                        <SelectValue placeholder="Select travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelerOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2 text-sm">
                    Budget
                    <Select value={budget ?? ""} onValueChange={setBudget}>
                      <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetTierList.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid gap-2 text-sm">
                    Pace
                    <Select value={pace ?? ""} onValueChange={setPace}>
                      <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                        <SelectValue placeholder="Select pace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="packed">Packed</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                {budgetTier && (
                  <p className="text-xs leading-5 text-white/60">
                    {budgetTier.description}
                  </p>
                )}

                {baseline && (
                  <div className="border border-white/15 bg-white/5 px-3 py-2.5">
                    <p className="text-xs tracking-[.1em] text-white/50 uppercase">
                      Estimated baseline
                    </p>
                    <p className="mt-1 text-lg font-heading font-semibold">
                      {formatBudgetBaseline(baseline)}
                    </p>
                    <p className="text-xs text-white/60">
                      for {travelers === "1" ? "1 traveler" : `${travelers} travelers`} · {days} days
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm">Choose interests</p>
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

                <Button onClick={openGuidedPlan} disabled={!canPlanRoute}>
                  <HugeiconsIcon icon={Calendar01Icon} />
                  Plan my route
                </Button>
                {!canPlanRoute && (
                  <p className="text-xs text-white/55">
                    Select your duration, travelers and budget to build your route.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PromoTicker variant="light" />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-1 lg:px-10">
        <AppleCarousel />
      </section>
    </main>
  )
}
