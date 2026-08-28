"use client";

import Link from "next/link";
import {
  Sparkle,
  ChatsCircle,
  UsersThree,
  ArrowRight,
  ShieldCheck,
} from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

export default function EventDetails() {
  const iconMap = [
    <Sparkle key="1" size={24} weight="duotone" className="text-purple-950" />,
    <ChatsCircle key="2" size={24} weight="duotone" className="text-purple-950" />,
    <UsersThree key="3" size={24} weight="duotone" className="text-purple-950" />,
  ];

  return (
    <section className="py-12 sm:py-20 border-t border-zinc-100 bg-zinc-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-950">
            About the Program
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            Cultivating Vision, Equipping Leaders
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            {eventConfig.about}
          </p>
        </div>

        {/* What to Expect 3 Pillars */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-950">
              Program Highlights
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
              What to Expect
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventConfig.whatToExpect.map((item, idx) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:border-purple-950/30 transition-all space-y-3"
              >
                <div className="size-10 rounded-xl bg-purple-950/10 flex items-center justify-center">
                  {iconMap[idx] || iconMap[0]}
                </div>
                <h4 className="font-serif text-lg font-bold text-zinc-900">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Bottom Prompt */}
        <div className="p-6 sm:p-8 rounded-2xl bg-purple-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold">
              Ready to secure your seat?
            </h4>
            <p className="text-xs sm:text-sm text-purple-200">
              Registration fee is {eventConfig.feeFormatted}. Pay to receive your verified code.
            </p>
          </div>
          <Link
            href="/payment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-purple-950 hover:bg-purple-50 text-sm font-semibold whitespace-nowrap transition-all"
          >
            <span>Pay to Register</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
