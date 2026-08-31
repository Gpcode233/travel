import { NextResponse } from "next/server"
import { getOrCreateDbUser } from "@/lib/db-user"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        picture: dbUser.picture,
      },
    })
  } catch (error: any) {
    console.error("Profile sync GET error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone } = body

    const dbUser = await getOrCreateDbUser()
    if (dbUser) {
      const updated = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          ...(name?.trim() && { name: name.trim() }),
          ...(phone?.trim() && { phone: phone.trim() }),
        },
      })
      return NextResponse.json({ success: true, user: updated })
    }

    // If not yet authenticated, save profile details in cookie for post-auth sync
    const cookieStore = await cookies()
    cookieStore.set(
      "trails_pending_profile",
      JSON.stringify({ name: name?.trim(), phone: phone?.trim() }),
      {
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false,
        sameSite: "lax",
      }
    )

    return NextResponse.json({ success: true, pending: true })
  } catch (error: any) {
    console.error("Profile sync POST error:", error)
    return NextResponse.json({ error: error?.message || "Failed to update profile" }, { status: 500 })
  }
}
