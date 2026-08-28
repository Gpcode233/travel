"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Key,
  ArrowRight,
  CircleNotch,
  WarningCircle,
  ShieldCheck,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

interface CodeVerificationProps {
  onVerified: (code: string) => void;
}

export default function CodeVerification({ onVerified }: CodeVerificationProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMessage("Please enter your registration code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setErrorMessage(
          data.message ||
            "This registration code is invalid. Please check the code sent to you by the organizer."
        );
        return;
      }

      // Successful verification
      onVerified(cleanCode);
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage(
        "Network error. Could not connect to verification server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs text-center space-y-6">
        {/* Lock Icon */}
        <div className="size-14 rounded-2xl bg-purple-950/10 text-purple-950 mx-auto flex items-center justify-center">
          <Key size={28} weight="duotone" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            Enter Your Registration Code
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Your payment must be verified by the organizer before you can register.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="regCodeInput"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5"
            >
              Registration Code
            </label>
            <input
              id="regCodeInput"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. YIP-847291"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck="false"
              className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20 font-mono text-base tracking-widest text-center uppercase text-purple-950 font-bold placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 outline-hidden transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-purple-950/5 border border-purple-950/20 flex items-start gap-2.5 text-xs text-purple-950 leading-relaxed">
              <WarningCircle size={18} weight="fill" className="shrink-0 text-purple-950 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full py-4 px-6 rounded-full bg-purple-950 hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <CircleNotch size={18} className="animate-spin" />
                <span>Verifying code...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={16} weight="bold" />
              </>
            )}
          </button>
        </form>

        {/* Helpful Guidance Links */}
        <div className="pt-4 border-t border-zinc-100 space-y-3 text-xs text-zinc-600">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-purple-950" />
            <span>Codes are unique & single-use only</span>
          </div>

          <p>
            Haven&apos;t paid yet?{" "}
            <Link
              href="/payment"
              className="font-semibold text-purple-950 hover:underline"
            >
              Pay ₦5,000 to get a code →
            </Link>
          </p>

          <p>
            Paid but have not received your code?{" "}
            <a
              href={eventConfig.whatsapp.getLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-950 hover:underline inline-flex items-center gap-1"
            >
              <WhatsappLogo size={13} weight="fill" />
              <span>Message organizer on WhatsApp</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
