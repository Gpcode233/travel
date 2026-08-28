"use client"

import { useEffect, useState } from "react"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  CompassIcon,
  UserIcon,
  ClockIcon,
} from "@hugeicons/core-free-icons"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs"

type Trip = {
  id: string
  title?: string | null
  itinerary: any
  createdAt: string
}

type Conversation = {
  id: string
  title?: string | null
  createdAt: string
  updatedAt: string
  _count: { messages: number }
}

type Preferences = {
  theme: string
  currency: string
}

const CURRENCIES = ["NGN", "USD", "GBP", "EUR"]

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient()

  const [trips, setTrips] = useState<Trip[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return

    async function load() {
      setDataLoading(true)
      try {
        const [tripsRes, convsRes, prefsRes] = await Promise.all([
          fetch("/api/trip"),
          fetch("/api/conversations"),
          fetch("/api/preferences"),
        ])
        const tripsData = await tripsRes.json()
        const convsData = await convsRes.json()
        const prefsData = await prefsRes.json()

        setTrips(tripsData.trips ?? [])
        setConversations(convsData.conversations ?? [])
        setPrefs(prefsData.preferences ?? null)
      } catch {
        toast.error("Failed to load account data")
      } finally {
        setDataLoading(false)
      }
    }

    load()
  }, [isAuthenticated])

  async function updateCurrency(value: string) {
    setPrefs((p) => (p ? { ...p, currency: value } : null))
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: value }),
      })
      toast.success("Currency updated")
    } catch {
      toast.error("Failed to save currency preference")
    }
  }

  function getTripName(trip: Trip): string {
    if (trip.title) return trip.title
    try {
      const it = trip.itinerary
      if (it?.destination) return it.destination
      if (it?.title) return it.title
      if (it?.days?.[0]?.theme) return it.days[0].theme
    } catch {}
    return "Trip plan"
  }

  if (isLoading) {
    return (
      <main className="min-h-svh bg-background">
        <div className="mx-auto max-w-4xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader />
          <div className="mt-12 space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-72" />
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-svh bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader />
          <div className="mt-24 flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon icon={UserIcon} className="size-8 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-semibold">Sign in to view your account</h1>
            <p className="text-muted-foreground">
              Save trips, track conversations, and manage preferences.
            </p>
            <LoginLink>
              <Button size="lg" className="mt-2">Sign in</Button>
            </LoginLink>
          </div>
        </div>
      </main>
    )
  }

  const displayName =
    [user.given_name, user.family_name].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "Traveler"

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-5 py-5 sm:px-8 lg:px-10">
        <SiteHeader />

        <div className="mt-10 flex items-center gap-5">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-bold text-xl select-none">
            {initials}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Separator className="mt-8" />

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trips">
              Saved trips
              {trips.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {trips.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">
              Agent history
              {conversations.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {conversations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={Calendar01Icon}
                label="Saved trips"
                value={dataLoading ? null : trips.length}
              />
              <StatCard
                icon={ClockIcon}
                label="Agent sessions"
                value={dataLoading ? null : conversations.length}
              />
              <StatCard
                icon={CompassIcon}
                label="Currency"
                value={dataLoading ? null : (prefs?.currency ?? "NGN")}
                isText
              />
            </div>
          </TabsContent>

          {/* TRIPS */}
          <TabsContent value="trips">
            {dataLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <HugeiconsIcon icon={Calendar01Icon} className="size-10 text-muted-foreground/40" />
                <p className="font-medium">No saved trips yet</p>
                <p className="text-sm text-muted-foreground">
                  Plan a trip with the Trails agent and save it here.
                </p>
                <Button asChild className="mt-2">
                  <Link href="/agent">Start planning</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between rounded border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{getTripName(trip)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Saved {new Date(trip.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/agent">Open planner</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AGENT HISTORY */}
          <TabsContent value="history">
            {dataLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <HugeiconsIcon icon={ClockIcon} className="size-10 text-muted-foreground/40" />
                <p className="font-medium">No agent sessions saved yet</p>
                <p className="text-sm text-muted-foreground">
                  Conversations are saved when you use the Trails agent.
                </p>
                <Button asChild className="mt-2">
                  <Link href="/agent">Open agent</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between rounded border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{conv.title ?? "Planning session"}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {conv._count.messages} messages ·{" "}
                        {new Date(conv.updatedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/agent">Continue</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PREFERENCES */}
          <TabsContent value="preferences">
            <div className="max-w-md space-y-8">
              <Separator />

              <div>
                <h2 className="font-heading text-base font-semibold">Currency display</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Budget estimates will show in this currency.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateCurrency(c)}
                      className={cn(
                        "rounded border px-4 py-2 text-sm font-mono transition",
                        prefs?.currency === c
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
  isText = false,
}: {
  icon: any
  label: string
  value: number | string | null
  isText?: boolean
}) {
  return (
    <div className="rounded border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={icon} className="size-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2">
        {value === null ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className={cn("font-heading font-semibold", isText ? "text-xl" : "text-3xl")}>
            {value}
          </p>
        )}
      </div>
    </div>
  )
}
