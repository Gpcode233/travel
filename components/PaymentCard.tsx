"use client";

import { useState } from "react";
import { Copy, Check, Bank, User, Hash, Ticket } from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

export default function PaymentCard() {
  const [copied, setCopied] = useState(false);

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(eventConfig.payment.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl border-2 border-purple-950/20 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Fee Display Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/5 border border-purple-950/10">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-purple-950 text-white flex items-center justify-center">
            <Ticket size={18} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-950">
              Registration Fee
            </p>
            <p className="text-xs text-zinc-600">Exact amount to transfer</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-serif text-2xl sm:text-3xl font-bold text-purple-950">
            {eventConfig.feeFormatted}
          </span>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Transfer Details
          </span>
          <span className="text-[11px] font-medium text-purple-950 bg-purple-950/5 px-2 py-0.5 rounded-md">
            Direct Bank Transfer
          </span>
        </div>

        {/* Bank Name */}
        <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-600">
            <Bank size={18} className="text-zinc-600" />
            <span className="text-xs sm:text-sm font-medium">Bank</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-zinc-900 tracking-wide text-right">
            {eventConfig.payment.bankName}
          </span>
        </div>

        {/* Account Name */}
        <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-600">
            <User size={18} className="text-zinc-600" />
            <span className="text-xs sm:text-sm font-medium">Account Name</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight text-right uppercase">
            {eventConfig.payment.accountName}
          </span>
        </div>

        {/* Account Number with Copy Button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-zinc-600">
            <Hash size={18} className="text-zinc-600" />
            <span className="text-xs sm:text-sm font-medium">Account Number</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-purple-950">
              {eventConfig.payment.accountNumber}
            </span>
            <button
              onClick={copyAccountNumber}
              type="button"
              aria-label="Copy Account Number"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? "bg-purple-950 text-white shadow-xs"
                  : "bg-zinc-100 hover:bg-purple-950 hover:text-white text-zinc-700"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} weight="bold" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} weight="bold" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
