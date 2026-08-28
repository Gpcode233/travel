"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  ShieldCheck,
} from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

export default function EventHero() {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-950/15 bg-purple-950/5 text-purple-950 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="size-1.5 rounded-full bg-purple-950 animate-pulse" />
          <span>{eventConfig.eyebrow}</span>
        </div>

        {/* Playfair Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6">
          {eventConfig.headline}
        </h1>

        {/* Concise Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-600 font-normal leading-relaxed mb-6">
          {eventConfig.description}
        </p>

        {/* Topic Highlight Box */}
        <div className="inline-block max-w-xl mx-auto px-5 py-3 rounded-xl bg-purple-950/5 border border-purple-950/10 mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-950 mb-0.5">
            Event Topic
          </p>
          <p className="font-serif text-lg sm:text-xl font-bold text-purple-950">
            {eventConfig.topic}
          </p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10 text-left">
          {/* Date */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <div className="size-8 rounded-lg bg-purple-950/10 text-purple-950 flex items-center justify-center mb-2.5">
              <Calendar size={18} weight="duotone" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              Date
            </p>
            <p className="text-sm font-semibold text-zinc-900 mt-0.5">
              {eventConfig.date}
            </p>
          </div>

          {/* Time */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <div className="size-8 rounded-lg bg-purple-950/10 text-purple-950 flex items-center justify-center mb-2.5">
              <Clock size={18} weight="duotone" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              Time
            </p>
            <p className="text-sm font-semibold text-zinc-900 mt-0.5">
              {eventConfig.time}
            </p>
          </div>

          {/* Location */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <div className="size-8 rounded-lg bg-purple-950/10 text-purple-950 flex items-center justify-center mb-2.5">
              <MapPin size={18} weight="duotone" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              Location
            </p>
            <p className="text-sm font-semibold text-zinc-900 mt-0.5">
              {eventConfig.location}
            </p>
          </div>

          {/* Fee */}
          <div className="p-4 rounded-xl border border-purple-950/20 bg-purple-950/5">
            <div className="size-8 rounded-lg bg-purple-950 text-white flex items-center justify-center mb-2.5">
              <Ticket size={18} weight="duotone" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-purple-950">
              Registration Fee
            </p>
            <p className="text-base font-bold text-purple-950 mt-0.5">
              {eventConfig.feeFormatted}
            </p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/payment"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full bg-purple-950 hover:bg-purple-900 text-white text-base font-semibold tracking-wide shadow-md hover:shadow-lg transition-all hover:gap-4 active:scale-[0.98]"
          >
            <span>Pay to Register</span>
            <ArrowRight size={18} weight="bold" />
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <ShieldCheck size={14} className="text-purple-950" />
            <span>Payment required before registration code is issued</span>
          </div>
        </div>
      </div>
    </section>
  );
}
