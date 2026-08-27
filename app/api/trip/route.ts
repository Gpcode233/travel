import { NextResponse } from "next/server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession()
    const isAuthed = await isAuthenticated()

    if (!isAuthed) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to save trips." },
        { status: 401 }
      )
    }

    const user = await getUser()
    if (!user || !user.id || !user.email) {
      return NextResponse.json(
        { error: "User profile could not be resolved." },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { itinerary } = body

    if (!itinerary) {
      return NextResponse.json(
        { error: "Missing itinerary data." },
        { status: 400 }
      )
    }

    // Ensure user exists in our Neon PostgreSQL database
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
      },
    })

    // Save trip
    const trip = await prisma.trip.create({
      data: {
        userId: dbUser.id,
        itinerary: itinerary,
      },
    })

    return NextResponse.json({ success: true, trip }, { status: 201 })
  } catch (error: any) {
    console.error("Error saving trip:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to save trip to database." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession()
    const isAuthed = await isAuthenticated()

    if (!isAuthed) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to view trips." },
        { status: 401 }
      )
    }

    const user = await getUser()
    if (!user || !user.email) {
      return NextResponse.json({ trips: [] })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        trips: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return NextResponse.json({ trips: dbUser?.trips || [] })
  } catch (error: any) {
    console.error("Error fetching trips:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch trips." },
      { status: 500 }
    )
  }
}
