import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"

export async function GET() {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const conversations = await prisma.conversation.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    })

    return NextResponse.json({ conversations })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { title, messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 })
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: dbUser.id,
        title: title || "Trip planning session",
        messages: {
          create: messages.map((m: { role: string; content: unknown }) => ({
            role: m.role,
            content: m.content as any,
          })),
        },
      },
      include: { messages: true },
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}
