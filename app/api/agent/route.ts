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

import { allPlaces } from "@/lib/enugu-data"

export const maxDuration = 60

type AgentMessage = UIMessage<{ usage?: LanguageModelUsage }>

const model = groq(process.env.AI_MODEL ?? "openai/gpt-oss-20b")

const systemPrompt = `You are Trails, an Enugu-first Nigeria travel planning agent.
Prioritize Enugu State destinations before wider Nigeria suggestions. Use the search_locations tool to ground
recommendations (attractions, hotels, resorts, restaurants) in the app's known places instead of inventing
places or prices. One search_locations call per category (attraction, hotel, resort, restaurant) is usually enough — pass an
empty query ("") with just the category filter to list everything in that category at once, rather than
several narrow re-queries, and move on to drafting the itinerary once you have enough to work with. Use browser_search for
anything time-sensitive (current weather, road conditions, opening hours, current pricing). When the user
hasn't given trip details (days, travelers, budget, pace, interests), ask
for what you need before drafting a full itinerary. Keep answers practical: mention travel time, pace, and what
to double-check locally (guide availability, road conditions, opening hours). Be concise and use short
paragraphs or lists.

Budget handling: a budget tier (lean, mid-range, premium) with a per-person-per-day baseline range is a planning
guideline, not a fixed package price or hard spending cap.
- Lean (~₦65k–₦100k/person/day): good-value accommodation, affordable/local food, standard transport, free or
  inexpensive attractions, a few well-chosen paid experiences. Not the cheapest possible trip — avoid unnecessary
  premium spending, but keep it comfortable.
- Mid-range (~₦100k–₦150k/person/day): comfortable hotels, good restaurants, convenient transport, a broader mix
  of paid experiences. Noticeably more comfortable than lean.
- Premium (₦150k+/person/day, open-ended): premium hotels, private transport where appropriate, upscale dining,
  premium experiences, convenience and flexibility. Never treat premium as capped.

Reconcile the baseline with reality: build the itinerary from actual known prices for the requested dates,
travelers, and duration, not by multiplying the baseline out and calling that the final cost. If the realistic
cost of a suitable itinerary comes out above or below the stated baseline, say so plainly and explain why
(e.g. "your lean baseline is about ₦X, but suitable lodging on these dates brings it to ₦Y — you could switch to
a more economical hotel to close the gap"). Offer cheaper or better alternatives when relevant instead of
silently forcing the number to fit.

Shared vs per-person costs: never blindly multiply every cost by traveler count. Hotel rooms, apartments,
private vehicles, drivers, and some guided tours are usually shared costs (divide across the group, or note that
extra travelers may need an additional room). Food, and some attraction tickets/tours/experiences, are usually
per-person costs (multiply by traveler count). Reason about which is which per item instead of applying one rule
to everything.`

export async function POST(request: Request) {
  const { messages }: { messages: AgentMessage[] } = await request.json()

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    maxOutputTokens: 2048,
    // Force a grounding tool call on the first step of every turn so the
    // model can't skip straight to answering from (potentially hallucinated)
    // built-in knowledge instead of the app's known places.
    prepareStep: ({ stepNumber }) =>
      stepNumber === 0 ? { toolChoice: "required" as const } : undefined,
    providerOptions: {
      groq: { reasoningEffort: "low", reasoningFormat: "parsed" },
    },
    tools: {
      browser_search: groq.tools.browserSearch({}),
      search_locations: tool({
        description:
          "Search known Enugu and wider-Nigeria travel places (attractions, hotels, resorts, restaurants) by keyword matched against name, area, or kind (e.g. 'waterfall', 'hotel pool', 'jollof', 'GRA'). Optionally filter by category.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("Keyword to match against place name, area, or kind"),
          category: z
            .enum(["attraction", "hotel", "resort", "restaurant"])
            .optional()
            .describe("Restrict results to one category"),
        }),
        execute: async ({ query, category }) => {
          const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
          const byCategory = category
            ? allPlaces.filter((place) => place.category === category)
            : allPlaces
          const matches = words.length
            ? byCategory.filter((place) => {
                const haystack = [place.name, place.area, place.kind]
                  .join(" ")
                  .toLowerCase()
                return words.some((word) => haystack.includes(word))
              })
            : byCategory

          return {
            query,
            category: category ?? "all",
            count: matches.length,
            results: matches.map(
              ({ slug, name, category, area, kind, time, priceLevel, address, note }) => ({
                slug,
                name,
                category,
                area,
                kind,
                time,
                priceLevel,
                address,
                note,
              })
            ),
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
      console.error(
        "agent stream error:",
        error instanceof Error
          ? { name: error.name, message: error.message, cause: error.cause }
          : error
      )
      return error instanceof Error ? error.message : "An error occurred."
    },
  })
}
