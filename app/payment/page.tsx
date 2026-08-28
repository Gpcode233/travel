import { Metadata } from "next";
import Link from "next/link";
import PaymentCard from "@/components/PaymentCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProgressIndicator from "@/components/ProgressIndicator";
import {
  ShieldCheck,
  ArrowRight,
  Receipt,
  WhatsappLogo,
  Key,
  CreditCard,
} from "@phosphor-icons/react/dist/ssr";
import { eventConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Complete Your Payment",
  description:
    "Make your ₦5,000 bank transfer and verify with the organizer on WhatsApp to receive your registration code.",
};

export default function PaymentPage() {
  const steps = [
    {
      num: "01",
      title: "Make your transfer",
      description: `Transfer the exact registration fee (${eventConfig.feeFormatted}) to the PalmPay bank account provided below.`,
    },
    {
      num: "02",
      title: "Save your receipt",
      description:
        "Take a clear screenshot or save the transaction receipt from your banking app.",
    },
    {
      num: "03",
      title: "Contact the organizer",
      description:
        "Click the WhatsApp button below to open a direct chat with the organizer and attach your receipt.",
    },
    {
      num: "04",
      title: "Receive your code",
      description:
        "The organizer will confirm your payment and provide your unique single-use registration code.",
    },
  ];

  return (
    <main className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Progress Tracker */}
        <ProgressIndicator currentStep={1} />

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/5 border border-purple-950/15 text-purple-950 text-xs font-semibold uppercase tracking-wider">
            <span>Step 1 of 3</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
            Complete Your Payment
          </h1>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-zinc-600 font-medium">
            Registration is only available after your payment has been verified by the organizer.
          </p>
        </div>

        {/* Payment Card Component */}
        <PaymentCard />

        {/* Payment Instructions: How it works */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900">
              How It Works
            </h2>
            <span className="text-xs text-zinc-600 font-semibold uppercase tracking-widest">
              4 Easy Steps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="space-y-1.5 flex gap-3.5">
                <span className="font-serif text-2xl font-bold text-purple-950 shrink-0">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{s.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Action Area */}
        <div className="text-center space-y-4 pt-2">
          <WhatsAppButton className="w-full sm:w-auto" />
          <p className="text-xs text-zinc-600">
            Clicking will open WhatsApp with your pre-composed message ready to attach your receipt.
          </p>
        </div>

        {/* Important Notice Callout */}
        <div className="p-4 sm:p-5 rounded-xl border border-purple-950/20 bg-purple-950/5 flex items-start gap-3">
          <ShieldCheck size={20} weight="fill" className="text-purple-950 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-purple-950 leading-relaxed">
            <span className="font-bold">Important Notice: </span>
            You cannot complete registration until your payment has been verified and you receive a registration code from the organizer.
          </div>
        </div>

        {/* Navigation to /register if already have code */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-zinc-900">
              Already received your registration code?
            </p>
            <p className="text-xs text-zinc-600">
              Proceed to unlock and complete your registration form.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-950 text-purple-950 hover:bg-purple-950 hover:text-white text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
          >
            <span>Enter Registration Code</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </main>
  );
}
