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

type VerifyState = "loading" | "success" | "failed"

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<VerifyState>("loading")
  const [details, setDetails] = useState<{ amount?: number; email?: string } | null>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")
    if (!reference) {
      router.replace("/agent")
      return
    }

    fetch(`/api/checkout/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success") {
          setState("success")
          setDetails({ amount: data.amount, email: data.email })
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
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-8 text-green-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold">Booking confirmed!</h1>
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
                  <Link href="/account">View bookings</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/agent">Plan another trip</Link>
                </Button>
              </div>
            </>
          )}

          {state === "failed" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <HugeiconsIcon icon={CancelCircleIcon} className="size-8 text-red-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold">Payment not completed</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your card was not charged. You can try again or contact us for help.
                </p>
              </div>
              <div className="mt-2 flex gap-3">
                <Button asChild>
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
