import { NextResponse } from "next/server"
import { generateDynamicTripItinerary } from "@/lib/itinerary-generator"

export const maxDuration = 10

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      days = "3",
      travelers = "2",
      budget = "mid-range",
      pace = "relaxed",
      interests = "Nature, Food, Culture",
      destination = "Enugu",
      startDate,
    } = body

    const itinerary = generateDynamicTripItinerary({
      destination,
      days,
      travelers,
      budget,
      pace,
      interests,
      startDate,
    })

    return NextResponse.json({ itinerary })
  } catch (error: any) {
    console.error("generate-itinerary error:", error)
    return NextResponse.json({ error: error?.message ?? "Generation failed" }, { status: 500 })
  }
}
