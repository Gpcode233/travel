"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";
import { eventConfig } from "@/lib/config";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Title */}
        <Link
          href="/"
          className="flex items-center gap-2 group text-zinc-900 hover:text-purple-950 transition-colors"
        >
          <div className="size-8 rounded-full bg-purple-950 text-white flex items-center justify-center font-serif text-sm font-semibold tracking-tight">
            YP
          </div>
          <div>
            <span className="font-serif font-bold text-base sm:text-lg tracking-tight block leading-tight text-zinc-900 group-hover:text-purple-950">
              {eventConfig.name}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-zinc-600 block">
              {eventConfig.location}
            </span>
          </div>
        </Link>

        {/* Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link
            href="/"
            className={`transition-colors hover:text-purple-950 ${
              pathname === "/" ? "text-purple-950 font-semibold" : ""
            }`}
          >
            Program
          </Link>
          <Link
            href="/payment"
            className={`transition-colors hover:text-purple-950 ${
              pathname === "/payment" ? "text-purple-950 font-semibold" : ""
            }`}
          >
            Payment
          </Link>
          <Link
            href="/register"
            className={`transition-colors hover:text-purple-950 ${
              pathname === "/register" ? "text-purple-950 font-semibold" : ""
            }`}
          >
            Register
          </Link>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/payment"
            className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-purple-950 hover:bg-purple-900 text-white text-xs sm:text-sm font-medium tracking-wide shadow-xs transition-all hover:gap-2 active:scale-[0.98]"
          >
            <span>Pay to Register</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </header>
  );
}
