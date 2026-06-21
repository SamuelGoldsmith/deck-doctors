import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import reviews from "@/data/reviews.json";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Reviews & Testimonials",
  description:
    "See what Connecticut & Massachusetts homeowners say about Deck Doctors' deck restoration, repair, and new construction work.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Deck Doctors Reviews & Testimonials",
    description: "Real reviews from CT & MA homeowners.",
    url: "/testimonials",
  },
};

const GOOGLE_REVIEWS_URL = "https://share.google/PhUOpIj2nIsZN3IWA";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const total = reviews.length;
  const average = (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  return (
    <>
      <Section tone="dark">
        <Container className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Testimonials
            </p>
            <h1 className="font-display text-hero font-bold">Trusted by Homeowners</h1>
            <p className="mx-auto max-w-2xl text-lead text-surface-dark-foreground/80">
              We let our work and our customers do the talking.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <p className="text-sm text-surface-dark-foreground/70">
              {average} average rating from {total} Google reviews
            </p>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Read &amp; Leave Reviews <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {reviews.map((review, i) => (
              <Reveal
                key={review.reviewer}
                delay={(i % 3) * 80}
                className="mb-6 break-inside-avoid"
              >
                <div className="card relative overflow-hidden p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-3 font-display text-8xl text-primary/10"
                  >
                    &rdquo;
                  </span>
                  <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                      {initials(review.reviewer)}
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold">{review.reviewer}</p>
                      <div className="flex gap-0.5 text-accent">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="tan">
        <Container className="flex flex-col items-center gap-2 text-center">
          <Reveal>
            <h2 className="font-display text-h2 font-bold">Become Our Next Success Story</h2>
            <p className="mx-auto mt-3 max-w-xl text-lead text-muted-foreground">
              Ready to see what we can do for your deck? Request a free, no-obligation estimate.
            </p>
            <Link
              href="/estimate"
              className="primary mt-8 inline-block rounded-md px-8 py-4 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Get Your Free Estimate
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
