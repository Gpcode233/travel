"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { AirplaneTakeOff01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const messages = [
  "Complimentary airport pickup to your hotel with every confirmed booking",
  "Book your Enugu trip today — airport transfer included at no extra cost",
  "Free airport-to-hotel transfer when you book through Trails",
  "Every booking includes a free airport pickup · Hassle-free arrival in Enugu",
]

interface PromoTickerProps {
  variant?: "dark" | "light" | "orange"
  className?: string
}

export function PromoTicker({ variant = "light", className }: PromoTickerProps) {
  const dark = variant === "dark"
  const orange = variant === "orange"

  return (
    <div
      className={cn(
        "w-full overflow-hidden py-2.5",
        orange
          ? "bg-primary"
          : dark
          ? "border-y border-white/15 bg-white/8"
          : "border-y border-border bg-muted/60",
        className
      )}
    >
      <div className="flex animate-marquee items-center gap-0 whitespace-nowrap">
        {[...messages, ...messages].map((msg, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex items-center gap-2 px-8 text-xs font-medium",
              orange ? "text-primary-foreground" : dark ? "text-white/80" : "text-foreground/70"
            )}
          >
            <HugeiconsIcon
              icon={AirplaneTakeOff01Icon}
              className={cn(
                "size-3.5 shrink-0",
                orange ? "text-primary-foreground/80" : dark ? "text-white/50" : "text-muted-foreground"
              )}
            />
            {msg}
            <span className={cn("mx-2", orange ? "text-primary-foreground/40" : dark ? "text-white/25" : "text-border")}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
