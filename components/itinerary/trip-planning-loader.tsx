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
  estimatedDurationSeconds?: number
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

export function TripPlanningLoader({
  dossier,
  onComplete,
  estimatedDurationSeconds = 4.5,
}: TripPlanningLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const totalSteps = DEFAULT_STEPS.length

  useEffect(() => {
    const stepInterval = (estimatedDurationSeconds * 1000) / totalSteps
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1
        } else {
          clearInterval(timer)
          setTimeout(() => {
            onComplete?.()
          }, 600)
          return prev
        }
      })
    }, stepInterval)

    return () => clearInterval(timer)
  }, [estimatedDurationSeconds, totalSteps, onComplete])

  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / totalSteps) * 100)
  )
  const remainingSeconds = Math.max(
    0,
    Math.round(
      (estimatedDurationSeconds * (totalSteps - (currentStepIndex + 1))) /
        totalSteps
    )
  )

  const daysLabel = dossier?.daysCount ? `${dossier.daysCount} days` : "3 days"
  const travelersLabel = dossier?.travelersCount
    ? `${dossier.travelersCount} travelers`
    : "2 travelers"
  const budgetLabel = dossier?.budgetTierLabel || "Mid-range"
  const paceLabel = dossier?.pace || "Relaxed"

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#070b11] px-4 py-12 text-white selection:bg-primary selection:text-white">
      {/* Ambient background glow matching reference image */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 82% 35%, rgba(29, 78, 216, 0.28) 0%, rgba(15, 23, 42, 0.05) 55%, transparent 80%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Top Tag Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/80 shadow-sm backdrop-blur-sm">
          <span>{daysLabel}</span>
          <span className="text-white/40">·</span>
          <span>{travelersLabel}</span>
          <span className="text-white/40">·</span>
          <span>{budgetLabel}</span>
          <span className="text-white/40">·</span>
          <span>{paceLabel}</span>
        </div>

        {/* Heading & Subhead */}
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-white sm:text-4xl">
          Trails is building your trip...
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
          Our AI agent is currently curating a personalized itinerary based on
          your dossier preferences.
        </p>

        {/* Steps Card */}
        <div className="mt-8 space-y-1 rounded-sm border border-white/10 bg-black/40 p-3 shadow-2xl backdrop-blur-md">
          {DEFAULT_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isActive = idx === currentStepIndex
            const isPending = idx > currentStepIndex

            return (
              <div
                key={step}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 transition-colors duration-300 ${
                  isActive
                    ? "rounded-sm bg-blue-950/40 text-white font-medium before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.75 before:rounded-full before:bg-blue-500"
                    : isCompleted
                    ? "text-white/85"
                    : "text-white/35"
                }`}
              >
                {/* Step Icon */}
                <div className="flex size-5 shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="size-4.5 text-white/90"
                    />
                  ) : isActive ? (
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="size-4.5 animate-spin text-blue-400"
                    />
                  ) : (
                    <div className="size-3.5 rounded-full border border-white/30" />
                  )}
                </div>

                {/* Step Label */}
                <span className="text-sm tracking-wide">{step}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom ETA & Progress Bar */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs font-mono text-white/70">
          <span className="whitespace-nowrap">
            ETA: {remainingSeconds} {remainingSeconds === 1 ? "second" : "seconds"}
          </span>

          <div className="h-1.5 flex-1 max-w-xs overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "5%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>

          <span className="whitespace-nowrap font-medium text-white/90">
            {progressPercent}% Complete
          </span>
        </div>
      </div>
    </div>
  )
}
