import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // Skip type-checking and lint during build — run tsc separately in CI
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.mangerine.com" },
      { protocol: "https", hostname: "mangerine.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    APP_URL: process.env.APP_URL,
    AGORA_APP_ID: process.env.AGORA_APP_ID,
    AGORA_MESSAGE_KEY: process.env.AGORA_MESSAGE_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
};

export default withSentryConfig(nextConfig, {
  org: "stak-ua",
  project: "mangerine",
  silent: !process.env.CI,
  // Only upload source maps in CI — skip on local builds entirely
  sourcemaps: {
    disable: !process.env.CI,
  },
  // widenClientFileUpload slows every build; only needed in CI for full stack traces
  widenClientFileUpload: Boolean(process.env.CI),
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
