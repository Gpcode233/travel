import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"

export async function GET() {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const prefs = await prisma.userPreferences.upsert({
      where: { userId: dbUser.id },
      update: {},
      create: { userId: dbUser.id },
    })

    return NextResponse.json({ preferences: prefs })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { theme, currency } = body

    const prefs = await prisma.userPreferences.upsert({
      where: { userId: dbUser.id },
      update: {
        ...(theme !== undefined && { theme }),
        ...(currency !== undefined && { currency }),
      },
      create: { userId: dbUser.id, theme, currency },
    })

    return NextResponse.json({ preferences: prefs })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}
