import { groq } from "@ai-sdk/groq"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type LanguageModelUsage,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { enuguLocations, nigeriaSpots } from "@/lib/enugu-data"

export const maxDuration = 60

type AgentMessage = UIMessage<{ usage?: LanguageModelUsage }>

const model = groq(process.env.AI_MODEL ?? "openai/gpt-oss-20b")

const allDestinations = [...enuguLocations, ...nigeriaSpots]

const systemPrompt = `You are an Enugu-first Nigeria travel planning agent embedded in the Enugu Trails AI app.
Prioritize Enugu State destinations before wider Nigeria suggestions. Use the search_locations tool to ground
recommendations in the app's known destinations instead of inventing places. Use browser_search for anything
time-sensitive (current weather, road conditions, opening hours, prices). Keep answers practical: mention
travel time, pace, and what to double-check locally (guide availability, road conditions, opening hours).
Be concise and use short paragraphs or lists.`

export async function POST(request: Request) {
  const { messages }: { messages: AgentMessage[] } = await request.json()

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    providerOptions: {
      groq: { reasoningFormat: "parsed" },
    },
    tools: {
      browser_search: groq.tools.browserSearch({}),
      search_locations: tool({
        description:
          "Search known Enugu and wider-Nigeria travel destinations by keyword matched against name, area, or kind (e.g. 'waterfall', 'lake', 'museum', 'Udi').",
        inputSchema: z.object({
          query: z
            .string()
            .describe("Keyword to match against destination name, area, or kind"),
        }),
        execute: async ({ query }) => {
          const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
          const matches = words.length
            ? allDestinations.filter((location) => {
                const haystack = [location.name, location.area, location.kind]
                  .join(" ")
                  .toLowerCase()
                return words.some((word) => haystack.includes(word))
              })
            : allDestinations

          return {
            query,
            count: matches.length,
            results: matches.map(({ name, area, kind, time, note }) => ({
              name,
              area,
              kind,
              time,
              note,
            })),
          }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        return { usage: part.totalUsage }
      }
    },
    onError: (error) => {
      console.error("agent stream error:", error)
      return error instanceof Error ? error.message : "An error occurred."
    },
  })
}
