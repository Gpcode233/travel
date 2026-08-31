import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/db-user"

export async function POST(req: Request) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    }: {
      tripId?: string
      hotelName: string
      hotelArea?: string
      nights: number
      pricePerNight: number
      accommodationTotal: number
      serviceFee: number
    } = body

    const totalNGN = accommodationTotal + serviceFee
    const amountKobo = totalNGN * 100

    const secretKey =
      process.env.PAYSTACK_LIVE_SECRET_KEY ??
      process.env.PAYSTACK_SECRET_KEY ??
      process.env.PAYSTACK_TEST_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: "Payment service not configured." }, { status: 500 })
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/verify`

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: dbUser.email,
        amount: amountKobo,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          custom_fields: [
            { display_name: "Hotel", variable_name: "hotel", value: hotelName },
            { display_name: "Nights", variable_name: "nights", value: nights },
          ],
        },
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message || "Payment init failed." }, { status: 502 })
    }

    const { authorization_url, reference } = paystackData.data

    await prisma.booking.create({
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
        paystackStatus: "pending",
      },
    })

    return NextResponse.json({ authorization_url, reference })
  } catch (error: any) {
    console.error("Checkout initialize error:", error)
    return NextResponse.json({ error: error?.message || "Failed to initialize payment." }, { status: 500 })
  }
}
