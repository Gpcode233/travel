"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight02Icon,
  CompassIcon,
  MapsIcon,
  RestaurantIcon,
  Calendar01Icon,
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { PlaceCard } from "@/components/place-card"
import { PromoTicker } from "@/components/promo-ticker"
import { useTypewriter } from "@/hooks/use-typewriter"
import { cn } from "@/lib/utils"
import { travelerOptions, budgetTierList } from "@/lib/budget-tiers"
import { enuguAttractions, enuguHotels } from "@/lib/enugu-data"

const EASTER_EGG_PASSWORD = "tyger, tyger"

const paceOptions = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "fast", label: "Fast-paced" },
]

const interestOptions = ["Nature", "Food", "Culture", "Adventure", "Nightlife"]

const featuredPlaces = [...enuguAttractions.slice(0, 3), ...enuguHotels.slice(0, 1)]

const heroCopies = [
  "Discover Enugu. Experience it your way.",
  "Your perfect Enugu experience starts here.",
  "Explore Enugu with a trip built around you.",
]

const heroBackgrounds = [
  { src: "/images/trails-background-2.png", position: "center center" },
  { src: "/images/trails_background_3.png", position: "center center" },
  { src: "/images/landmark-resort-4.jpg", position: "center center" },
  { src: "/images/trails_background_4.webp", position: "center center" },
  { src: "/images/trails_background_5.jpg", position: "center center" },
  { src: "/images/trails_background_6.webp", position: "center 18%" },
]

export default function HomePage() {
  const router = useRouter()
  const typedTitle = useTypewriter(heroCopies)

  const [days, setDays] = useState("")
  const [travelers, setTravelers] = useState("")
  const [budget, setBudget] = useState("")
  const [pace, setPace] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [daysError, setDaysError] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  const [heroIndex, setHeroIndex] = useState(0)

  // Easter egg: press spacebar 5x on the hero to open a password prompt
  // that unlocks a ₦500 test trip for exercising the payment flow.
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [eggPassword, setEggPassword] = useState("")
  const [eggError, setEggError] = useState(false)
  const spacePressCount = useRef(0)
  const spacePressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroBackgrounds.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Flag set by /checkout when a non-authorized account tries to pay the
  // test-trip listing — bounce them here and shake the form red.
  useEffect(() => {
    if (sessionStorage.getItem("trails_denied_shake") === "1") {
      sessionStorage.removeItem("trails_denied_shake")
      setAccessDenied(true)
      setIsShaking(true)
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => setIsShaking(false), 500)
    }
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space") {
        spacePressCount.current = 0
        return
      }
      const target = e.target as HTMLElement | null
      const isInteractive =
        target &&
        (["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(target.tagName) ||
          target.isContentEditable ||
          target.closest('[role="button"], [role="dialog"], [role="listbox"]'))
      if (isInteractive || showEasterEgg) return

      e.preventDefault()
      spacePressCount.current += 1
      if (spacePressTimer.current) clearTimeout(spacePressTimer.current)
      spacePressTimer.current = setTimeout(() => {
        spacePressCount.current = 0
      }, 1500)

      if (spacePressCount.current >= 5) {
        spacePressCount.current = 0
        setEggPassword("")
        setEggError(false)
        setShowEasterEgg(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [showEasterEgg])

  function handleEggSubmit() {
    if (eggPassword.trim().toLowerCase() === EASTER_EGG_PASSWORD) {
      setShowEasterEgg(false)
      router.push("/agent?testTrip=1")
    } else {
      setEggError(true)
    }
  }

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  function handleGenerate() {
    if (!days) {
      setDaysError(true)
      setIsShaking(true)
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    const params = new URLSearchParams({
      days,
      travelers,
      budget,
      pace,
      interests: interests.join(", "),
      destination: "Enugu",
      ...(startDate ? { startDate: startDate.toISOString().slice(0, 10) } : {}),
    })
    router.push(`/agent?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-background">
      <PromoTicker variant="orange" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroBackgrounds.map((bg, index) => (
            <div
              key={bg.src}
              className="absolute inset-0 size-full bg-cover transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${bg.src})`,
                backgroundPosition: bg.position,
                opacity: index === heroIndex ? 1 : 0,
              }}
            />
          ))}
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
              <h1 className="mt-4 min-h-[3.3em] font-heading text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
                {typedTitle}
                <span className="animate-blink-cursor ml-0.5 inline-block w-0.5 bg-white align-middle" style={{ height: "0.85em" }} />
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Discover Enugu on a budget, without the legwork. Trails finds the places worth 
                experiencing, from waterfalls and resorts to hotels, restaurants, and cultural gems, 
                then shapes them into a practical itinerary with local context.
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
            <div
              ref={formRef}
              className={cn(
                "rounded-3xl border bg-black/30 p-6 backdrop-blur-md sm:p-8",
                daysError || accessDenied ? "border-destructive" : "border-white/18",
                isShaking && "animate-shake"
              )}
            >
              <h2 className="font-heading text-lg font-semibold text-white">
                Build your trip
              </h2>
              <p className="mt-1 text-sm text-white/60">
                A few details, then the Trails agent takes it from here.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-white/70">
                  Days
                  <Select
                    value={days}
                    onValueChange={(value) => {
                      setDays(value)
                      setDaysError(false)
                      setAccessDenied(false)
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full bg-white/10 text-white [&_svg]:text-white/70",
                        daysError ? "border-destructive" : "border-white/20"
                      )}
                    >
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {daysError && (
                    <span className="text-[11px] font-normal text-destructive">
                      Number of days is required
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-white/70">
                  Travelers
                  <Select value={travelers} onValueChange={setTravelers}>
                    <SelectTrigger className="w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70">
                      <SelectValue placeholder="Select travelers" />
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

                <label className="col-span-2 flex flex-col gap-1.5 text-xs font-medium text-white/70">
                  Start date
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start border-white/20 bg-white/10 text-left font-normal text-white hover:bg-white/15 hover:text-white [&_svg]:text-white/70"
                      >
                        <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
                        {startDate
                          ? startDate.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date)
                          setDatePickerOpen(false)
                        }}
                        disabled={{ before: new Date() }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
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

      {/* Easter egg: spacebar x5 password prompt */}
      <Dialog open={showEasterEgg} onOpenChange={setShowEasterEgg}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Who goes there?</DialogTitle>
            <DialogDescription>
              Enter the password to unlock the test trip.
            </DialogDescription>
          </DialogHeader>

          <Input
            autoFocus
            type="password"
            value={eggPassword}
            onChange={(e) => {
              setEggPassword(e.target.value)
              setEggError(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEggSubmit()
            }}
            placeholder="Password"
            className={cn(eggError && "border-destructive")}
          />
          {eggError && (
            <p className="text-xs text-destructive">Wrong password. Try again.</p>
          )}
          <p className="text-xs text-muted-foreground">
            Hint: <Kbd>Space</Kbd> ×5 got you here — the answer is a Blake poem.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEasterEgg(false)}>
              Cancel
            </Button>
            <Button onClick={handleEggSubmit}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
