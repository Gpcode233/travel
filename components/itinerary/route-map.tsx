"use client"

import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Location03Icon,
  Navigation03Icon,
  PlusSignIcon,
  MinusSignIcon,
  Maximize02Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons"
import { ItineraryActivity } from "@/lib/itinerary-types"
import { Button } from "@/components/ui/button"

interface RouteMapProps {
  activities: ItineraryActivity[]
  hoveredActivityId: string | null
  onHoverActivity: (id: string | null) => void
  selectedActivityId: string | null
  onSelectActivity: (id: string | null) => void
  timeSavedMinutes?: number
}

export function RouteMap({
  activities,
  hoveredActivityId,
  onHoverActivity,
  selectedActivityId,
  onSelectActivity,
  timeSavedMinutes = 45,
}: RouteMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  // Calculate bounding box and projection points from real coordinates
  const { points, centerLat, centerLng } = useMemo(() => {
    if (!activities.length) {
      return { points: [], centerLat: 6.45, centerLng: 7.5 }
    }

    const lats = activities.map((a) => a.location.latitude)
    const lngs = activities.map((a) => a.location.longitude)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const cLat = (minLat + maxLat) / 2
    const cLng = (minLng + maxLng) / 2

    const latSpan = Math.max(0.04, maxLat - minLat)
    const lngSpan = Math.max(0.04, maxLng - minLng)

    // Map into SVG viewBox 0 0 500 320 with margin padding
    const padding = 50
    const width = 500 - padding * 2
    const height = 320 - padding * 2

    const mapped = activities.map((activity, idx) => {
      // Longitude -> X (left to right)
      // Latitude -> Y (top to bottom inverted)
      const normalizedX = (activity.location.longitude - minLng) / lngSpan
      const normalizedY = 1 - (activity.location.latitude - minLat) / latSpan

      const x = padding + normalizedX * width
      const y = padding + normalizedY * height

      return {
        id: activity.id,
        index: idx + 1,
        title: activity.title,
        locationName: activity.location.name,
        x,
        y,
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
      }
    })

    return { points: mapped, centerLat: cLat, centerLng: cLng }
  }, [activities])

  // Build SVG path string for route
  const pathD = useMemo(() => {
    if (points.length < 2) return ""
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`
      // Add slight curved routing bezier
      const prev = points[i - 1]
      const mx = (prev.x + pt.x) / 2
      const my = (prev.y + pt.y) / 2
      return `${acc} Q ${mx} ${my - 8}, ${pt.x} ${pt.y}`
    }, "")
  }, [points])

  function handleMarkerClick(activityId: string) {
    onSelectActivity(activityId)
    const el = document.getElementById(`activity-card-${activityId}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border bg-card text-card-foreground shadow-sm">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-foreground text-base">
            Route Map
          </h3>
        </div>

        {timeSavedMinutes > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <HugeiconsIcon icon={FlashIcon} className="size-3" />
            <span>{timeSavedMinutes} min saved</span>
          </div>
        )}
      </div>

      {/* Interactive Map Surface */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#eef3f7] dark:bg-[#111927]">
        {/* Map Grid / Street Network simulation pattern */}
        <svg
          className="absolute inset-0 size-full stroke-muted-foreground/15"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="street-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
              />
            </pattern>
            {/* Radial street lines mimicking Enugu layout */}
            <radialGradient id="map-radial" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#street-grid)" />
          <rect width="100%" height="100%" fill="url(#map-radial)" />

          {/* Road Arterials */}
          <line
            x1="0"
            y1="160"
            x2="500"
            y2="160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <line
            x1="250"
            y1="0"
            x2="250"
            y2="320"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <circle
            cx="250"
            cy="160"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="250"
            cy="160"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        {/* Dynamic Route Waypoints & Polyline */}
        <svg
          viewBox="0 0 500 320"
          className="relative z-10 size-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connecting Trail Line */}
          {pathD && (
            <>
              {/* Outer glow stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeOpacity="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core route stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </>
          )}

          {/* Location Pins */}
          {points.map((pt) => {
            const isHovered = hoveredActivityId === pt.id
            const isSelected = selectedActivityId === pt.id

            return (
              <g
                key={pt.id}
                transform={`translate(${pt.x}, ${pt.y})`}
                onClick={() => handleMarkerClick(pt.id)}
                onMouseEnter={() => onHoverActivity(pt.id)}
                onMouseLeave={() => onHoverActivity(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Active pulse ring */}
                {(isSelected || isHovered) && (
                  <circle
                    r="18"
                    className="animate-ping fill-blue-500/30"
                  />
                )}

                {/* Outer pin background */}
                <circle
                  r={isSelected || isHovered ? 13 : 11}
                  className={`transition-all duration-200 ${
                    isSelected || isHovered
                      ? "fill-blue-600 stroke-white stroke-2 shadow-lg"
                      : "fill-blue-500 stroke-white stroke-2"
                  }`}
                />

                {/* Pin Number */}
                <text
                  textAnchor="middle"
                  dy="3.5"
                  className="fill-white font-bold text-[11px] select-none"
                >
                  {pt.index}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Map Floating Info Badge on bottom left */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-sm border bg-background/90 px-2 py-1 text-[10px] font-mono text-muted-foreground shadow-sm backdrop-blur-sm">
          <HugeiconsIcon icon={Navigation03Icon} className="size-3 text-primary" />
          <span>
            {points.length} stops · {centerLat.toFixed(3)}°N, {centerLng.toFixed(3)}°E
          </span>
        </div>

        {/* Zoom Controls on bottom right */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
            className="flex size-6 items-center justify-center rounded-xs border bg-background text-foreground shadow-sm hover:bg-muted"
            title="Zoom in"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
            className="flex size-6 items-center justify-center rounded-xs border bg-background text-foreground shadow-sm hover:bg-muted"
            title="Zoom out"
          >
            <HugeiconsIcon icon={MinusSignIcon} className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
