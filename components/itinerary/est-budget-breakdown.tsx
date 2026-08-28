"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  BedIcon,
  SpoonAndForkIcon,
  Car01Icon,
  Ticket01Icon,
  Coins01Icon,
} from "@hugeicons/core-free-icons"
import { EstBudgetBreakdown } from "@/lib/itinerary-types"

interface EstBudgetBreakdownProps {
  breakdown: EstBudgetBreakdown
}

function getCategoryIcon(key: string) {
  switch (key) {
    case "accommodation":
      return BedIcon
    case "food":
      return SpoonAndForkIcon
    case "transport":
      return Car01Icon
    case "activities":
      return Ticket01Icon
    default:
      return Coins01Icon
  }
}

export function EstBudgetBreakdownCard({ breakdown }: EstBudgetBreakdownProps) {
  return (
    <div className="overflow-hidden rounded-sm border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h3 className="font-heading font-bold text-foreground text-base">
          Est. Budget Breakdown
        </h3>
      </div>

      {/* Category List */}
      <div className="divide-y divide-border/60 px-4 py-2">
        {breakdown.categories.map((category) => {
          const Icon = getCategoryIcon(category.key)
          return (
            <div
              key={category.key}
              className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <HugeiconsIcon icon={Icon} className="size-4 text-foreground/70" />
                <span>{category.label}</span>
              </div>
              <span className="font-mono font-medium text-foreground">
                {category.formattedAmount}
              </span>
            </div>
          )
        })}
      </div>

      {/* Total Section matching reference image 2 */}
      <div className="border-t bg-muted/20 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-foreground text-base sm:text-lg">
            Total
          </span>
          <span className="font-heading font-bold text-blue-600 text-lg sm:text-xl tracking-tight">
            {breakdown.formattedTotal}
          </span>
        </div>
      </div>
    </div>
  )
}
