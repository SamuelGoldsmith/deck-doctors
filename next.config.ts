import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Native / wasm deps used by the HEIC conversion route — keep them external
  // (loaded from node_modules at runtime) instead of bundling them.
  serverExternalPackages: ["sharp", "heic-convert"],
  images: {
    // Gallery photos are served from Vercel Blob public storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
