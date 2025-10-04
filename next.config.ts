import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    APP_URL:process.env.APP_URL,
    AGORA_APP_ID: process.env.AGORA_APP_ID,
    AGORA_MESSAGE_KEY: process.env.AGORA_MESSAGE_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

export default nextConfig;
