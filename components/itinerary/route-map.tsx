"use client"

import { useEffect, useState, useMemo } from "react"
import MapGL, { Marker, NavigationControl, Source, Layer } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { HugeiconsIcon } from "@hugeicons/react"
import { FlashIcon, Navigation03Icon } from "@hugeicons/core-free-icons"
import { ItineraryActivity } from "@/lib/itinerary-types"

interface RouteMapProps {
  activities: ItineraryActivity[]
  hoveredActivityId: string | null
  onHoverActivity: (id: string | null) => void
  selectedActivityId: string | null
  onSelectActivity: (id: string | null) => void
  timeSavedMinutes?: number
}

const lineLayer: any = {
  id: "route-line",
  type: "line",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#2563eb",
    "line-width": 3,
    "line-opacity": 0.85,
    "line-dasharray": [2, 2],
  },
}

const glowLayer: any = {
  id: "route-glow",
  type: "line",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#60a5fa",
    "line-width": 6,
    "line-opacity": 0.3,
  },
}

export function RouteMap({
  activities,
  hoveredActivityId,
  onHoverActivity,
  selectedActivityId,
  onSelectActivity,
  timeSavedMinutes = 45,
}: RouteMapProps) {
  const [viewState, setViewState] = useState({
    latitude: 6.45,
    longitude: 7.5,
    zoom: 11,
  })

  // GeoJSON LineString coordinates for routing
  const routeGeoJson = useMemo(() => {
    if (!activities || activities.length < 2) return null
    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: activities.map((a) => [a.location.longitude, a.location.latitude]),
      },
    }
  }, [activities])

  // Center on activities when they change
  useEffect(() => {
    if (activities && activities.length > 0) {
      const lats = activities.map((a) => a.location.latitude)
      const lngs = activities.map((a) => a.location.longitude)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      const centerLat = (minLat + maxLat) / 2
      const centerLng = (minLng + maxLng) / 2

      setViewState({
        latitude: centerLat,
        longitude: centerLng,
        zoom: 11.5,
      })
    }
  }, [activities])

  function handleMarkerClick(activityId: string) {
    onSelectActivity(activityId)
    const el = document.getElementById(`activity-card-${activityId}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY

  return (
    <div className="overflow-hidden rounded-sm border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-foreground text-base">Route Map</h3>
        </div>
        {timeSavedMinutes > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <HugeiconsIcon icon={FlashIcon} className="size-3" />
            <span>{timeSavedMinutes} min saved</span>
          </div>
        )}
      </div>

      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-muted">
        <MapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={mapToken}
          attributionControl={false}
        >
          <NavigationControl position="top-right" />

          {routeGeoJson && (
            <Source id="route-source" type="geojson" data={routeGeoJson}>
              <Layer {...glowLayer} />
              <Layer {...lineLayer} />
            </Source>
          )}

          {activities.map((act, idx) => {
            const isHovered = hoveredActivityId === act.id
            const isSelected = selectedActivityId === act.id

            return (
              <Marker
                key={act.id}
                longitude={act.location.longitude}
                latitude={act.location.latitude}
                anchor="center"
              >
                <div
                  onClick={() => handleMarkerClick(act.id)}
                  onMouseEnter={() => onHoverActivity(act.id)}
                  onMouseLeave={() => onHoverActivity(null)}
                  className={`flex size-6 cursor-pointer items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md transition-all duration-200 ${isSelected || isHovered
                      ? "scale-125 bg-blue-600 ring-4 ring-blue-500/30"
                      : "bg-blue-500 hover:scale-110 hover:bg-blue-600"
                    }`}
                  title={`${idx + 1}. ${act.title}`}
                >
                  {idx + 1}
                </div>
              </Marker>
            )
          })}
        </MapGL>

        {activities.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-sm border bg-background/90 px-2 py-1 text-[10px] font-mono text-muted-foreground shadow-sm backdrop-blur-sm">
            <HugeiconsIcon icon={Navigation03Icon} className="size-3 text-primary" />
            <span>
              {activities.length} stops · {viewState.latitude.toFixed(3)}°N, {viewState.longitude.toFixed(3)}°E
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

