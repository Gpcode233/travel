"use client"

import { useState, useEffect } from "react"
import { useKindeBrowserClient, LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Bookmark02Icon,
  UserIcon,
  Mail01Icon,
  SparklesIcon,
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
import { GeneratedItinerary } from "@/lib/itinerary-types"

interface SaveTripBannerProps {
  itinerary?: GeneratedItinerary | null
  onSave?: () => void
  isSaved?: boolean
}

export function SaveTripBanner({
  itinerary,
  onSave,
  isSaved = false,
}: SaveTripBannerProps) {
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient()
  const [saved, setSaved] = useState(isSaved)
  const [isSaving, setIsSaving] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Check if we have a pending save after auth redirect
  useEffect(() => {
    if (isAuthenticated && !saved && itinerary) {
      const pending = sessionStorage.getItem("trails_pending_save")
      if (pending === "true") {
        sessionStorage.removeItem("trails_pending_save")
        handleSaveToDb()
      }
    }
  }, [isAuthenticated, itinerary])

  async function handleSaveToDb() {
    if (!itinerary) {
      toast.error("No itinerary available to save.")
      return
    }

    try {
      setIsSaving(true)
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to save trip")
      }

      setSaved(true)
      toast.success("Trip saved successfully to your dossier!")
      onSave?.()
    } catch (err: any) {
      toast.error(err.message || "Failed to save trip. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  function handleSaveClick() {
    if (isLoading) return

    if (!isAuthenticated) {
      sessionStorage.setItem("trails_pending_save", "true")
      setShowAuthModal(true)
      return
    }

    handleSaveToDb()
  }

  return (
    <>
      <div className="sticky bottom-0 z-30 w-full border-t border-border/80 bg-background/95 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} className="size-4 text-blue-500 hidden sm:inline-block" />
            <p className="text-xs sm:text-sm font-medium text-foreground">
              Don&apos;t lose this itinerary. Save it to your dossier.
            </p>
          </div>

          <Button
            onClick={handleSaveClick}
            disabled={saved || isSaving}
            className="rounded-xs bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-90"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <Spinner className="size-3.5 border-white border-t-transparent" />
                Saving to Dossier...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                Saved to Dossier
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Bookmark02Icon} className="size-4" />
                Save Your Trip
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Authentication Modal Dialog */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
              <HugeiconsIcon icon={Bookmark02Icon} className="size-6" />
            </div>
            <DialogTitle className="text-center font-heading text-xl">
              Save Your Itinerary
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Sign in or create a free account to save your customized itinerary, view it anytime, and track your travel bookings.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-3">
            <LoginLink className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                Sign in with Email
              </Button>
            </LoginLink>

            <RegisterLink className="w-full">
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

