"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Building2,
  Copy,
  Check,
  CreditCard,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
} from "lucide-react"

type BankTransferModalProps = {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  hotelName: string
  hotelArea?: string
  nights: number
  pricePerNight: number
  accommodationTotal: number
  serviceFee: number
  tripId?: string
  userEmail?: string | null
  userName?: string | null
  userPhone?: string | null
}

const BANK_DETAILS = {
  accountNumber: "2373387052",
  accountName: "Ojini Godspower",
  bankName: "United Bank for Africa (UBA)",
  whatsappPhone: "2347044206737",
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function BankTransferModal({
  isOpen,
  onClose,
  totalAmount,
  hotelName,
  hotelArea,
  nights,
  pricePerNight,
  accommodationTotal,
  serviceFee,
  tripId,
  userEmail,
  userName,
  userPhone,
}: BankTransferModalProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string
    bookingId: string
  } | null>(null)

  function copyAccountNumber() {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber)
    setCopied(true)
    toast.success("Account number copied to clipboard")
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleConfirmPaymentSent() {
    setSubmitting(true)
    try {
      const res = await fetch("/api/checkout/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          hotelName,
          hotelArea,
          nights,
          pricePerNight,
          accommodationTotal,
          serviceFee,
          totalAmount,
          customerName: userName,
          customerPhone: userPhone,
          customerEmail: userEmail,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to record bank transfer.")
      }

      sessionStorage.removeItem("trails_checkout")
      setConfirmedBooking({
        reference: data.reference,
        bookingId: data.bookingId,
      })
      toast.success("Transfer notification sent to team!")
    } catch (err: any) {
      toast.error(err.message || "Failed to submit. Please try again or contact us.")
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappMessage = confirmedBooking
    ? encodeURIComponent(
        `Hi Godspower / Trails Team! I just transferred ${formatNGN(
          totalAmount
        )} for my hotel booking at ${hotelName} (Ref: ${
          confirmedBooking.reference
        }). Here is my payment receipt.`
      )
    : encodeURIComponent(
        `Hi Godspower / Trails Team! I am making a transfer of ${formatNGN(
          totalAmount
        )} for my hotel booking at ${hotelName}.`
      )

  const whatsappUrl = `https://wa.me/${BANK_DETAILS.whatsappPhone}?text=${whatsappMessage}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 sm:p-7">
        {!confirmedBooking ? (
          <>
            <DialogHeader className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Building2 className="size-3 text-primary" />
                  Direct Bank Transfer
                </Badge>
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Instant Verification
                </Badge>
              </div>
              <DialogTitle className="font-heading text-xl font-bold">
                Pay via Bank Transfer
              </DialogTitle>
              <DialogDescription className="text-xs">
                Transfer the exact amount below to secure your hotel reservation and free airport pickup.
              </DialogDescription>
            </DialogHeader>

            {/* Total Amount Callout */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount to Transfer</p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {formatNGN(totalAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">For</p>
                  <p className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                    {hotelName}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Account Details Card */}
            <div className="space-y-3 rounded-2xl border border-border bg-card p-4 text-card-foreground">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Bank Name</span>
                <span className="font-semibold text-sm">{BANK_DETAILS.bankName}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold tracking-wider text-primary">
                    {BANK_DETAILS.accountNumber}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={copyAccountNumber}
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Account Name</span>
                <span className="font-semibold text-sm">{BANK_DETAILS.accountName}</span>
              </div>
            </div>

            {/* Transfer Instructions Note */}
            <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                How to finalize your booking:
              </p>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed">
                <li>Make a transfer of <strong>{formatNGN(totalAmount)}</strong> to the UBA account above.</li>
                <li>Click the <strong>&quot;I have sent the money&quot;</strong> button below once done.</li>
                <li>Our concierge team will immediately verify and follow up with you on WhatsApp!</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                size="lg"
                disabled={submitting}
                onClick={handleConfirmPaymentSent}
                className="w-full bg-primary py-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 animate-spin" />
                    Notifying team & verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    I have sent the money
                  </span>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Need instant assistance? Reach us at{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  WhatsApp Concierge
                </a>
              </p>
            </div>
          </>
        ) : (
          /* Confirmation Success State */
          <div className="py-2 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold">
                Transfer Notification Received!
              </h2>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Thank you! Our concierge team has been alerted and is immediately verifying your transfer of{" "}
                <strong>{formatNGN(totalAmount)}</strong> for <strong>{hotelName}</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Booking Reference:</span>
                <span className="font-mono font-bold text-foreground">
                  {confirmedBooking.reference}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-amber-600">Awaiting Verification</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 text-sm font-semibold"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Send Payment Receipt on WhatsApp
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose()
                    router.push(tripId ? `/trips/${tripId}` : "/account")
                  }}
                >
                  View Trip
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onClose()
                    router.push("/account")
                  }}
                >
                  Go to Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
