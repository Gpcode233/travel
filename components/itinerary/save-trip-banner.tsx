"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, Bookmark02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface SaveTripBannerProps {
  onSave?: () => void
  isSaved?: boolean
}

export function SaveTripBanner({ onSave, isSaved = false }: SaveTripBannerProps) {
  const [saved, setSaved] = useState(isSaved)

  function handleSave() {
    setSaved(true)
    onSave?.()
  }

  return (
    <div className="sticky bottom-0 z-30 w-full border-t border-border/80 bg-background/95 py-3.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="text-xs sm:text-sm font-medium text-foreground">
          Don&apos;t lose this itinerary. Save it to your dossier.
        </p>

        <Button
          onClick={handleSave}
          disabled={saved}
          className="rounded-xs bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-90"
        >
          {saved ? (
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
  )
}
