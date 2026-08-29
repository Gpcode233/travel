"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon, SentIcon, Loading03Icon } from "@hugeicons/core-free-icons"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"

interface AgentChatSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPrompt?: string
}

export function AgentChatSidebar({
  open,
  onOpenChange,
  initialPrompt,
}: AgentChatSidebarProps) {
  const [input, setInput] = useState("")
  const sentInitialRef = useRef<string | null>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (!open || !initialPrompt) return
    if (sentInitialRef.current === initialPrompt) return
    sentInitialRef.current = initialPrompt
    sendMessage({ text: initialPrompt })
  }, [open, initialPrompt, sendMessage])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isBusy) return
    sendMessage({ text: input.trim() })
    setInput("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HugeiconsIcon icon={SparklesIcon} className="size-4" />
            </div>
            <SheetTitle className="font-heading text-lg font-bold">
              Trails Agent
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Ask about places, hours, prices, or how to fit this into your trip.
          </SheetDescription>
        </SheetHeader>

        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                icon={<HugeiconsIcon icon={SparklesIcon} className="size-6" />}
                title="Ask Trails anything"
                description="Get local context, prices, and tips grounded in real places."
              />
            )}
            {messages.map((message) => {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")

              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{text}</MessageResponse>
                  </MessageContent>
                </Message>
              )
            })}
            {isBusy && (
              <Message from="assistant">
                <MessageContent>
                  <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin text-muted-foreground" />
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
        </Conversation>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Trails anything..."
              className="w-full rounded-full border border-border bg-background py-2.5 pl-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90"
            >
              <HugeiconsIcon icon={SentIcon} className="size-3.5" />
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
