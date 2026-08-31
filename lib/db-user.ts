import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

/**
 * Session-only user id, no DB round-trip. User.id is set to the Kinde user
 * id on creation (see getOrCreateDbUser), so read paths that only need the
 * id to scope a query (trip list, trip detail) can skip the DB entirely
 * instead of paying for a write (upsert) on every page view.
 */
export async function getSessionUserId(): Promise<string | null> {
  const { getUser, isAuthenticated } = getKindeServerSession()
  const isAuthed = await isAuthenticated()
  if (!isAuthed) return null
  const user = await getUser()
  return user?.id ?? null
}

export async function getOrCreateDbUser() {
  const { getUser, isAuthenticated } = getKindeServerSession()
  const isAuthed = await isAuthenticated()
  if (!isAuthed) return null

  const user = await getUser()
  if (!user?.id || !user?.email) return null

  const kindeName = [user.given_name, user.family_name].filter(Boolean).join(" ") || null

  let pendingPhone: string | null = null
  let pendingName: string | null = null

  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get("trails_pending_profile")?.value
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.phone) pendingPhone = parsed.phone
      if (parsed.name) pendingName = parsed.name
    }
  } catch {}

  const resolvedName = kindeName || pendingName || null
  const resolvedPhone = user.phone_number || pendingPhone || null

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      ...(resolvedName && { name: resolvedName }),
      ...(user.picture && { picture: user.picture }),
      ...(resolvedPhone && { phone: resolvedPhone }),
    },
    create: {
      id: user.id,
      email: user.email,
      name: resolvedName,
      picture: user.picture ?? null,
      phone: resolvedPhone,
    },
  })
}
