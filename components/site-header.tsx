"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { CompassIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

const navItems = [
  { label: "Locations", href: "/locations" },
  { label: "Planner", href: "/" },
  { label: "Nigeria", href: "/nigeria" },
]

export function SiteHeader({
  variant = "solid",
}: {
  variant?: "solid" | "overlay"
}) {
  const pathname = usePathname()
  const overlay = variant === "overlay"

  return (
    <header className="flex items-center justify-between gap-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <HugeiconsIcon icon={CompassIcon} className="size-5" />
        Enugu Trails AI
      </Link>
      <nav
        className={cn(
          "hidden items-center gap-6 text-sm md:flex",
          overlay ? "text-white/75" : "text-muted-foreground"
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors",
              overlay ? "hover:text-white" : "hover:text-foreground",
              pathname === item.href &&
                (overlay ? "text-white" : "text-foreground")
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
