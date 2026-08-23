"use client"

import { useState } from "react"
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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
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
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool"
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

type AgentMessage = UIMessage<{ usage?: LanguageModelUsage }>

const MODEL_ID = "openai/gpt-oss-20b"
const MODEL_MAX_TOKENS = 131_072

const starterPrompts = [
  "Plan a 3-day Enugu trip for waterfalls and food",
  "What's the difference between Awhum and Ezeagu?",
  "Suggest a relaxed 2-day Nike Lake weekend",
  "Which Nigeria extension pairs well with a 5-day Enugu trip?",
]

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

export default function AgentPage() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, stop, error, regenerate } =
    useChat<AgentMessage>({
      transport: new DefaultChatTransport({ api: "/api/agent" }),
    })

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

  return (
    <main className="flex h-svh flex-col bg-background text-foreground">
      <div className="border-b px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <SiteHeader />
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
                    Grounded in the app&apos;s known Enugu and Nigeria
                    destinations via the search_locations tool.
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
    </main>
  )
}
