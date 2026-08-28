"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  Cancel01Icon,
  SentIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Coins01Icon,
  BedIcon,
  SpoonAndForkIcon,
  PlusSignIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface AskTrailsAssistantProps {
  onApplyAction: (actionType: string, promptText?: string) => Promise<void> | void
}

const QUICK_ACTIONS = [
  {
    id: "relax",
    label: "Make this day more relaxed",
    icon: Clock01Icon,
    description: "Adds breathing room and removes rush between stops",
  },
  {
    id: "cheaper-hotel",
    label: "Find a cheaper hotel",
    icon: BedIcon,
    description: "Switches to an alternative budget-friendly accommodation",
  },
  {
    id: "more-food",
    label: "Add more food spots",
    icon: SpoonAndForkIcon,
    description: "Incorporates top-rated local cafes and dinner spots",
  },
  {
    id: "under-budget",
    label: "Keep trip under my budget",
    icon: Coins01Icon,
    description: "Adjusts activities and transport to lower estimated cost",
  },
  {
    id: "add-day",
    label: "Add another day to trip",
    icon: PlusSignIcon,
    description: "Extends the itinerary with extra exploration time",
  },
]

export function AskTrailsAssistant({ onApplyAction }: AskTrailsAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastActionStatus, setLastActionStatus] = useState<string | null>(null)

  async function handleActionClick(actionId: string, label: string) {
    setIsProcessing(true)
    setLastActionStatus(`Applying: "${label}"...`)
    try {
      await onApplyAction(actionId)
      setLastActionStatus(`Updated itinerary based on: "${label}"`)
      setTimeout(() => {
        setLastActionStatus(null)
      }, 4000)
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleSubmitPrompt(e: React.FormEvent) {
    e.preventDefault()
    if (!customPrompt.trim() || isProcessing) return

    const prompt = customPrompt.trim()
    setCustomPrompt("")
    setIsProcessing(true)
    setLastActionStatus(`Trails AI is adapting your itinerary...`)

    try {
      await onApplyAction("custom", prompt)
      setLastActionStatus(`Itinerary updated: "${prompt}"`)
      setTimeout(() => {
        setLastActionStatus(null)
      }, 4000)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Floating Ask Trails Trigger Button matching reference image 2 */}
      <div className="fixed right-6 bottom-18 z-40 sm:bottom-20">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-xs border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-xl transition-all duration-200 hover:border-primary hover:bg-muted/80"
        >
          <HugeiconsIcon
            icon={SparklesIcon}
            className="size-4 text-blue-600 group-hover:scale-110 transition-transform"
          />
          <span>Ask Trails</span>
        </button>
      </div>

      {/* Slide-over Assistant Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6">
          <SheetHeader className="text-left border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-xs bg-blue-600 text-white">
                <HugeiconsIcon icon={SparklesIcon} className="size-4" />
              </div>
              <SheetTitle className="font-heading text-lg font-bold">
                Ask Trails Assistant
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs text-muted-foreground">
              Modify the itinerary in real-time. Actions adapt your timeline, budget, and map dynamically.
            </SheetDescription>
          </SheetHeader>

          {/* Assistant Status Feedback */}
          {lastActionStatus && (
            <div className="my-3 flex items-center gap-2 rounded-xs border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-700">
              {isProcessing ? (
                <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin shrink-0" />
              ) : (
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-blue-600 shrink-0" />
              )}
              <span>{lastActionStatus}</span>
            </div>
          )}

          {/* Quick Actions List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            <h4 className="text-xs font-mono font-semibold tracking-wider text-muted-foreground uppercase">
              Suggested Modifications
            </h4>

            <div className="grid gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    disabled={isProcessing}
                    onClick={() => handleActionClick(action.id, action.label)}
                    className="flex items-start gap-3 rounded-xs border border-border/80 bg-card p-3 text-left transition-all hover:border-primary/60 hover:bg-muted/40 disabled:opacity-50"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-xs bg-muted text-primary">
                      <HugeiconsIcon icon={Icon} className="size-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-foreground">
                        {action.label}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {action.description}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chat / Custom Prompt Input */}
          <form onSubmit={handleSubmitPrompt} className="border-t pt-4">
            <div className="relative">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask Trails anything about this trip..."
                className="w-full rounded-xs border border-border bg-background py-2.5 pl-3 pr-10 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={!customPrompt.trim() || isProcessing}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-xs bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
              >
                <HugeiconsIcon icon={SentIcon} className="size-3.5" />
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
