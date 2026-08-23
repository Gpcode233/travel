import { NextResponse } from "next/server"

const enuguContext = `
Primary focus: tourism in Enugu State, Nigeria.
Core places: Awhum Waterfall, Ngwo Pine Forest and cave, Nike Lake, Ezeagu Tourist Complex, Milken Hills, National Museum of Unity Enugu, Unity Park, Michael Okpara Square, Polo Park area, local food stops for abacha, okpa, nkwobi, palm wine, and pepper soup.
Planning constraints: prefer daylight road movement, recommend local guide for caves/forest/waterfall trails, account for wet-season footing, group nearby places, avoid overpacked rural legs, include rest and meal breaks.
`

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const days = String(body.days ?? "3")
  const dayCount = Number.parseInt(days, 10)
  const budget = String(body.budget ?? "mid-range")
  const pace = String(body.pace ?? "balanced")
  const interests = Array.isArray(body.interests)
    ? body.interests.join(", ")
    : "nature, culture, food"

  if (process.env.GROQ_API_KEY) {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
          tool_choice: "required",
          tools: [{ type: "browser_search" }],
          messages: [
            {
              role: "system",
              content:
                "You are an Enugu-first Nigeria travel planning agent. Use web search for current opening, weather, transport, safety, and availability signals. Keep output concise, practical, and locally aware.",
            },
            {
              role: "user",
              content: `${enuguContext}
Create a ${days}-day ${budget} ${pace} itinerary for interests: ${interests}.
Return plain text with sections: Overview, Day-by-day, Transport notes, Food stops, Safety checks, What to verify today.`,
            },
          ],
        }),
      }
    )

    if (response.ok) {
      const data = await response.json()
      const text = data.choices?.[0]?.message?.content

      if (text) {
        return NextResponse.json({ plan: text, source: "web" })
      }
    }
  }

  const fallbackDays = [
    "Day 1: Enugu city orientation. Start with National Museum of Unity, Michael Okpara Square, local lunch with okpa or abacha, then sunset around Nike Lake.",
    "Day 2: Ngwo Pine Forest and cave. Go early, use a local guide, wear grip shoes, carry water, then return to town for dinner.",
    "Day 3: Awhum Waterfall or Ezeagu Tourist Complex. Pick one rural nature route, leave early, keep buffer time for road conditions, end with a calm food stop.",
    "Day 4: Add Milken Hills, Unity Park, and a slower food-led evening around Enugu city.",
    "Day 5: Keep a flexible buffer for Ezeagu, Awhum, or a wider Nigeria extension depending on weather and road timing.",
  ]
    .slice(0, Number.isFinite(dayCount) ? dayCount : 3)
    .join("\n")

  const fallback = `Overview
${days} day(s), ${budget} budget, ${pace} pace. Enugu-first plan for ${interests}. Configure GROQ_API_KEY to enable live web search.

Day-by-day
${fallbackDays}

Transport notes
Use a known local driver for rural legs. Avoid late returns from cave or waterfall routes.

Food stops
Try okpa, abacha, nkwobi, pepper soup, palm wine, and grilled fish depending on route.

Safety checks
Verify access, guide availability, rainfall, road condition, and daylight timing before leaving.

What to verify today
Opening/access status, current road conditions, local guide contact, weather, and total drive time.`

  return NextResponse.json({ plan: fallback, source: "fallback" })
}
