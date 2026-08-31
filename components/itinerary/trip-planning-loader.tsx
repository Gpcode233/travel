"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons"
import { PlanningStep, TripDossier } from "@/lib/itinerary-types"

interface TripPlanningLoaderProps {
  dossier?: Partial<TripDossier>
  steps?: PlanningStep[]
  onComplete?: () => void
  isReady?: boolean
}

const DEFAULT_STEPS = [
  "Understanding your travel preferences",
  "Finding suitable places to stay",
  "Comparing accommodation options",
  "Finding attractions that match your interests",
  "Checking opening hours and availability",
  "Optimizing travel distances",
  "Balancing your daily schedule",
  "Calculating your estimated trip cost",
  "Building your final route",
]

const MAX_DURATION_MS = 16_000
const FAST_INTERVAL = 280
const HOLD_AT_STEP = DEFAULT_STEPS.length - 2
const SLOW_INTERVAL = MAX_DURATION_MS / HOLD_AT_STEP

export function TripPlanningLoader({
  dossier,
  onComplete,
  isReady = false,
}: TripPlanningLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const totalSteps = DEFAULT_STEPS.length

  // Slow advance while AI is still working — hold at second-to-last step
  useEffect(() => {
    if (isReady) return
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < HOLD_AT_STEP ? prev + 1 : prev))
    }, SLOW_INTERVAL)
    return () => clearInterval(timer)
  }, [isReady])

  // Hard cap: never let the "thinking" flow run past MAX_DURATION_MS
  useEffect(() => {
    const cap = setTimeout(() => {
      setCurrentStepIndex(totalSteps - 1)
      onComplete?.()
    }, MAX_DURATION_MS)
    return () => clearTimeout(cap)
  }, [onComplete, totalSteps])

  // Fast-complete once AI finishes
  useEffect(() => {
    if (!isReady) return
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) return prev + 1
        clearInterval(timer)
        setTimeout(() => onComplete?.(), 600)
        return prev
      })
    }, FAST_INTERVAL)
    return () => clearInterval(timer)
  }, [isReady, totalSteps, onComplete])

  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / totalSteps) * 100)
  )

  const daysLabel = dossier?.daysCount ? `${dossier.daysCount} days` : "3 days"
  const travelersLabel = dossier?.travelersCount
    ? `${dossier.travelersCount} travelers`
    : "2 travelers"
  const budgetLabel = dossier?.budgetTierLabel || "Mid-range"
  const paceLabel = dossier?.pace || "Relaxed"

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Ambient background glow in brand burnt-orange */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 82% 35%, rgba(204, 85, 0, 0.14) 0%, rgba(204, 85, 0, 0.02) 55%, transparent 80%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(204, 85, 0, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Top Tag Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground shadow-sm">
          <span>{daysLabel}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{travelersLabel}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{budgetLabel}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{paceLabel}</span>
        </div>

        {/* Heading & Subhead */}
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground sm:text-4xl">
          Trails is building your trip...
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Our AI agent is currently curating a personalized itinerary based on
          your dossier preferences.
        </p>

        {/* Steps Card */}
        <div className="mt-8 space-y-1 rounded-3xl border border-border bg-card p-3 shadow-lg">
          {DEFAULT_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isActive = idx === currentStepIndex

            return (
              <div
                key={step}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 transition-colors duration-300 ${
                  isActive
                    ? "rounded-2xl bg-primary/10 font-medium text-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.75 before:rounded-full before:bg-primary"
                    : isCompleted
                    ? "text-foreground/80"
                    : "text-muted-foreground/50"
                }`}
              >
                {/* Step Icon */}
                <div className="flex size-5 shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="size-4.5 text-primary"
                    />
                  ) : isActive ? (
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="size-4.5 animate-spin text-primary"
                    />
                  ) : (
                    <div className="size-3.5 rounded-full border border-border" />
                  )}
                </div>

                {/* Step Label */}
                <span className="text-sm tracking-wide">{step}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom ETA & Progress Bar */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4 text-xs font-mono text-muted-foreground">
          <span className="whitespace-nowrap">
            {isReady ? "Finalizing plan..." : "AI agent working..."}
          </span>

          <div className="h-1.5 flex-1 max-w-xs overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "5%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>

          <span className="whitespace-nowrap font-medium text-foreground">
            {progressPercent}% Complete
          </span>
        </div>
      </div>
    </div>
  )
}
