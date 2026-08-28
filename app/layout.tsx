import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const viewport: Viewport = {
  themeColor: "#CC5500",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Trails · Plan a smarter adventure through Enugu",
    template: "%s · Trails",
  },
  description:
    "Browse waterfalls, hotels, restaurants, and cultural stops in Enugu, Nigeria, then hand off to the Trails agent to shape a practical itinerary with local context.",
  keywords: ["Enugu", "Nigeria", "Travel", "Itinerary", "Trip planner"],
  openGraph: {
    title: "Trails · Plan a smarter adventure through Enugu",
    description:
      "Browse waterfalls, hotels, restaurants, and cultural stops, then hand off to the Trails agent to shape a practical itinerary with local context.",
    type: "website",
    locale: "en_NG",
  },
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
