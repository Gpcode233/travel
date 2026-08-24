"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  isDynamicToolUIPart,
  isToolUIPart,
  type DynamicToolUIPart,
  type LanguageModelUsage,
  type ToolUIPart,
  type UIMessage,
} from "ai"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowReloadHorizontalIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { nanoid } from "nanoid"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import { deriveTitle, useChatSessions } from "@/hooks/use-chat-sessions"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought"
import { Task, TaskContent, TaskTrigger } from "@/components/ai-elements/task"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import {
  calculateBudgetBaseline,
  formatBudgetBaseline,
  getBudgetTier,
  travelerCount,
} from "@/lib/budget-tiers"

type AgentMessage = UIMessage<{ usage?: LanguageModelUsage }>

const MODEL_ID = "openai/gpt-oss-20b"
const MODEL_MAX_TOKENS = 131_072

const starterPrompts = [
  "Plan a 3-day Enugu trip for waterfalls and food",
  "What's the difference between Awhum and Ezeagu?",
  "Suggest a mid-range hotel near Independence Layout",
  "Which restaurant in GRA is best for a group dinner?",
]

function buildAutoPrompt(searchParams: URLSearchParams): string | null {
  const prompt = searchParams.get("prompt")
  if (prompt) return prompt

  const mode = searchParams.get("mode")

  if (mode === "guided") {
    const days = searchParams.get("days")
    const travelers = searchParams.get("travelers")
    const budgetValue = searchParams.get("budget")
    const pace = searchParams.get("pace")?.trim()
    const interests = searchParams.get("interests")?.trim()

    if (!days || !travelers || !budgetValue) return null

    const tier = getBudgetTier(budgetValue)
    const travelerN = travelerCount(travelers)
    const duration = Number(days)
    const baseline =
      tier && travelerN ? calculateBudgetBaseline(tier, travelerN, duration) : null

    const lines = [
      `Plan a ${days}-day Enugu trip for ${travelers} traveler${travelers === "1" ? "" : "s"}.`,
      `Budget tier: ${tier ? tier.label : budgetValue} (planning baseline of ₦${tier?.minPerPersonPerDay.toLocaleString()}${tier?.maxPerPersonPerDay ? `–₦${tier.maxPerPersonPerDay.toLocaleString()}` : "+"} per person per day — this is a guideline for the kind of trip I want, not a hard cap).`,
      baseline
        ? `Estimated trip baseline: ${formatBudgetBaseline(baseline)} total for the group.`
        : null,
      `Pace: ${pace ? pace : "no preference specified"}.`,
      `Interests: ${interests ? interests : "open to suggestions"}.`,
      `Travelers: ${travelers}. Remember some costs are shared across the group (hotel rooms, private vehicles, drivers, some guided tours) and should not be multiplied by traveler count, while others are per-person (food, some tickets/tours). Reason using actual prices for these dates where possible, and explain if the real itinerary cost differs from the baseline above.`,
      `Use known attractions, hotels, resorts, and restaurants to draft a full day-by-day itinerary.`,
    ]

    return lines.filter(Boolean).join(" ")
  }

  if (mode === "open") {
    return "I want to plan an Enugu trip but haven't decided the details yet. Ask me what you need to know (days, budget, pace, interests) before drafting an itinerary."
  }

  return null
}

type AnyToolPart = ToolUIPart | DynamicToolUIPart

function toolName(part: AnyToolPart) {
  return part.type === "dynamic-tool" ? part.toolName : part.type.slice(5)
}

function toolLabel(part: AnyToolPart) {
  const name = toolName(part)
  if (name === "search_locations") {
    const query = (part.input as { query?: string } | undefined)?.query
    return query
      ? `Searching destinations for "${query}"`
      : "Searching destinations"
  }
  return `Calling ${name}`
}

function toolStepStatus(part: AnyToolPart): "complete" | "active" {
  return part.state === "input-streaming" || part.state === "input-available"
    ? "active"
    : "complete"
}

function toolResultSummary(part: AnyToolPart) {
  if (part.state !== "output-available") return undefined
  const output = part.output as { count?: number } | undefined
  if (typeof output?.count !== "number") return undefined
  return `${output.count} match${output.count === 1 ? "" : "es"} found`
}

function ToolBlock({ part }: { part: AnyToolPart }) {
  return (
    <Tool key={part.toolCallId}>
      {isDynamicToolUIPart(part) ? (
        <ToolHeader
          type="dynamic-tool"
          state={part.state}
          toolName={part.toolName}
        />
      ) : (
        <ToolHeader type={part.type} state={part.state} />
      )}
      <ToolContent>
        <ToolInput input={part.input} />
        <ToolOutput output={part.output} errorText={part.errorText} />
      </ToolContent>
    </Tool>
  )
}

function AssistantToolActivity({ parts }: { parts: AnyToolPart[] }) {
  if (parts.length === 0) return null

  return (
    <Task className="w-full max-w-full" defaultOpen={false}>
      <TaskTrigger
        title={`Checked ${parts.length} source${parts.length === 1 ? "" : "s"}`}
      />
      <TaskContent>
        <ChainOfThought>
          <ChainOfThoughtHeader />
          <ChainOfThoughtContent>
            {parts.map((part) => (
              <ChainOfThoughtStep
                key={part.toolCallId}
                label={toolLabel(part)}
                description={toolResultSummary(part)}
                status={toolStepStatus(part)}
              />
            ))}
          </ChainOfThoughtContent>
        </ChainOfThought>
        {parts.map((part) => (
          <ToolBlock key={part.toolCallId} part={part} />
        ))}
      </TaskContent>
    </Task>
  )
}

