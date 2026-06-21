import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Deck Restoration & Construction`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f3ece2", // brand cream (matches --background)
    theme_color: "#241c15", // brand espresso (matches --surface-dark)
    icons: [
      { src: "/stethescope.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo-black-tp.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" },
    ],
  };
}
