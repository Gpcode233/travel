"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { BedIcon, CheckmarkCircle02Icon, StarIcon } from "@hugeicons/core-free-icons"
import { AccommodationOption } from "@/lib/itinerary-types"
import { Button } from "@/components/ui/button"

interface WhereYoureStayingProps {
  accommodations: AccommodationOption[]
  selectedAccommodationId: string
  onSelectAccommodation: (id: string) => void
}

export function WhereYoureStaying({
  accommodations,
  selectedAccommodationId,
  onSelectAccommodation,
}: WhereYoureStayingProps) {
  return (
    <section className="w-full pt-8 pb-12">
      <div className="border-b pb-3 mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Where you&apos;re staying
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accommodations.map((hotel) => {
          const isSelected = hotel.id === selectedAccommodationId

          return (
            <div
              key={hotel.id}
              className={`group flex flex-col overflow-hidden rounded-sm border bg-card text-card-foreground transition-all duration-200 ${
                isSelected
                  ? "border-primary ring-1 ring-primary shadow-md"
                  : "border-border/80 hover:border-primary/50 shadow-sm"
              }`}
            >
              {/* Hotel Photo & Badges */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-muted">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge (BEST MATCH / ALTERNATIVE) on top left */}
                {hotel.badge && (
                  <div
                    className={`absolute top-2.5 left-2.5 rounded-xs px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                      hotel.badge === "BEST MATCH"
                        ? "bg-blue-600"
                        : "bg-black/65 backdrop-blur-sm"
                    }`}
                  >
                    {hotel.badge}
                  </div>
                )}

                {/* Price per night on top right */}
                <div className="absolute top-2.5 right-2.5 rounded-xs bg-black/75 px-2 py-0.5 text-[11px] font-mono font-medium text-white shadow-sm backdrop-blur-sm">
                  {hotel.formattedPrice}
                </div>
              </div>

              {/* Hotel Body */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-foreground text-lg">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                      <HugeiconsIcon icon={StarIcon} className="size-3.5 fill-amber-500 text-amber-500" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {hotel.area}
                  </p>

                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground/90">
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-xs border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Select / Book CTA Button */}
                <div className="mt-5 pt-3 border-t">
                  <Button
                    onClick={() => onSelectAccommodation(hotel.id)}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full rounded-xs text-xs font-semibold ${
                      isSelected
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-border hover:bg-muted text-foreground"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
