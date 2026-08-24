import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: {
    default: "Trails",
    template: "%s · Trails",
  },
  description:
    "Plan a smarter Enugu-first Nigeria trip with an AI travel agent.",
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        instrumentSans.variable,
        geistMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
