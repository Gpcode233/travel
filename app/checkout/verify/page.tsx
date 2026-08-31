"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, CancelCircleIcon, CompassIcon } from "@hugeicons/core-free-icons"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

type VerifyState = "loading" | "success" | "awaiting_verification" | "failed"

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<VerifyState>("loading")
  const [details, setDetails] = useState<{
    amount?: number
    email?: string
    tripId?: string
    hotelName?: string
    reference?: string
    paymentType?: string
  } | null>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")
    if (!reference) {
      router.replace("/agent")
      return
    }

    // Read tripId from the checkout sessionStorage payload
    let tripId: string | undefined
    try {
      const stored = sessionStorage.getItem("trails_checkout")
      if (stored) tripId = JSON.parse(stored)?.tripId
    } catch {}

    fetch(`/api/checkout/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success") {
          sessionStorage.removeItem("trails_checkout")
          setState("success")
          setDetails({
            amount: data.amount,
            email: data.email,
            tripId,
            hotelName: data.hotelName,
            reference,
            paymentType: data.paymentType,
          })
        } else if (data.status === "awaiting_transfer_verification") {
          sessionStorage.removeItem("trails_checkout")
          setState("awaiting_verification")
          setDetails({
            amount: data.amount,
            email: data.email,
            tripId,
            hotelName: data.hotelName,
            reference,
            paymentType: "bank_transfer",
          })
        } else {
          setState("failed")
        }
      })
      .catch(() => setState("failed"))
  }, [searchParams, router])

  function formatNGN(kobo: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(kobo / 100)
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-lg px-5 py-5 sm:px-8">
        <SiteHeader />

        <div className="mt-24 flex flex-col items-center gap-5 text-center">
          {state === "loading" && (
            <>
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72" />
            </>
          )}

          {state === "success" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-8 text-green-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold">
                  Congratulations! Your booking is secured and paid for.
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {details?.email && `Receipt sent to ${details.email}. `}
                  Your hotel is reserved and your airport pickup is arranged.
                </p>
                {details?.amount && (
                  <p className="mt-3 font-heading text-xl font-bold text-green-600">
                    {formatNGN(details.amount)} paid
                  </p>
                )}
              </div>
              <div className="mt-2 flex gap-3">
                <Button asChild>
                  <Link href={details?.tripId ? `/trips/${details.tripId}` : "/account"}>
                    View your trip
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Plan another trip</Link>
                </Button>
              </div>
            </>
          )}

          {state === "awaiting_verification" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-amber-100">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-8 text-amber-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold">
                  Transfer Received & Queued for Verification!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {details?.hotelName ? `Your reservation for ${details.hotelName} has been recorded. ` : "Your reservation has been recorded. "}
                  Our concierge team is immediately verifying your transfer.
                </p>
                {details?.amount && (
                  <p className="mt-3 font-heading text-xl font-bold text-foreground">
                    {formatNGN(details.amount)} transferred
                  </p>
                )}
                {details?.reference && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    Reference: {details.reference}
                  </p>
                )}
              </div>
              <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full justify-center">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  asChild
                >
                  <a
                    href={`https://wa.me/2347044206737?text=${encodeURIComponent(
                      `Hi Godspower / Trails Team, I sent ${
                        details?.amount ? formatNGN(details.amount) : "the funds"
                      } for my booking (Ref: ${
                        details?.reference || ""
                      }). Here is my payment receipt.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share Receipt on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={details?.tripId ? `/trips/${details.tripId}` : "/account"}>
                    View your trip
                  </Link>
                </Button>
              </div>
            </>
          )}

          {state === "failed" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <HugeiconsIcon icon={CancelCircleIcon} className="size-8 text-red-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold">
                  Sorry, please try again.
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your payment wasn&apos;t completed and your card was not charged.
                </p>
              </div>
              <div className="mt-2 flex gap-3">
                <Button asChild>
                  <Link href="/checkout">Try again</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/agent">Back to planner</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function CheckoutVerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
