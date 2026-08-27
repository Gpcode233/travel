"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useKindeBrowserClient, LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import { CompassIcon, UserIcon, Logout01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Explore", href: "/explore" },
  { label: "Planner", href: "/" },
]

export function SiteHeader({
  variant = "solid",
}: {
  variant?: "solid" | "overlay"
}) {
  const pathname = usePathname()
  const overlay = variant === "overlay"
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient()

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <HugeiconsIcon icon={CompassIcon} className="size-5" />
          <span className="font-heading font-bold text-base tracking-tight">Trails</span>
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
      </div>

      <div className="flex items-center gap-3">
        {!isLoading && (
          <>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    overlay ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  <span className="hidden sm:inline font-medium">
                    {user.given_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <LogoutLink>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 gap-1.5 px-2.5 text-xs",
                      overlay
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={Logout01Icon} className="size-3.5" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </LogoutLink>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LoginLink>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-3 text-xs",
                      overlay
                        ? "text-white/90 hover:bg-white/10 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sign in
                  </Button>
                </LoginLink>
                <RegisterLink>
                  <Button
                    size="sm"
                    className="h-8 rounded-xs bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Sign up
                  </Button>
                </RegisterLink>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}

