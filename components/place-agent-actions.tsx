"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon, PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { AgentChatSidebar } from "@/components/agent-chat-sidebar"
import type { Place } from "@/lib/enugu-data"

export function PlaceAgentActions({ place }: { place: Place }) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState<string | undefined>(undefined)

  function askAboutPlace() {
    setPrompt(`Tell me more about ${place.name} in ${place.area} and how to fit it into an Enugu itinerary.`)
    setOpen(true)
  }

  function addToTrip() {
    setPrompt(`Add ${place.name} (${place.area}) to my itinerary.`)
    setOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={askAboutPlace}>
          Ask the agent
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Button>
        <Button size="lg" variant="outline" onClick={addToTrip}>
          Add to trip
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        </Button>
      </div>

      <AgentChatSidebar open={open} onOpenChange={setOpen} initialPrompt={prompt} />
    </>
  )
}
