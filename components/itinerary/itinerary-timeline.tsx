"use client"

import { useState } from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SpoonAndForkIcon,
  Tree01Icon,
  MountainIcon,
  CompassIcon,
  Delete02Icon,
  Location03Icon,
  CompassIcon,
  Clock01Icon,
  Exchange01Icon,
  BedIcon,
} from "@hugeicons/core-free-icons"
import { ItineraryActivity, ItineraryDay } from "@/lib/itinerary-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ItineraryTimelineProps {
  days: ItineraryDay[]
  activeDayNumber: number
  onSelectDay: (dayNumber: number) => void
  hoveredActivityId: string | null
  onHoverActivity: (id: string | null) => void
  selectedActivityId: string | null
  onSelectActivity: (id: string | null) => void
  onRemoveActivity?: (activityId: string) => void
  onReplaceActivity?: (activity: ItineraryActivity) => void
}

function isBreakfast(activity: ItineraryActivity) {
  return activity.title.toLowerCase().includes("breakfast")
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "food":
      return SpoonAndForkIcon
    case "nature":
      return Tree01Icon
    case "adventure":
      return MountainIcon
    case "hotel":
      return BedIcon
    default:
      return CompassIcon
  }
}

export function ItineraryTimeline({
  days,
  activeDayNumber,
  onSelectDay,
  hoveredActivityId,
  onHoverActivity,
  selectedActivityId,
  onSelectActivity,
  onRemoveActivity,
  onReplaceActivity,
}: ItineraryTimelineProps) {
  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0]

  if (!currentDay) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No itinerary activities found for this day.
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Day Selector Navigation */}
      {days.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = day.dayNumber === activeDayNumber
            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`flex shrink-0 items-center gap-2 rounded-sm border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>Day {day.dayNumber}</span>
                <span className="opacity-70 text-[11px]">({day.dateLabel})</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Active Day Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">
          {currentDay.title}
        </h2>
        {currentDay.summary && (
          <p className="mt-1 text-sm text-muted-foreground">
            {currentDay.summary}
          </p>
        )}
      </div>

      {/* Continuous Timeline Trail */}
      <div className="relative pt-2">
        {currentDay.activities.map((activity, index) => {
          const isHovered = hoveredActivityId === activity.id
          const isSelected = selectedActivityId === activity.id
          const isLast = index === currentDay.activities.length - 1
          const Icon = getCategoryIcon(activity.category)
          const stepNumber = index + 1

          return (
            <div
              key={activity.id}
              id={`activity-card-${activity.id}`}
              onMouseEnter={() => onHoverActivity(activity.id)}
              onMouseLeave={() => onHoverActivity(null)}
              onClick={() => onSelectActivity(activity.id)}
              className="relative flex gap-4 pb-8 sm:gap-6 last:pb-2"
            >
              {/* Left Trail Line with concentric node marker matching design */}
              <div className="flex flex-col items-center">
                {/* Node Ring */}
                <div
                  className={`relative z-10 flex size-5.5 items-center justify-center rounded-full border-2 transition-transform duration-200 ${
                    isSelected || isHovered
                      ? "border-primary bg-primary text-white scale-110 shadow-md"
                      : "border-primary/80 bg-background text-primary"
                  }`}
                >
                  <div className="size-2 rounded-full bg-primary" />
                </div>

                {/* Vertical connecting line */}
                {!isLast && (
                  <div className="relative my-1 w-0.5 flex-1 bg-border/80">
                    {activity.travelFromPreviousMinutes ? (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-mono text-muted-foreground">
                        {/* Connecting travel time indicator */}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Activity Card Body */}
              <div
                className={`flex-1 overflow-hidden rounded-sm border bg-card transition-all duration-200 ${
                  isSelected
                    ? "border-primary ring-1 ring-primary shadow-sm"
                    : isHovered
                    ? "border-primary/50 shadow-sm"
                    : "border-border/80"
                }`}
              >
                {/* Card Top Header */}
                <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-medium text-foreground">
                      {activity.startTime}
                      {activity.endTime ? ` — ${activity.endTime}` : ""}
                    </span>

                    <span className="text-muted-foreground/50">|</span>

                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <HugeiconsIcon icon={Icon} className="size-3.5 text-primary" />
                      <span className="text-sm font-semibold">{activity.title}</span>
                    </div>

                    {activity.durationLabel && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                        <span>{activity.durationLabel}</span>
                      </div>
                    )}
                  </div>

                  <span className="font-mono text-xs font-semibold text-foreground">
                    {activity.formattedCost || `₦${activity.estimatedCost.toLocaleString()}`}
                  </span>
                </div>

                {/* Card Content: Media + Text */}
                <div className="p-4">
                  {/* Photo Display */}
                  {activity.imageUrl && (
                    <div className="relative mb-3.5 h-44 sm:h-52 w-full overflow-hidden rounded-xs border bg-muted">
                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {activity.description}
                  </p>

                  {/* Bottom Bar: Tags + Actions */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-xs border border-border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}

                      {/* Replace Link / Action — not available for breakfast */}
                      {!isBreakfast(activity) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onReplaceActivity?.(activity)
                          }}
                          className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <HugeiconsIcon icon={CompassIcon} className="size-3" />
                          + Replace
                        </button>
                      )}
                    </div>

                    {/* Quick Tool Buttons: Map Focus & Remove */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectActivity(activity.id)
                        }}
                        title="Locate on map"
                        className="size-7 rounded-xs border border-border text-muted-foreground hover:text-foreground"
                      >
                        <HugeiconsIcon icon={Location03Icon} className="size-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveActivity?.(activity.id)
                        }}
                        title="Remove activity"
                        className="size-7 rounded-xs border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40"
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
