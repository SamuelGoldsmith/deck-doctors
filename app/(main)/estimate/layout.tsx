import type { Metadata } from "next";

// The estimate page is a client component, so its metadata lives on this segment layout.
export const metadata: Metadata = {
  title: "Request a Free Estimate",
  description:
    "Get a free, no-obligation estimate for deck restoration, repair, or a new build from Deck Doctors. Serving Connecticut & Massachusetts.",
  alternates: { canonical: "/estimate" },
  openGraph: {
    title: "Request a Free Deck Estimate",
    description: "Free deck restoration & construction estimates in CT & MA.",
    url: "/estimate",
  },
};

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
