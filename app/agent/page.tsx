"use client"

import { Suspense, useEffect, useRef, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { nanoid } from "nanoid"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CompassIcon,
  SparklesIcon,
  ArrowReloadHorizontalIcon,
} from "@hugeicons/core-free-icons"

import {
  generateDynamicTripItinerary,
  removeActivityFromItinerary,
  updateAccommodationInItinerary,
  PLACE_COORDINATES,
} from "@/lib/itinerary-generator"
import {
  enuguAttractions,
  enuguRestaurants,
  enuguNightlife,
  type Place,
} from "@/lib/enugu-data"
import { budgetTiers, type BudgetTierValue } from "@/lib/budget-tiers"
import {
  ItineraryActivity,
  TripDossier,
  TripItinerary,
} from "@/lib/itinerary-types"
import { TripPlanningLoader } from "@/components/itinerary/trip-planning-loader"
import { TripHeader } from "@/components/itinerary/trip-header"
import { ItineraryTimeline } from "@/components/itinerary/itinerary-timeline"
import { RouteMap } from "@/components/itinerary/route-map"
import { EstBudgetBreakdownCard } from "@/components/itinerary/est-budget-breakdown"
import { WhereYoureStaying } from "@/components/itinerary/where-youre-staying"
import { AskTrailsAssistant } from "@/components/itinerary/ask-trails-assistant"
import { SaveTripBanner } from "@/components/itinerary/save-trip-banner"
import { PromoTicker } from "@/components/promo-ticker"
import { Button } from "@/components/ui/button"

type AgentPageState = "loading" | "workspace" | "empty" | "error"

function AgentWorkspaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { isAuthenticated } = useKindeBrowserClient()
  const [pageState, setPageState] = useState<AgentPageState>("loading")
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [requestedDossier, setRequestedDossier] = useState<Partial<TripDossier> | undefined>()
  const [activeDayNumber, setActiveDayNumber] = useState(1)
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const restoredRef = useRef(false)

  // Restore itinerary from sessionStorage after Kinde post-login redirect
  useEffect(() => {
    if (!isAuthenticated || restoredRef.current) return
    const stored = sessionStorage.getItem("trails_pending_itinerary")
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as TripItinerary
      sessionStorage.removeItem("trails_pending_itinerary")
      restoredRef.current = true
      setItinerary(parsed)
    } catch {}
  }, [isAuthenticated])

  // Initialize or re-generate itinerary based on query parameters
  useEffect(() => {
    const days = searchParams.get("days") || "3"
    const travelers = searchParams.get("travelers") || "2"
    const budget = searchParams.get("budget") || "mid-range"
    const pace = searchParams.get("pace") || "relaxed"
    const interests = searchParams.get("interests") || "Nature, Food, Culture"
    const destination = searchParams.get("destination") || "Enugu"

    setPageState("loading")
    setActiveDayNumber(1)

    // Show what was actually requested on the loading screen immediately,
    // instead of waiting for the itinerary (whose dossier wasn't ready yet,
    // so the loader was always falling back to its own hardcoded defaults).
    const budgetTier = (budget as BudgetTierValue) in budgetTiers ? (budget as BudgetTierValue) : "mid-range"
    setRequestedDossier({
      daysCount: Number(days) || 3,
      travelersCount: Number(travelers) || 2,
      budgetTierLabel: budgetTiers[budgetTier].label,
      pace: pace.charAt(0).toUpperCase() + pace.slice(1),
    })

    // Try AI-generated itinerary; fall back to static generator on failure
    fetch("/api/agent/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, travelers, budget, pace, interests, destination }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(({ itinerary }) => {
        setItinerary(itinerary)
      })
      .catch(() => {
        // Fallback to static generator
        const generated = generateDynamicTripItinerary({
          days, travelers, budget, pace, interests, destination,
        })
        setItinerary(generated)
      })
  }, [searchParams])

  function handleLoaderComplete() {
    setPageState("workspace")
  }

  function handleSelectAccommodation(accId: string) {
    if (!itinerary) return
    const updated = updateAccommodationInItinerary(itinerary, accId)
    setItinerary(updated)
  }

  function handleRemoveActivity(activityId: string) {
    if (!itinerary) return
    const updated = removeActivityFromItinerary(itinerary, activityId)
    setItinerary(updated)
  }

  function getReplacementPool(activity: ItineraryActivity): Place[] {
    const title = activity.title.toLowerCase()
    if (title.includes("lunch") || title.includes("dinner")) return enuguRestaurants
    if (activity.category === "nightlife") return enuguNightlife
    return enuguAttractions
  }

  function handleReplaceActivity(activity: ItineraryActivity) {
    if (!itinerary) return
    if (activity.title.toLowerCase().includes("breakfast")) return

    const pool = getReplacementPool(activity)
    const usedTitles = new Set(
      itinerary.days.flatMap((d) => d.activities.map((a) => a.title))
    )
    const candidates = pool.filter(
      (p) => p.name !== activity.title && !usedTitles.has(p.name)
    )
    const choices = candidates.length
      ? candidates
      : pool.filter((p) => p.name !== activity.title)
    if (choices.length === 0) return

    const place = choices[Math.floor(Math.random() * choices.length)]
    const coords = PLACE_COORDINATES[place.slug]

    const updatedDays = itinerary.days.map((day) => ({
      ...day,
      activities: day.activities.map((act) =>
        act.id === activity.id
          ? {
              ...act,
              title: place.name,
              description: place.description,
              tags: [place.kind],
              imageUrl: place.image,
              location: {
                name: place.name,
                area: place.area,
                latitude: coords?.lat ?? act.location.latitude,
                longitude: coords?.lng ?? act.location.longitude,
              },
            }
          : act
      ),
    }))

    setItinerary({
      ...itinerary,
      days: updatedDays,
    })
  }

  function handleUpdateDossier(updated: Partial<TripDossier>) {
    if (!itinerary) return
    const newDays = updated.daysCount ?? itinerary.dossier.daysCount
    const newTravelers = updated.travelersCount ?? itinerary.dossier.travelersCount
    const newBudget = updated.budgetTier ?? itinerary.dossier.budgetTier
    const newPace = updated.pace ?? itinerary.dossier.pace

    const regenerated = generateDynamicTripItinerary({
      days: newDays,
      travelers: newTravelers,
      budget: newBudget,
      pace: newPace,
      interests: itinerary.dossier.interests,
      destination: itinerary.dossier.destination,
    })
    setItinerary(regenerated)
    setActiveDayNumber(1)
  }

  async function handleApplyAiAction(actionType: string, promptText?: string) {
    if (!itinerary) return

    // Simulate agent intelligence updates dynamically
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (actionType === "relax") {
      // Remove an activity from active day to space it out
      const currentDay = itinerary.days.find((d) => d.dayNumber === activeDayNumber)
      if (currentDay && currentDay.activities.length > 2) {
        const lastAct = currentDay.activities[currentDay.activities.length - 1]
        handleRemoveActivity(lastAct.id)
      }
    } else if (actionType === "cheaper-hotel") {
      const budgetAcc = itinerary.accommodations.find(
        (a) => a.id !== itinerary.selectedAccommodationId
      )
      if (budgetAcc) {
        handleSelectAccommodation(budgetAcc.id)
      }
    } else if (actionType === "more-food") {
      // Add a food stop to current day
      const foodStop: ItineraryActivity = {
        id: `act-add-${Date.now()}`,
        title: "Evening Street Suya & Drinks",
        description: "Taste authentic spicy charcoal grilled beef suya with seasoned onions and chilled local drinks.",
        startTime: "8:30 PM",
        durationMinutes: 60,
        durationLabel: "1 hr",
        estimatedCost: 5_000,
        formattedCost: "₦5,000",
        category: "food",
        tags: ["Food", "Nightlife"],
        imageUrl: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",
        location: {
          name: "Independence Layout Suya Spot",
          area: "Independence Layout",
          latitude: 6.435,
          longitude: 7.535,
        },
      }

      const updatedDays = itinerary.days.map((day) =>
        day.dayNumber === activeDayNumber
          ? { ...day, activities: [...day.activities, foodStop] }
          : day
      )
      setItinerary({
        ...itinerary,
        days: updatedDays,
      })
    } else if (actionType === "under-budget") {
      // Switch to cheaper hotel
      const cheaper = [...itinerary.accommodations].sort(
        (a, b) => a.pricePerNight - b.pricePerNight
      )[0]
      if (cheaper) {
        handleSelectAccommodation(cheaper.id)
      }
    } else if (actionType === "add-day") {
      handleUpdateDossier({ daysCount: itinerary.dossier.daysCount + 1 })
    }
  }

  // 1. Loading State: High-fidelity AI Planning Screen
  if (pageState === "loading") {
    return (
      <TripPlanningLoader
        dossier={itinerary?.dossier ?? requestedDossier}
        onComplete={handleLoaderComplete}
        isReady={itinerary !== null}
      />
    )
  }

  // 2. Empty or Error State Fallback
  if (!itinerary || pageState === "empty" || pageState === "error") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
        <HugeiconsIcon
          icon={CompassIcon}
          className="size-12 text-muted-foreground mb-4"
        />
        <h2 className="text-2xl font-heading font-bold">No Itinerary Found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t load an itinerary for these preferences. Let&apos;s build a new trip.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Plan a New Trip
        </Button>
      </div>
    )
  }

  const activeDay =
    itinerary.days.find((d) => d.dayNumber === activeDayNumber) || itinerary.days[0]

  // Build route activities: hotel → day stops → hotel (round-trip route)
  const selectedHotel = itinerary.accommodations.find(
    (a) => a.id === itinerary.selectedAccommodationId
  ) ?? itinerary.accommodations[0]

  const hotelCoords = selectedHotel?.slug
    ? PLACE_COORDINATES[selectedHotel.slug]
    : null

  const hotelStop: ItineraryActivity | null = hotelCoords
    ? {
        id: "hotel-base",
        title: selectedHotel.name,
        description: "Your hotel base",
        startTime: "8:00 AM",
        durationMinutes: 0,
        estimatedCost: 0,
        formattedCost: "",
        category: "hotel",
        tags: ["Hotel"],
        imageUrl: selectedHotel.imageUrl,
        location: {
          name: selectedHotel.name,
          area: selectedHotel.area,
          latitude: hotelCoords.lat,
          longitude: hotelCoords.lng,
        },
      }
    : null

  const routeActivities: ItineraryActivity[] = hotelStop
    ? [hotelStop, ...activeDay.activities, hotelStop]
    : activeDay.activities

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      <PromoTicker variant="light" />
      {/* Top Dossier Bar & Hero Section */}
      <TripHeader
        dossier={itinerary.dossier}
        estimatedCostRange={itinerary.budgetBreakdown.formattedRange}
        onUpdateDossier={handleUpdateDossier}
      />

      {/* Main Itinerary Workspace Body matching reference design */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* Left Column: Interactive Timeline */}
          <div className="min-w-0">
            <ItineraryTimeline
              days={itinerary.days}
              activeDayNumber={activeDayNumber}
              onSelectDay={setActiveDayNumber}
              hoveredActivityId={hoveredActivityId}
              onHoverActivity={setHoveredActivityId}
              selectedActivityId={selectedActivityId}
              onSelectActivity={setSelectedActivityId}
              onRemoveActivity={handleRemoveActivity}
              onReplaceActivity={handleReplaceActivity}
            />
          </div>

          {/* Right Column: Dynamic Route Map & Est. Budget Breakdown */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <RouteMap
              activities={routeActivities}
              hoveredActivityId={hoveredActivityId}
              onHoverActivity={setHoveredActivityId}
              selectedActivityId={selectedActivityId}
              onSelectActivity={setSelectedActivityId}
              timeSavedMinutes={itinerary.totalTravelTimeMinutesSaved}
            />

            <EstBudgetBreakdownCard
              breakdown={itinerary.budgetBreakdown}
            />
          </div>
        </div>

        {/* Accommodation Section: "Where you're staying" */}
        <WhereYoureStaying
          accommodations={itinerary.accommodations}
          selectedAccommodationId={itinerary.selectedAccommodationId}
          onSelectAccommodation={handleSelectAccommodation}
        />
      </main>

      {/* Floating Ask Trails AI Assistant Layer */}
      <AskTrailsAssistant onApplyAction={handleApplyAiAction} />

      {/* Sticky Save Trip Banner */}
      <SaveTripBanner itinerary={itinerary} />
    </div>
  )
}

export default function AgentPage() {
  return (
    <Suspense fallback={null}>
      <AgentWorkspaceContent />
    </Suspense>
  )
}
