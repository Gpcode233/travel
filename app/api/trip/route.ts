import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"

export async function POST(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to save trips." }, { status: 401 })
    }

    const body = await req.json()
    const { itinerary, title } = body

    if (!itinerary) {
      return NextResponse.json({ error: "Missing itinerary data." }, { status: 400 })
    }

    const trip = await prisma.trip.create({
      data: { userId: dbUser.id, itinerary, title: title?.trim() || null },
    })

    return NextResponse.json({ success: true, trip }, { status: 201 })
  } catch (error: any) {
    console.error("Error saving trip:", error)
    return NextResponse.json({ error: error?.message || "Failed to save trip." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to view trips." }, { status: 401 })
    }

    const dbUserWithTrips = await prisma.user.findUnique({
      where: { email: dbUser.email },
      include: { trips: { orderBy: { createdAt: "desc" } } },
    })

    return NextResponse.json({ trips: dbUserWithTrips?.trips || [] })
  } catch (error: any) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ error: error?.message || "Failed to fetch trips." }, { status: 500 })
  }
}
