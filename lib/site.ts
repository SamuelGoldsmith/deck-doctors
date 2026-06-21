/**
 * Single source of truth for site-wide SEO + business identity (NAP, socials,
 * service area). Consumed by the metadata in app/layout.tsx, app/sitemap.ts,
 * app/robots.ts, app/manifest.ts, the OG image, and the JSON-LD structured data
 * (components/seo/StructuredData.tsx).
 *
 * The canonical URL can be overridden per environment with NEXT_PUBLIC_SITE_URL
 * (set it in Vercel for previews/production); it falls back to the live domain.
 */

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string; // 2-letter, e.g. "CT"
  postalCode: string;
  addressCountry: string; // "US"
}

export const siteConfig = {
  name: "Deck Doctors",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.deckdocne.com").replace(/\/$/, ""),
  description:
    "Deck restoration, repair, and new construction across Connecticut & Massachusetts built to last and backed by craftsmanship you can see.",
  tagline: "Built to last, backed by craftsmanship you can see.",

  // NAP (name / address / phone)
  phoneDisplay: "(413) 400-0884",
  phoneE164: "+14134000884", // tel: links
  phoneIntl: "+1-413-400-0884", // schema.org telephone format
  email: "Contact@DeckDocNE.com",

  // Service-area business: regions served, no public street address.
  // Fill `address` in if you publish a storefront (improves Google Business match).
  areaServed: ["Connecticut", "Massachusetts"],
  address: null as PostalAddress | null,

  logo: "/logo-black-tp.png",
  ogImageAlt: "Deck Doctors — deck restoration & construction in Connecticut and Massachusetts",

  sameAs: [
    "https://www.instagram.com/deckdoctorsne/",
    "https://www.facebook.com/profile.php?id=61562144881770",
  ],

  licenses: ["HIC CT 0701796", "HIC MA 215589"],

  keywords: [
    "deck restoration",
    "deck repair",
    "deck builder",
    "deck construction",
    "new deck build",
    "composite decking",
    "Trex decking",
    "deck staining and sealing",
    "Connecticut deck contractor",
    "Massachusetts deck contractor",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
