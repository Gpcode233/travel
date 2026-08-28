import { generateText, tool } from "ai"
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

    const hotelHasBreakfast = selectedHotel.amenities?.some((a: string) =>
      a.toLowerCase().includes("breakfast")
    ) ?? (budgetTier !== "lean")

    const systemPrompt = `You are an expert Enugu, Nigeria travel planner. Generate a detailed, realistic day-by-day trip itinerary.

PLATFORM PLACES (prefer these, they have known coordinates):
${platformPlacesContext}

KNOWN COORDINATES (use these for platform places):
${coordinatesContext}

For places not in the platform, use realistic Enugu coordinates (latitude 6.3–6.6, longitude 7.3–7.6).

HOTEL BASE: ${selectedHotel.name} in ${selectedHotel.area}.
${hotelHasBreakfast ? `This hotel includes breakfast — use title "Breakfast at ${selectedHotel.name}", estimatedCost 0, category "hotel", latitude/longitude matching the hotel.` : `This is a budget hotel with no included breakfast — suggest a nearby affordable breakfast spot.`}

RULES:
- Each day MUST have exactly these 3 meal slots (non-negotiable):
  1. BREAKFAST: startTime "8:00 AM", durationMinutes 45, category "food" ${hotelHasBreakfast ? `(always "Breakfast at ${selectedHotel.name}", cost 0, category "hotel", use hotel coordinates)` : "(nearby breakfast spot, budget-appropriate cost)"}
  2. LUNCH: startTime "12:30 PM", durationMinutes 60, category "food" (local restaurant, budget-appropriate)
  3. DINNER: startTime "7:30 PM", durationMinutes 75, category "food" (dinner restaurant, include description)
- Plus ${activitiesPerDay} additional non-meal activities spread across the day
- Total activities per day = ${activitiesPerDay + 3} (3 meals + ${activitiesPerDay} activities)
- Order activities chronologically by startTime
- Mix: nature, food, culture, adventure, nightlife based on interests: ${interestsList.join(", ")}
- For nightlife/entertainment interests, include evening stops at known Enugu nightlife venues (Toscana Villa, Volt Arena, Grand East Man, De Kash, Cubana, Hotel Presidential bar)
- Use browser_search for current restaurant prices, opening hours, or new venues
- Use search_locations to find platform places matching the activities (use category "nightlife" for evening entertainment)
- Start each day at the hotel, end each day near the hotel
- Costs in NGN (Nigerian Naira) per person
- Budget tier: ${tierConfig.label} (₦${tierConfig.minPerPersonPerDay.toLocaleString()}–${tierConfig.maxPerPersonPerDay ? "₦" + tierConfig.maxPerPersonPerDay.toLocaleString() : "open"}/person/day)

OUTPUT: Respond with ONLY valid JSON, no explanation, no markdown fences. Match this exact structure:
{
  "tripTitle": "string",
  "days": [
    {
      "title": "string (e.g. 'Waterfalls & Heritage')",
      "summary": "string (1-2 sentences about the day)",
      "activities": [
        {
          "title": "string",
          "description": "string (2-3 sentences)",
          "startTime": "string (e.g. '9:00 AM')",
          "durationMinutes": number,
          "estimatedCost": number,
          "category": "food|nature|culture|attraction|adventure|relaxation|transport|hotel|nightlife",
          "tags": ["string"],
          "locationName": "string",
          "locationArea": "string",
          "latitude": number,
          "longitude": number,
          "travelFromPreviousMinutes": number,
          "travelMode": "drive|walk|transit"
        }
      ]
    }
  ]
}`

    const userPrompt = `Plan a ${daysCount}-day trip to ${destination}, Nigeria.
Travelers: ${travelersCount}
Budget tier: ${budgetTier}
Pace: ${pace}
Interests: ${interestsList.join(", ")}
Hotel base: ${selectedHotel.name} (${selectedHotel.area})

Generate ${daysCount} unique days. Each day MUST have ${activitiesPerDay + 3} activities total: breakfast (8:00 AM), ${activitiesPerDay} daytime activities, lunch (12:30 PM), dinner (7:30 PM). Order all activities by startTime. Use browser_search to verify restaurant options and search_locations to find platform places. Output only JSON.`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: userPrompt,
      tools: {
        browser_search: groq.tools.browserSearch({}),
        search_locations: tool({
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
        }),
      },
      providerOptions: {
        groq: { reasoningEffort: "low" as const },
      },
    })

    // Extract JSON from response (handle potential markdown fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("AI did not return valid JSON")

    const aiData = JSON.parse(jsonMatch[0])

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
            imageUrl: pickImage(act.category ?? "attraction"),
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
