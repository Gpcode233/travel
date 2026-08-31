import type { NextConfig } from "next"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  turbopack: {
    root,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "ak-d.tripcdn.com" },
      { protocol: "https", hostname: "wellsroyalehotels.com" },
      { protocol: "https", hostname: "www.omedelluxury.com" },
      { protocol: "https", hostname: "hotelpresidentialbyamber.com" },
    ],
  },
}

export default nextConfig
