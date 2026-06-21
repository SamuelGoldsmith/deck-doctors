import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (approx hex of the oklch tokens in styles/globals.css)
const ESPRESSO = "#241c15"; // --surface-dark
const CREAM = "#f3ece2"; // --background / foreground on dark
const TAN = "#b5876a"; // --accent

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${ESPRESSO} 0%, #15100b 100%)`,
          color: CREAM,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: TAN,
            fontWeight: 600,
          }}
        >
          Restoration · Repair · New Construction
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 800, lineHeight: 1 }}>
            Deck Doctors
          </div>
          <div style={{ display: "flex", width: 220, height: 10, background: TAN, marginTop: 28 }} />
          <div
            style={{
              display: "flex",
              fontSize: 38,
              marginTop: 28,
              color: "rgba(243,236,226,0.85)",
              maxWidth: 900,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", color: CREAM }}>Connecticut &amp; Massachusetts</div>
          <div style={{ display: "flex", color: TAN }}>{siteConfig.phoneDisplay}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
