"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  WhatsappLogo,
  ArrowRight,
} from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";
import { RegistrationFormData } from "@/lib/validation";

interface SuccessStateProps {
  data: RegistrationFormData;
}

export default function SuccessState({ data }: SuccessStateProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(data.registrationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs text-center space-y-8">
        {/* Celebration Icon */}
        <div className="size-20 rounded-full bg-purple-950/10 text-purple-950 mx-auto flex items-center justify-center">
          <CheckCircle size={48} weight="fill" className="text-purple-950" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
            You&apos;re Registered!
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Your registration has been successfully completed.
          </p>
        </div>

        {/* Registration Code Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-purple-950/5 border-2 border-dashed border-purple-950/30 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-950">
            Official Registration Code
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-purple-950 tracking-wider">
              {data.registrationCode}
            </span>
            <button
              onClick={copyCode}
              type="button"
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? "bg-purple-950 text-white"
                  : "bg-white border border-zinc-300 text-zinc-700 hover:bg-purple-950 hover:text-white"
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
          <p className="text-xs text-zinc-600 font-medium">
            Please keep this code safe for check-in on event day.
          </p>
        </div>

        {/* Participant & Event Summary Details */}
        <div className="p-4 sm:p-5 rounded-2xl border border-zinc-100 bg-zinc-50/70 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-1 border-b border-zinc-200/60">
            <span className="text-zinc-600">Participant:</span>
            <span className="font-semibold text-zinc-900">{data.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-200/60">
            <span className="text-zinc-600">Track / Category:</span>
            <span className="font-semibold text-zinc-900 text-right">
              {data.categoryOfInterest}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-200/60">
            <span className="text-zinc-600">Date:</span>
            <span className="font-semibold text-zinc-900">{eventConfig.date}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-zinc-600">Location:</span>
            <span className="font-semibold text-zinc-900">{eventConfig.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={`https://wa.me/${
              eventConfig.whatsapp.cleanNumber
            }?text=${encodeURIComponent(
              `Hello organizer, I have successfully completed my registration for ${eventConfig.name}. My registration code is ${data.registrationCode}. My name is ${data.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-purple-950 hover:bg-purple-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <WhatsappLogo size={18} weight="fill" />
            <span>Contact Organizer on WhatsApp</span>
          </a>

          <Link
            href="/"
            className="w-full py-3 px-6 rounded-full border border-zinc-200 hover:border-purple-950 text-zinc-700 hover:text-purple-950 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Back to Event Homepage</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