function AgentChat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [input, setInput] = useState("")
  const [sessionId, setSessionId] = useState(() => nanoid())
  const initRef = useRef(false)
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
  } = useChat<AgentMessage>({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  })
  const { sessions, saveSession, deleteSession, getSession } =
    useChatSessions<AgentMessage>()

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const sessionParam = searchParams.get("session")
    const existing = sessionParam ? getSession(sessionParam) : undefined
    if (sessionParam && existing) {
      // getSession reads localStorage, which only exists client-side, so this
      // one-time restore has to run post-mount rather than during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(sessionParam)
      setMessages(existing.messages)
      return
    }

    const autoPrompt = buildAutoPrompt(searchParams)
    if (autoPrompt) {
      sendMessage({ text: autoPrompt })
    }
    router.replace("/agent")
  }, [searchParams, sendMessage, setMessages, getSession, router])

  useEffect(() => {
    if (messages.length === 0 || status === "streaming") return
    const firstUserText = messages
      .find((message) => message.role === "user")
      ?.parts.find(
        (part): part is { type: "text"; text: string } => part.type === "text"
      )?.text
    saveSession(sessionId, deriveTitle(firstUserText ?? "New chat"), messages)
  }, [messages, status, sessionId, saveSession])

  const lastAssistantUsage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.metadata?.usage

  const isStreaming = status === "streaming" || status === "submitted"

  async function handleSubmit(message: PromptInputMessage) {
    const text = message.text.trim()
    if (!text) return
    setInput("")
    await sendMessage({ text })
  }

  function handleNewChat() {
    setSessionId(nanoid())
    setMessages([])
    setInput("")
    router.replace("/agent")
  }

  function handleSelectSession(id: string) {
    const session = getSession(id)
    if (!session) return
    setSessionId(id)
    setMessages(session.messages)
    setInput("")
    router.replace(`/agent?session=${id}`)
  }

  function handleDeleteSession(id: string) {
    deleteSession(id)
    if (id === sessionId) {
      handleNewChat()
    }
  }

  return (
    <SidebarProvider>
      <ChatHistorySidebar
        sessions={sessions}
        activeId={sessionId}
        onSelect={handleSelectSession}
        onNew={handleNewChat}
        onDelete={handleDeleteSession}
      />
      <SidebarInset className="h-svh bg-background text-foreground">
        <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <SiteHeader />
            </div>
            <Context
              usedTokens={lastAssistantUsage?.totalTokens ?? 0}
              maxTokens={MODEL_MAX_TOKENS}
              usage={lastAssistantUsage}
              modelId={MODEL_ID}
            >
              <ContextTrigger />
              <ContextContent>
                <ContextContentHeader />
                <ContextContentBody>
                  <ContextInputUsage />
                  <ContextOutputUsage />
                  <ContextReasoningUsage />
                  <ContextCacheUsage />
                </ContextContentBody>
                <ContextContentFooter />
              </ContextContent>
            </Context>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-5 sm:px-8 lg:px-10">
          <Conversation>
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState>
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    className="size-8 text-muted-foreground"
                  />
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">
                      Ask the Enugu trip agent
                    </h3>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Grounded in the app&apos;s known Enugu attractions,
                      hotels, resorts, and restaurants via the search_locations
                      tool.
                    </p>
                  </div>
                  <Suggestions className="mt-2">
                    {starterPrompts.map((prompt) => (
                      <Suggestion
                        key={prompt}
                        suggestion={prompt}
                        onClick={setInput}
                      />
                    ))}
                  </Suggestions>
                </ConversationEmptyState>
              ) : (
                messages.map((message, messageIndex) => {
                  const toolParts = message.parts.filter(
                    (part): part is AnyToolPart =>
                      isToolUIPart(part) || isDynamicToolUIPart(part)
                  )
                  const isLastMessage = messageIndex === messages.length - 1

                  return (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.role === "assistant" && (
                          <AssistantToolActivity parts={toolParts} />
                        )}
                        {message.parts.map((part, partIndex) => {
                          if (part.type === "text") {
                            return (
                              <MessageResponse key={partIndex}>
                                {part.text}
                              </MessageResponse>
                            )
                          }
                          if (part.type === "reasoning" && part.text) {
                            return (
                              <Reasoning
                                key={partIndex}
                                isStreaming={
                                  isLastMessage &&
                                  isStreaming &&
                                  partIndex === message.parts.length - 1
                                }
                              >
                                <ReasoningTrigger />
                                <ReasoningContent>{part.text}</ReasoningContent>
                              </Reasoning>
                            )
                          }
                          return null
                        })}
                      </MessageContent>
                      {message.role === "assistant" &&
                        isLastMessage &&
                        status === "ready" && (
                          <MessageActions>
                            <MessageAction
                              tooltip="Regenerate"
                              onClick={() => regenerate()}
                            >
                              <HugeiconsIcon
                                icon={ArrowReloadHorizontalIcon}
                                className="size-4"
                              />
                            </MessageAction>
                          </MessageActions>
                        )}
                    </Message>
                  )
                })
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {error && (
            <Alert className="mb-3" variant="destructive">
              <AlertTitle>The agent hit an error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <PromptInput className="mb-4" onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Enugu destinations, pacing, or a full itinerary..."
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit
                status={status}
                onStop={stop}
                disabled={status === "ready" && !input.trim()}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AgentPage() {
  return (
    <Suspense fallback={null}>
      <AgentChat />
    </Suspense>
  )
}
