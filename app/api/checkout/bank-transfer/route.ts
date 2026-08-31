import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"
import { sendBankTransferAdminAlert } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to confirm transfer." }, { status: 401 })
    }

    const body = await req.json()
    const {
      tripId,
      hotelName,
      hotelArea,
      nights,
      pricePerNight,
      accommodationTotal,
      serviceFee,
      totalAmount,
      customerName,
      customerPhone,
    }: {
      tripId?: string
      hotelName: string
      hotelArea?: string
      nights: number
      pricePerNight: number
      accommodationTotal: number
      serviceFee: number
      totalAmount: number
      customerName?: string
      customerPhone?: string
    } = body

    const totalNGN = totalAmount || (accommodationTotal + serviceFee)
    const amountKobo = Math.round(totalNGN * 100)

    // Generate readable bank transfer reference
    const timestamp = Date.now().toString(36).toUpperCase()
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const reference = `TRF-${timestamp}-${randomSuffix}`

    // Update user's name or phone if provided
    if ((customerName || customerPhone) && dbUser.id) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          ...(customerName && !dbUser.name ? { name: customerName } : {}),
          ...(customerPhone ? { phone: customerPhone } : {}),
        },
      }).catch((e) => console.warn("Could not update user phone/name:", e))
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        userId: dbUser.id,
        tripId: tripId ?? null,
        hotelName,
        hotelArea: hotelArea ?? null,
        nights,
        pricePerNight,
        accommodationTotal,
        serviceFee,
        totalAmountKobo: amountKobo,
        paystackReference: reference,
        paystackStatus: "awaiting_transfer_verification",
      },
    })

    // Team Notification Listener (Console Log)
    const notificationPayload = {
      event: "BANK_TRANSFER_PAYMENT_SUBMITTED",
      timestamp: new Date().toISOString(),
      reference,
      bookingId: booking.id,
      customer: {
        id: dbUser.id,
        name: customerName || dbUser.name || "Customer",
        email: dbUser.email,
        phone: customerPhone || dbUser.phone || "Not provided",
      },
      bookingDetails: {
        hotelName,
        hotelArea,
        nights,
        totalNGN,
        tripId,
      },
    }

    console.log("==================================================")
    console.log("🔔 [TEAM ALERT] NEW BANK TRANSFER PAYMENT SUBMITTED!")
    console.log(JSON.stringify(notificationPayload, null, 2))
    console.log("==================================================")

    // Trigger Email Alert to Admin
    sendBankTransferAdminAlert({
      reference,
      bookingId: booking.id,
      hotelName,
      hotelArea,
      nights,
      totalNGN,
      customerName: customerName || dbUser.name || "Customer",
      customerEmail: dbUser.email,
      customerPhone: customerPhone || dbUser.phone,
      tripId,
    }).catch((err) => console.error("Admin email alert trigger error:", err))

    // Optional webhook or external alert trigger if configured
    const webhookUrl = process.env.TEAM_NOTIFICATION_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🚨 **New Bank Transfer Submitted!**\n**Customer:** ${notificationPayload.customer.name} (${notificationPayload.customer.phone})\n**Hotel:** ${hotelName} (${nights} nights)\n**Amount:** ₦${totalNGN.toLocaleString()}\n**Reference:** \`${reference}\``,
        }),
      }).catch((err) => console.error("Webhook notification error:", err))
    }

    return NextResponse.json({
      success: true,
      reference,
      bookingId: booking.id,
      status: "awaiting_transfer_verification",
    })
  } catch (error: any) {
    console.error("Bank transfer checkout error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to process bank transfer request." },
      { status: 500 }
    )
  }
}
