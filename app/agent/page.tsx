"use client"

import { Suspense, useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { nanoid } from "nanoid"
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
} from "@/lib/itinerary-generator"
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
import { Button } from "@/components/ui/button"

type AgentPageState = "loading" | "workspace" | "empty" | "error"

function AgentWorkspaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [pageState, setPageState] = useState<AgentPageState>("loading")
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [activeDayNumber, setActiveDayNumber] = useState(1)
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Initialize or re-generate itinerary based on query parameters
  useEffect(() => {
    const days = searchParams.get("days") || "3"
    const travelers = searchParams.get("travelers") || "2"
    const budget = searchParams.get("budget") || "mid-range"
    const pace = searchParams.get("pace") || "relaxed"
    const interests = searchParams.get("interests") || "Nature, Food, Culture"
    const destination = searchParams.get("destination") || "Enugu"

    const generated = generateDynamicTripItinerary({
      days,
      travelers,
      budget,
      pace,
      interests,
      destination,
    })

    setItinerary(generated)
    setActiveDayNumber(1)
    setPageState("loading")
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

  function handleReplaceActivity(activity: ItineraryActivity) {
    if (!itinerary) return
    // Swap with an alternative curated activity for this slot
    const alternatives = [
      {
        title: "Artisan Coffee & Palm Wine Tasting",
        description: "Relaxed morning tasting featuring single-origin Nigerian brews and fresh sweet palm wine.",
        estimatedCost: 7_500,
        formattedCost: "₦7,500",
        category: "food" as const,
        tags: ["Food", "Local Culture"],
        imageUrl: "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "Ezeagu Botanical Spring Walk",
        description: "Gentle natural trail meandering alongside pristine spring waterways with tropical greenery.",
        estimatedCost: 6_000,
        formattedCost: "₦6,000",
        category: "nature" as const,
        tags: ["Nature", "Scenic"],
        imageUrl: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ]
    const replacement =
      alternatives.find((alt) => alt.title !== activity.title) || alternatives[0]

    const updatedDays = itinerary.days.map((day) => ({
      ...day,
      activities: day.activities.map((act) =>
        act.id === activity.id
          ? {
              ...act,
              title: replacement.title,
              description: replacement.description,
              estimatedCost: replacement.estimatedCost,
              formattedCost: replacement.formattedCost,
              tags: replacement.tags,
              imageUrl: replacement.imageUrl,
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
        dossier={itinerary?.dossier}
        onComplete={handleLoaderComplete}
        estimatedDurationSeconds={15}
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

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
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
              activities={activeDay.activities}
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
