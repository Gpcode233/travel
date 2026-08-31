"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CompassIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Mail, ArrowRight, ShieldCheck } from "lucide-react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postLoginRedirect = searchParams.get("post_login_redirect_url") || "/account"

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    setLoading(true)
    const params = new URLSearchParams()
    if (email.trim()) params.set("email", email.trim())
    if (postLoginRedirect) params.set("post_login_redirect_url", postLoginRedirect)

    window.location.href = `/api/auth/login?${params.toString()}`
  }

  function handleGoogleSignIn() {
    setLoading(true)
    const params = new URLSearchParams()
    if (postLoginRedirect) params.set("post_login_redirect_url", postLoginRedirect)

    window.location.href = `/api/auth/login?${params.toString()}`
  }

  return (
    <main className="min-h-svh bg-background text-foreground flex flex-col justify-between">
      <div className="mx-auto w-full max-w-4xl px-5 py-5 sm:px-8">
        <SiteHeader />

        <div className="mx-auto mt-14 max-w-md">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
              <HugeiconsIcon icon={CompassIcon} className="size-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back to Trails
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your email to access your saved trips and reservations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignIn} className="mt-8 space-y-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                We will send a secure verification code to your email inbox.
              </p>
            </div>

            {/* Submit Email OTP */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90 mt-2"
            >
              <span className="flex items-center gap-2">
                Continue with Email
                <ArrowRight className="size-4" />
              </span>
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center text-xs">
            <Separator />
            <span className="relative -top-2.5 bg-background px-3 text-muted-foreground">
              Or
            </span>
          </div>

          {/* Google Sign-in */}
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-5 text-xs font-medium flex items-center justify-center gap-2"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/signup${postLoginRedirect ? `?post_login_redirect_url=${encodeURIComponent(postLoginRedirect)}` : ""}`}
              className="font-semibold text-primary underline underline-offset-3 hover:text-primary/90"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
