import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { eventConfig } from "@/lib/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#3B0764",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${eventConfig.name} · ${eventConfig.headline}`,
    template: `%s · ${eventConfig.name}`,
  },
  description: `${eventConfig.description} Topic: ${eventConfig.topic}. Location: ${eventConfig.location}.`,
  keywords: [
    "Youth Program",
    "Youth Conference",
    "Enugu",
    "Nigeria",
    "Leadership",
    "Purpose",
    "Skills",
    "2026",
  ],
  authors: [{ name: "Youth Program Foundation" }],
  openGraph: {
    title: `${eventConfig.name} — ${eventConfig.headline}`,
    description: eventConfig.description,
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
      <body className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-purple-900 selection:text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
