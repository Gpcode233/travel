"use client";

import Link from "next/link";
import { WhatsappLogo, ShieldCheck, ArrowUpRight } from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-100 mt-20 sm:mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 pb-12 border-b border-zinc-100">
          {/* Col 1: About Program */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-purple-950 text-white flex items-center justify-center font-serif text-xs font-bold">
                YP
              </div>
              <h3 className="font-serif font-bold text-base text-zinc-900">
                {eventConfig.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {eventConfig.topic}
            </p>
            <p className="text-xs text-zinc-600">
              {eventConfig.date} · {eventConfig.location}
            </p>
          </div>

          {/* Col 2: Quick Links & Flow */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Registration Journey
            </h4>
            <ul className="text-xs sm:text-sm space-y-2 text-zinc-600">
              <li>
                <Link
                  href="/payment"
                  className="hover:text-purple-950 transition-colors inline-flex items-center gap-1"
                >
                  <span>1. Make Bank Transfer (₦5,000)</span>
                </Link>
              </li>
              <li>
                <a
                  href={eventConfig.whatsapp.getLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-950 transition-colors inline-flex items-center gap-1"
                >
                  <span>2. Verify on WhatsApp</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-purple-950 transition-colors inline-flex items-center gap-1"
                >
                  <span>3. Enter Code & Complete Registration</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Need Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Organizer Support
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Have questions about your payment or registration code? Reach out directly to the organizer.
            </p>
            <a
              href={eventConfig.whatsapp.getLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-950 hover:text-purple-800 transition-colors"
            >
              <WhatsappLogo size={16} weight="fill" className="text-purple-950" />
              <span>{eventConfig.whatsapp.number}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} {eventConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-zinc-600">
            <ShieldCheck size={14} className="text-purple-950" />
            <span>Official Organizer Verification · Direct Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
