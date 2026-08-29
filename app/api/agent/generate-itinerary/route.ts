import { generateText, generateObject, tool, stepCountIs } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { NextResponse } from "next/server"
import { allPlaces } from "@/lib/enugu-data"
import {
  generateAccommodations,
  formatCurrency,
  PLACE_COORDINATES,
} from "@/lib/itinerary-generator"
import { budgetTiers } from "@/lib/budget-tiers"
import type { BudgetTierValue } from "@/lib/budget-tiers"
import type {
  ItineraryActivity,
  ItineraryDay,
  TripDossier,
  TripItinerary,
} from "@/lib/itinerary-types"

export const maxDuration = 60

const CATEGORY_IMAGES: Record<string, string[]> = {
  food: [
    "https://images.pexels.com/photos/6740517/pexels-photo-6740517.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  nature: [
    "https://images.pexels.com/photos/142497/pexels-photo-142497.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  culture: [
    "https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  attraction: [
    "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  hotel: [
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  adventure: [
    "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/142497/pexels-photo-142497.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  relaxation: [
    "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  transport: [
    "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  nightlife: [
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1268514/pexels-photo-1268514.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
}

let imageCounters: Record<string, number> = {}
function pickImage(category: string): string {
  const pool = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.attraction
  const idx = (imageCounters[category] ?? 0) % pool.length
  imageCounters[category] = idx + 1
  return pool[idx]
}

// Prefer the real listing photo for a named place over generic category
// stock photography, when the AI picked somewhere in the platform catalog.
function findPlaceImage(name: string): string | undefined {
  const needle = name.trim().toLowerCase()
  if (!needle) return undefined
  const match = allPlaces.find(
    (p) =>
      needle.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(needle)
  )
  return match?.image
}

const platformPlacesContext = allPlaces
  .map((p) => `- ${p.name} (${p.category}, ${p.area}): ${p.note}`)
  .join("\n")

const coordinatesContext = Object.entries(PLACE_COORDINATES)
  .map(([slug, c]) => `${slug}: lat=${c.lat}, lng=${c.lng}, area=${c.area}`)
  .join("\n")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      days: daysParam = "3",
      travelers: travelersParam = "2",
      budget = "mid-range",
      pace = "relaxed",
      interests = "Nature, Food, Culture",
      destination = "Enugu",
    } = body

    const daysCount = Math.max(1, Math.min(14, Number(daysParam) || 3))
    const travelersCount = Math.max(1, Number(travelersParam) || 2)
    const budgetTier = (budget as BudgetTierValue) || "mid-range"
    const tierConfig = budgetTiers[budgetTier]
    const interestsList = typeof interests === "string"
      ? interests.split(",").map((s: string) => s.trim()).filter(Boolean)
      : interests

    const activitiesPerDay = pace === "packed" ? 4 : pace === "balanced" ? 3 : 2

    imageCounters = {}
    const accommodations = generateAccommodations(destination, budgetTier)
    const selectedHotel = accommodations[0]

    const researchModel = groq("openai/gpt-oss-120b")

    const searchLocationsTool = tool({
      description: "Search known Enugu travel places by keyword and category.",
      inputSchema: z.object({
        query: z.string(),
        category: z.enum(["attraction", "hotel", "resort", "restaurant", "nightlife"]).optional(),
      }),
      execute: async ({ query, category }) => {
        const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
        const byCategory = category
          ? allPlaces.filter((p) => p.category === category)
          : allPlaces
        const matches = words.length
          ? byCategory.filter((p) => {
              const haystack = [p.name, p.area, p.kind].join(" ").toLowerCase()
              return words.some((w) => haystack.includes(w))
            })
          : byCategory
        return {
          count: matches.length,
          results: matches.map(({ slug, name, category, area, kind, note }) => ({
            slug, name, category, area, kind, note,
            coordinates: PLACE_COORDINATES[slug] ?? null,
          })),
        }
      },
    })

    // Phase 1: research with tools (real-world grounding). Free-form text output —
    // no JSON instruction here, since asking a tool-enabled model for "JSON only"
    // makes it occasionally hallucinate a nonexistent "json" tool call.
    const researchPrompt = `Research real places for a ${daysCount}-day trip to ${destination}, Nigeria.
Travelers: ${travelersCount}. Budget tier: ${budgetTier}. Pace: ${pace}. Interests: ${interestsList.join(", ")}.
Hotel base: ${selectedHotel.name} (${selectedHotel.area}).
Every day's breakfast happens at the hotel itself.
For each day, use search_locations to find real attractions matching the interests, plus real restaurants for lunch and dinner. If interests include nightlife, use search_locations with category "nightlife". Use browser_search for current prices or opening hours if useful.
Write concise notes: for each day, list the specific places found (name, area, category) and a rough per-person cost in NGN.`

    const research = await generateText({
      model: researchModel,
      system: `You are an expert Enugu, Nigeria travel researcher.

PLATFORM PLACES (prefer these, they have known coordinates):
${platformPlacesContext}

KNOWN COORDINATES (use these for platform places):
${coordinatesContext}

For places not in the platform, use realistic Enugu coordinates (latitude 6.3–6.6, longitude 7.3–7.6).`,
      prompt: researchPrompt,
      stopWhen: stepCountIs(6),
      providerOptions: { groq: { reasoningEffort: "low" as const } },
      tools: {
        browser_search: groq.tools.browserSearch({}),
        search_locations: searchLocationsTool,
      },
    })

    // Phase 2: format pass, one day at a time. Asking for the whole trip's JSON
    // in a single call made the model truncate or malform later days once the
    // output got long (5+ days worth of activities) — generating one day per
    // call keeps each response small enough to come back complete and valid
    // every time, and a schema-validated generateObject call can't return
    // unparsable JSON the way a raw text completion could.
    const activitySchema = z.object({
      title: z.string(),
      description: z.string(),
      startTime: z.string(),
      durationMinutes: z.number(),
      estimatedCost: z.number(),
      category: z.enum([
        "food", "nature", "culture", "attraction", "adventure",
        "relaxation", "transport", "hotel", "nightlife",
      ]),
      tags: z.array(z.string()),
      locationName: z.string(),
      locationArea: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      travelFromPreviousMinutes: z.number(),
      travelMode: z.enum(["drive", "walk", "transit"]),
    })

    const daySchema = z.object({
      title: z.string(),
      summary: z.string(),
      activities: z.array(activitySchema).length(activitiesPerDay + 3),
    })

    const formatSystemPrompt = (dayNumber: number, usedTitles: string[]) => `Produce day ${dayNumber} of a ${daysCount}-day Enugu trip itinerary from the research notes below. Respond with structured data only.

RULES:
- EXACTLY ${activitiesPerDay + 3} activities: 3 meals + ${activitiesPerDay} non-meal activities, ordered chronologically by startTime.
  1. BREAKFAST: startTime "8:00 AM", durationMinutes 45, category "hotel", always titled "Breakfast at ${selectedHotel.name}", cost 0, locationName "${selectedHotel.name}", use the hotel's coordinates
  2. LUNCH: startTime "12:30 PM", durationMinutes 60, category "food" (a real restaurant from research)
  3. DINNER: startTime "7:30 PM", durationMinutes 75, category "food" (a real restaurant from research, include description)
- The ${activitiesPerDay} non-meal activities must use real places from the research notes
- Do not repeat any of these activities already used on earlier days: ${usedTitles.length ? usedTitles.join(", ") : "none yet"}
- Costs in NGN (Nigerian Naira) per person
- Budget tier: ${tierConfig.label} (₦${tierConfig.minPerPersonPerDay.toLocaleString()}–${tierConfig.maxPerPersonPerDay ? "₦" + tierConfig.maxPerPersonPerDay.toLocaleString() : "open"}/person/day)`

    const days_: Array<{ title: string; summary: string; activities: any[] }> = []
    for (let dayNumber = 1; dayNumber <= daysCount; dayNumber++) {
      const usedTitles = days_.flatMap((d) => d.activities.map((a) => a.title))
      const { object } = await generateObject({
        model: researchModel,
        schema: daySchema,
        system: formatSystemPrompt(dayNumber, usedTitles),
        prompt: `Research notes:\n${research.text}`,
      })
      days_.push(object)
    }

    const aiData = { tripTitle: undefined as string | undefined, days: days_ }

    // Assemble full TripItinerary
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + 14)

    const days: ItineraryDay[] = aiData.days.slice(0, daysCount).map(
      (d: any, dayIdx: number) => {
        const dayDate = new Date(baseDate)
        dayDate.setDate(baseDate.getDate() + dayIdx)
        const dateLabel = dayDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })

        const activities: ItineraryActivity[] = d.activities
          .slice(0, activitiesPerDay + 3)
          .map((act: any, actIdx: number) => ({
            id: `day-${dayIdx + 1}-act-${actIdx + 1}`,
            title: act.title,
            description: act.description,
            startTime: act.startTime,
            durationMinutes: act.durationMinutes ?? 60,
            durationLabel: `${Math.round((act.durationMinutes ?? 60) / 60 * 10) / 10} hr`,
            estimatedCost: act.estimatedCost ?? 0,
            formattedCost: act.estimatedCost ? formatCurrency(act.estimatedCost) : "Free",
            category: act.category ?? "attraction",
            tags: act.tags ?? [],
            imageUrl:
              findPlaceImage(act.locationName ?? "") ??
              (act.category === "hotel" ? selectedHotel.imageUrl : undefined) ??
              pickImage(act.category ?? "attraction"),
            location: {
              name: act.locationName,
              area: act.locationArea,
              latitude: act.latitude,
              longitude: act.longitude,
            },
            travelFromPreviousMinutes: act.travelFromPreviousMinutes ?? 10,
            travelMode: act.travelMode ?? "drive",
          }))

        return {
          id: `day-${dayIdx + 1}`,
          dayNumber: dayIdx + 1,
          dateLabel,
          title: d.title ?? `Day ${dayIdx + 1}`,
          summary: d.summary ?? "",
          activities,
        }
      }
    )

    const allActivities = days.flatMap((d) => d.activities)
    const activitiesTotal =
      allActivities.reduce((s, a) => s + a.estimatedCost, 0) * travelersCount
    const foodDailyPerPerson =
      budgetTier === "lean" ? 7_500 : budgetTier === "premium" ? 30_000 : 15_000
    const transportDailyPerPerson =
      budgetTier === "lean" ? 5_000 : budgetTier === "premium" ? 25_000 : 10_000
    const foodTotal = foodDailyPerPerson * travelersCount * daysCount
    const transportTotal = transportDailyPerPerson * travelersCount * daysCount
    const hotelTotal = selectedHotel.pricePerNight * daysCount
    const totalAmount = hotelTotal + activitiesTotal + foodTotal + transportTotal
    const totalMin = Math.round(totalAmount * 0.95)
    const totalMax = Math.round(totalAmount * 1.15)

    const endDateObj = new Date(baseDate)
    endDateObj.setDate(baseDate.getDate() + daysCount - 1)
    const startLabel = baseDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    const endLabel = endDateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short" })

    const dossier: TripDossier = {
      id: `trip-${Date.now()}`,
      title: aiData.tripTitle ?? `Your ${destination} Escape`,
      destination,
      destinationCountry: "Nigeria",
      startDate: startLabel,
      endDate: endLabel,
      dateRangeLabel: `${startLabel} — ${endLabel}`,
      daysCount,
      travelersCount,
      travelersLabel: `${travelersCount} Traveler${travelersCount === 1 ? "" : "s"}`,
      budgetTier,
      budgetTierLabel: tierConfig.label,
      pace: pace.charAt(0).toUpperCase() + pace.slice(1),
      interests: interestsList,
      heroImageUrl:
        "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=1800",
    }

    const itinerary: TripItinerary = {
      dossier,
      days,
      accommodations,
      selectedAccommodationId: accommodations[0].id,
      budgetBreakdown: {
        currency: "NGN",
        categories: [
          { key: "accommodation", label: "Accommodation", amount: hotelTotal, formattedAmount: formatCurrency(hotelTotal) },
          { key: "food", label: "Food & Drink", amount: foodTotal, formattedAmount: formatCurrency(foodTotal) },
          { key: "transport", label: "Transport", amount: transportTotal, formattedAmount: formatCurrency(transportTotal) },
          { key: "activities", label: "Activities", amount: activitiesTotal, formattedAmount: formatCurrency(activitiesTotal) },
        ],
        estimatedTotalMin: totalMin,
        estimatedTotalMax: totalMax,
        formattedTotal: `~ ${formatCurrency(totalMin)}`,
        formattedRange: `${formatCurrency(totalMin)} – ${formatCurrency(totalMax)}`,
        targetBaselineMin: tierConfig.minPerPersonPerDay * travelersCount * daysCount,
        targetBaselineMax: tierConfig.maxPerPersonPerDay
          ? tierConfig.maxPerPersonPerDay * travelersCount * daysCount
          : null,
      },
      totalTravelTimeMinutesSaved: Math.round(allActivities.length * 8),
      status: "draft",
    }

    return NextResponse.json({ itinerary })
  } catch (error: any) {
    console.error("generate-itinerary error:", error)
    return NextResponse.json({ error: error?.message ?? "Generation failed" }, { status: 500 })
  }
}
