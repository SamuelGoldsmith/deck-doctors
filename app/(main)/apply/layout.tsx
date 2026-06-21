import type { Metadata } from "next";

// The apply page is a client component, so its metadata lives on this segment layout.
export const metadata: Metadata = {
  title: "Careers — Join Our Team",
  description:
    "Now hiring laborers, carpenters, and painters. Apply to join the Deck Doctors crew building and restoring decks across Connecticut & Massachusetts.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Careers at Deck Doctors",
    description: "Join our deck restoration & construction crew in CT & MA.",
    url: "/apply",
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
