"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useKindeBrowserClient, LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Bookmark02Icon,
  UserIcon,
  Mail01Icon,
  SparklesIcon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { TripItinerary } from "@/lib/itinerary-types"

interface SaveTripBannerProps {
  itinerary?: TripItinerary | null
  onSave?: () => void
  isSaved?: boolean
  savedTripId?: string | null
}

export function SaveTripBanner({
  itinerary,
  onSave,
  isSaved = false,
  savedTripId,
}: SaveTripBannerProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const [saved, setSaved] = useState(isSaved)
  const [tripId, setTripId] = useState<string | null>(savedTripId ?? null)
  const [isSaving, setIsSaving] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<"save" | "book" | null>(null)

  useEffect(() => {
    if (isAuthenticated && itinerary) {
      const pending = sessionStorage.getItem("trails_pending_action")
      if (pending === "save" || pending === "book") {
        sessionStorage.removeItem("trails_pending_action")
        if (pending === "save") handleSaveToDb()
        else handleBookNow()
      }
    }
  }, [isAuthenticated, itinerary])

  async function handleSaveToDb(): Promise<string | null> {
    if (!itinerary) {
      toast.error("No itinerary available to save.")
      return null
    }
    try {
      setIsSaving(true)
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save trip")
      setSaved(true)
      setTripId(data.trip.id)
      toast.success("Trip saved to your dossier!")
      onSave?.()
      return data.trip.id
    } catch (err: any) {
      toast.error(err.message || "Failed to save trip. Please try again.")
      return null
    } finally {
      setIsSaving(false)
    }
  }

  async function handleBookNow() {
    if (!itinerary) return

    const selectedHotel = itinerary.accommodations.find(
      (a) => a.id === itinerary.selectedAccommodationId
    )
    if (!selectedHotel) {
      toast.error("Please select a hotel before booking.")
      return
    }

    const nights = itinerary.dossier.daysCount
    const accommodationTotal = selectedHotel.pricePerNight * nights

    // Save trip first if not already saved
    let resolvedTripId = tripId
    if (!saved) {
      resolvedTripId = await handleSaveToDb()
    }

    const breakdown = itinerary.budgetBreakdown
    const budgetBreakdown = {
      food: breakdown.categories.find((c) => c.key === "food")?.amount,
      transport: breakdown.categories.find((c) => c.key === "transport")?.amount,
      activities: breakdown.categories.find((c) => c.key === "activities")?.amount,
    }

    sessionStorage.setItem(
      "trails_checkout",
      JSON.stringify({
        tripId: resolvedTripId,
        hotelName: selectedHotel.name,
        hotelArea: selectedHotel.area,
        nights,
        pricePerNight: selectedHotel.pricePerNight,
        accommodationTotal,
        budgetBreakdown,
        dossier: {
          destination: itinerary.dossier.destination,
          travelersLabel: itinerary.dossier.travelersLabel,
          dateRangeLabel: itinerary.dossier.dateRangeLabel,
          daysCount: itinerary.dossier.daysCount,
        },
      })
    )

    router.push("/checkout")
  }

  function openAuthModal(action: "save" | "book") {
    sessionStorage.setItem("trails_pending_action", action)
    if (itinerary) {
      sessionStorage.setItem("trails_pending_itinerary", JSON.stringify(itinerary))
    }
    setShowAuthModal(true)
  }

  function handleSaveClick() {
    if (isLoading) return
    if (!isAuthenticated) { openAuthModal("save"); return }
    handleSaveToDb()
  }

  function handleBookClick() {
    if (isLoading) return
    if (!isAuthenticated) { openAuthModal("book"); return }
    handleBookNow()
  }

  const postLoginUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <>
      <div className="sticky bottom-0 z-30 w-full border-t border-border/80 bg-background/95 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary hidden sm:inline-block" />
            <p className="text-xs sm:text-sm font-medium text-foreground">
              {saved ? "Saved to dossier · Ready to book" : "Ready to book? Save and reserve your hotel."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSaveClick}
              disabled={saved || isSaving}
              className="rounded-xs px-4 py-2 text-xs font-semibold"
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <Spinner className="size-3.5" />
                  Saving...
                </span>
              ) : saved ? (
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-green-500" />
                  Saved
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Bookmark02Icon} className="size-4" />
                  Save trip
                </span>
              )}
            </Button>

            <Button
              onClick={handleBookClick}
              className="rounded-xs bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={ShoppingCart01Icon} className="size-4" />
                Book your trip
              </span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon icon={Bookmark02Icon} className="size-6" />
            </div>
            <DialogTitle className="text-center font-heading text-xl">
              Sign in to continue
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Sign in or create a free account to save your itinerary and complete your booking.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-3">
            <LoginLink className="w-full" postLoginRedirectURL={postLoginUrl}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                Sign in with Email
              </Button>
            </LoginLink>
            <RegisterLink className="w-full" postLoginRedirectURL={postLoginUrl}>
              <Button variant="outline" className="w-full font-medium flex items-center justify-center gap-2">
                <HugeiconsIcon icon={UserIcon} className="size-4" />
                Create New Account
              </Button>
            </RegisterLink>
          </div>

          <div className="mt-2 text-center text-xs text-muted-foreground">
            No credit card or complex setup required.
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
