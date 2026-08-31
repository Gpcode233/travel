import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    if (reference.startsWith("TRF-")) {
      const booking = await prisma.booking.findFirst({
        where: { paystackReference: reference },
        include: { user: true },
      })

      if (!booking) {
        return NextResponse.json({ error: "Booking reference not found." }, { status: 404 })
      }

      return NextResponse.json({
        status: booking.paystackStatus, // e.g. "awaiting_transfer_verification" or "success"
        amount: booking.totalAmountKobo,
        email: booking.user.email,
        hotelName: booking.hotelName,
        nights: booking.nights,
        reference,
        paymentType: "bank_transfer",
      })
    }

    const secretKey =
      process.env.PAYSTACK_LIVE_SECRET_KEY ??
      process.env.PAYSTACK_SECRET_KEY ??
      process.env.PAYSTACK_TEST_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: "Payment service not configured." }, { status: 500 })
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })

    const paystackData = await paystackRes.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: "Verification failed." }, { status: 502 })
    }

    const { status: txStatus, amount, customer } = paystackData.data

    await prisma.booking.updateMany({
      where: { paystackReference: reference },
      data: { paystackStatus: txStatus },
    })

    return NextResponse.json({
      status: txStatus,
      amount,
      email: customer?.email,
      reference,
      paymentType: "card",
    })
  } catch (error: any) {
    console.error("Checkout verify error:", error)
    return NextResponse.json({ error: error?.message || "Verification failed." }, { status: 500 })
  }
}
