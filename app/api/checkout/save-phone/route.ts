import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"

export async function POST(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const { phone }: { phone?: string } = await req.json()
    const digits = (phone || "").replace(/[^\d]/g, "")
    if (digits.length < 10 || digits.length > 15) {
      return NextResponse.json({ error: "Enter a valid WhatsApp number." }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { phone },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("save-phone error:", error)
    return NextResponse.json({ error: error?.message ?? "Failed to save number." }, { status: 500 })
  }
}
