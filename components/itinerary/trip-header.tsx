"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit02Icon,
  CompassIcon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { TripDossier } from "@/lib/itinerary-types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TripHeaderProps {
  dossier: TripDossier
  estimatedCostRange: string
  onUpdateDossier?: (updated: Partial<TripDossier>) => void
}

export function TripHeader({
  dossier,
  estimatedCostRange,
  onUpdateDossier,
}: TripHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editDays, setEditDays] = useState(String(dossier.daysCount))
  const [editTravelers, setEditTravelers] = useState(String(dossier.travelersCount))
  const [editBudget, setEditBudget] = useState(dossier.budgetTier)
  const [editPace, setEditPace] = useState(dossier.pace.toLowerCase())

  function handleSaveEdit() {
    onUpdateDossier?.({
      daysCount: Number(editDays),
      travelersCount: Number(editTravelers),
      budgetTier: editBudget as any,
      pace: editPace.charAt(0).toUpperCase() + editPace.slice(1),
    })
    setIsEditDialogOpen(false)
  }

  return (
    <header className="w-full bg-background text-foreground">
      {/* Top Main Navigation Bar matching reference image */}
      <div className="border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-heading font-bold text-primary tracking-tight"
            >
              <HugeiconsIcon icon={CompassIcon} className="size-5" />
              Trails
            </Link>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link
                href="/explore"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Explore
              </Link>
              <Link
                href="/agent"
                className="font-medium text-foreground underline underline-offset-4 decoration-primary"
              >
                My Trips
              </Link>
              <Link
                href="/explore"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Saved
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground" asChild>
              <Link href="/explore">
                <HugeiconsIcon icon={Search01Icon} className="size-4.5" />
              </Link>
            </Button>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon icon={UserIcon} className="size-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-bar: Trip Dossier Meta */}
      <div className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              TRIP DOSSIER
            </span>
            <span className="font-medium text-foreground">
              {dossier.destination}, {dossier.destinationCountry}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {dossier.dateRangeLabel}
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">
              {dossier.daysCount} Days
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {dossier.travelersLabel}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {dossier.budgetTierLabel}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{dossier.pace}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="h-8 gap-1.5 rounded-sm border-border bg-background text-xs font-medium hover:bg-muted"
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-3.5" />
            Edit trip
          </Button>
        </div>
      </div>

      {/* Hero Destination Banner matching reference image 2 */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[220px] sm:min-h-[260px] w-full overflow-hidden rounded-sm border bg-black shadow-lg">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(8,12,18,.92) 0%, rgba(8,12,18,.65) 50%, rgba(8,12,18,.35) 100%), url(${dossier.heroImageUrl})`,
            }}
          />
          <div className="relative z-10 flex h-full min-h-[220px] sm:min-h-[260px] flex-col justify-end p-6 sm:p-10 text-white">
            <h1 className="text-3xl font-heading font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {dossier.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-xs bg-blue-600 px-2 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase">
                EST. COST
              </span>
              <span className="text-lg font-heading font-semibold text-white sm:text-2xl">
                {estimatedCostRange}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trip Preferences</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-xs font-medium">
                Duration (Days)
                <Select value={editDays} onValueChange={setEditDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="2">2 Days</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="4">4 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-xs font-medium">
                Travelers
                <Select value={editTravelers} onValueChange={setEditTravelers}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Traveler</SelectItem>
                    <SelectItem value="2">2 Travelers</SelectItem>
                    <SelectItem value="3">3 Travelers</SelectItem>
                    <SelectItem value="4">4 Travelers</SelectItem>
                    <SelectItem value="6">6 Travelers</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-xs font-medium">
                Budget Tier
                <Select value={editBudget} onValueChange={(val) => setEditBudget(val as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lean">Lean</SelectItem>
                    <SelectItem value="mid-range">Mid-range</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-xs font-medium">
                Pace
                <Select value={editPace} onValueChange={setEditPace}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="fast">Fast-paced</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Update Itinerary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
