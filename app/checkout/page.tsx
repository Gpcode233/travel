"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BedIcon,
  SpoonAndForkIcon,
  Car01Icon,
  Ticket01Icon,
  InformationCircleIcon,
  GiftIcon,
} from "@hugeicons/core-free-icons"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { getServiceFeeRate, calculateServiceFee } from "@/lib/pricing"
import { BankTransferModal } from "@/components/bank-transfer-modal"
import Link from "next/link"
import { Building2, CreditCard } from "lucide-react"

type CheckoutData = {
  tripId?: string
  hotelName: string
  hotelArea?: string
  nights: number
  pricePerNight: number
  accommodationTotal: number
  budgetBreakdown?: {
    food?: number
    transport?: number
    activities?: number
  }
  dossier?: {
    destination: string
    travelersLabel: string
    dateRangeLabel: string
    daysCount: number
  }
  isTestTrip?: boolean
}

// const EASTER_EGG_EMAIL = "godspowerojini8@gmail.com"

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient()
  const [data, setData] = useState<CheckoutData | null>(() => {
    if (typeof window === "undefined") return null
    const raw = sessionStorage.getItem("trails_checkout")
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  })
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [isPaystackLoading, setIsPaystackLoading] = useState(false)
  const [paystackError, setPaystackError] = useState<string | null>(null)

  useEffect(() => {
    if (!data) router.replace("/agent")
  }, [data, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/auth/profile-sync")
        .then((r) => r.json())
        .then((data) => {
          if (data?.user?.phone) setUserPhone(data.user.phone)
        })
        .catch(() => {})
    }
  }, [isAuthenticated])

  async function handlePaystackCheckout() {
    if (!data) return
    setIsPaystackLoading(true)
    setPaystackError(null)

    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: data.tripId,
          hotelName: data.hotelName,
          hotelArea: data.hotelArea,
          nights: data.nights,
          pricePerNight: data.pricePerNight,
          accommodationTotal: data.accommodationTotal,
          serviceFee,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.authorization_url) {
        throw new Error(json.error || "Failed to initialize payment.")
      }

      window.location.href = json.authorization_url
    } catch (err: any) {
      console.error("Paystack checkout error:", err)
      setPaystackError(err.message || "Could not connect to payment gateway. Please try again.")
      setIsPaystackLoading(false)
    }
  }

  if (isLoading || !data) {
    return (
      <main className="min-h-svh bg-background">
        <div className="mx-auto max-w-2xl px-5 py-5 sm:px-8">
          <SiteHeader />
          <div className="mt-12 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-svh bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-5 py-5 sm:px-8">
          <SiteHeader />
          <div className="mt-24 flex flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-2xl font-semibold">Sign in to complete your booking</h1>
            <p className="text-sm text-muted-foreground">We need your account details to confirm your reservation and arrange airport pickup.</p>
            <Button size="lg" className="mt-2" asChild>
              <Link href="/login?post_login_redirect_url=/checkout">
                Sign in to continue
              </Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const serviceFeeRate = data.isTestTrip ? 0 : getServiceFeeRate(data.accommodationTotal)
  const serviceFee = data.isTestTrip ? 0 : calculateServiceFee(data.accommodationTotal)
  const totalToPay = data.accommodationTotal + serviceFee

  const budgetItems = [
    { key: "food", label: "Food & dining", icon: SpoonAndForkIcon, amount: data.budgetBreakdown?.food },
    { key: "transport", label: "Local transport", icon: Car01Icon, amount: data.budgetBreakdown?.transport },
    { key: "activities", label: "Activities & entry fees", icon: Ticket01Icon, amount: data.budgetBreakdown?.activities },
  ].filter((item) => item.amount)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-5 sm:px-8">
        <SiteHeader />

        <div className="mt-10">
          <p className="text-xs tracking-[.14em] text-muted-foreground uppercase">Secure checkout</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold">Your booking summary</h1>
          {data.dossier && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.dossier.destination} · {data.dossier.dateRangeLabel} · {data.dossier.travelersLabel}
            </p>
          )}
        </div>

        {/* Free airport pickup incentive */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HugeiconsIcon icon={GiftIcon} className="size-4.5" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">
              Gift from us: Free Airport Pickup
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Book this stay and we&apos;ll drive you from the airport straight to your hotel — no extra charge, already covered by your booking.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Hotel — what you're paying for */}
          <div className="rounded border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded bg-blue-50">
                <HugeiconsIcon icon={BedIcon} className="size-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-heading font-semibold">{data.hotelName}</p>
                    {data.hotelArea && (
                      <p className="text-xs text-muted-foreground">{data.hotelArea}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">Accommodation</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Per night</p>
                    <p className="font-mono font-medium">{formatNGN(data.pricePerNight)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nights</p>
                    <p className="font-mono font-medium">{data.nights}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <p className="font-mono font-medium">{formatNGN(data.accommodationTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service fee */}
          <div className="rounded border border-border px-5 py-3.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Trails service fee</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{(serviceFeeRate * 100).toFixed(1).replace(/\.0$/, "")}%</span>
              </div>
              <span className="font-mono font-medium">{formatNGN(serviceFee)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="rounded border border-foreground/20 bg-foreground px-5 py-4 text-background">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold">Total to pay</p>
              <p className="font-heading text-2xl font-bold">{formatNGN(totalToPay)}</p>
            </div>
            <p className="mt-0.5 text-xs text-background/60">Charged in NGN via Paystack</p>
          </div>
        </div>

        {/* Budget estimates (not charged) */}
        {budgetItems.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-muted-foreground">Estimated trip costs (not charged)</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              These are budget estimates to help you plan. You pay these directly during your trip.
            </p>
            <div className="mt-3 divide-y divide-border/60 rounded border border-border">
              {budgetItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HugeiconsIcon icon={item.icon} className="size-3.5" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">~{formatNGN(item.amount!)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pay buttons */}
        <div className="mt-8 space-y-3">
          {paystackError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {paystackError}
            </div>
          )}

          <Button
            type="button"
            onClick={handlePaystackCheckout}
            disabled={isPaystackLoading}
            className="w-full bg-primary py-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="size-4" />
              {isPaystackLoading ? "Connecting to Paystack..." : `Pay ${formatNGN(totalToPay)} with Card / Paystack`}
            </span>
          </Button>

          {/* Bank Transfer button - commented out
          <Button
            type="button"
            onClick={() => setTransferModalOpen(true)}
            variant="outline"
            className="w-full py-5 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <Building2 className="size-4" />
              Pay {formatNGN(totalToPay)} with Bank Transfer
            </span>
          </Button>
          */}

          <p className="text-center text-xs text-muted-foreground">
            Secured by Paystack · Card, USSD, and Bank Transfer available on checkout
          </p>
        </div>

        {/* Bank Transfer Modal Popup - commented out
        <BankTransferModal
          isOpen={transferModalOpen}
          onClose={() => setTransferModalOpen(false)}
          totalAmount={totalToPay}
          hotelName={data.hotelName}
          hotelArea={data.hotelArea}
          nights={data.nights}
          pricePerNight={data.pricePerNight}
          accommodationTotal={data.accommodationTotal}
          serviceFee={serviceFee}
          tripId={data.tripId}
          userEmail={user?.email}
          userName={[user?.given_name, user?.family_name].filter(Boolean).join(" ")}
          userPhone={userPhone}
        />
        */}
      </div>
    </main>
  )
}
