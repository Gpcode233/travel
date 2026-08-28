import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "@/lib/prisma"

export async function getOrCreateDbUser() {
  const { getUser, isAuthenticated } = getKindeServerSession()
  const isAuthed = await isAuthenticated()
  if (!isAuthed) return null

  const user = await getUser()
  if (!user?.id || !user?.email) return null

  const name = [user.given_name, user.family_name].filter(Boolean).join(" ") || null

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      ...(name && { name }),
      ...(user.picture && { picture: user.picture }),
      ...(user.phone_number && { phone: user.phone_number }),
    },
    create: {
      id: user.id,
      email: user.email,
      name,
      picture: user.picture ?? null,
      phone: user.phone_number ?? null,
    },
  })
}
