import Link from "next/link";
import { Hammer, Wrench, PaintRoller, Sparkles, Star } from "lucide-react";
import reviews from "@/data/reviews.json";
import { ParallaxHero } from "@/components/motion/ParallaxHero";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";

const SERVICES = [
  {
    title: "Deck Restoration",
    description: "Bring a tired, weathered deck back to life with cleaning, repairs, and refinishing.",
    icon: Sparkles,
  },
  {
    title: "New Construction",
    description: "Custom-designed decks built from the ground up to fit your home and lifestyle.",
    icon: Hammer,
  },
  {
    title: "Repairs",
    description: "From rotted boards to wobbly railings, we fix what's broken and make it safe again.",
    icon: Wrench,
  },
  {
    title: "Staining & Sealing",
    description: "Protect your investment and keep your deck looking its best year after year.",
    icon: PaintRoller,
  },
];

export default function Home() {
  return (
    <>
      <ParallaxHero
        image="/decks/pool-2-after/IMG_0098.jpg"
        imageAlt="A freshly restored deck overlooking trees at sunset"
        eyebrow="Connecticut & Massachusetts"
        title="Is Your Deck in Good Health?"
        subtitle="From weathered to wonderful, restoration, repairs, and new builds built to last, backed by craftsmanship you can see."
      >
        <Link
          href="/estimate"
          className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Get a Free Estimate
        </Link>
        <Link
          href="/gallery"
          className="rounded-md border border-surface-dark-foreground/30 bg-white/5 px-6 py-3 text-sm font-semibold text-surface-dark-foreground backdrop-blur-sm transition-colors hover:bg-white/10"
        >
          View Our Work
        </Link>
      </ParallaxHero>

      <Section tone="dark">
        <Container>
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                What We Do
              </p>
              <h2 className="mt-2 font-display text-h2 font-bold">Our Services</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 80}>
                <div className="elevated h-full rounded-2xl p-6 shadow-card transition-transform hover:-translate-y-1">
                  <service.icon className="h-8 w-8 text-accent" />
                  <h3 className="mt-4 font-display text-h3 font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                See the Difference
              </p>
              <h2 className="font-display text-h2 font-bold text-primary">
                Real Transformations, Real Results
              </h2>
              <p className="text-lead text-muted-foreground">
                Drag the slider to see how we took this front-entry deck from worn and weathered
                to freshly restored railings, steps, and all.
              </p>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
              >
                See more before &amp; afters →
              </Link>
            </div>
          </Reveal>
          <Reveal variant="right">
            <BeforeAfter
              before="/decks/bluehouse-1-before/IMG_7778.jpg"
              after="/decks/bluehouse-2-after/IMG_7848.jpg"
              alt="Front entry deck restoration"
            />
          </Reveal>
        </Container>
      </Section>

      <Section tone="tan">
        <Container>
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Customer Stories
              </p>
              <h2 className="mt-2 font-display text-h2 font-bold">What Our Customers Say</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((review, i) => (
              <Reveal key={review.reviewer} delay={i * 80}>
                <div className="card flex h-full flex-col gap-3 p-6">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p className="mt-auto text-sm font-semibold">{review.reviewer}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link href="/testimonials" className="font-semibold text-accent hover:underline">
                Read more reviews →
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="flex flex-col items-center gap-2 text-center">
          <Reveal>
            <h2 className="font-display text-h2 font-bold">Ready to Give Your Deck New Life?</h2>
            <p className="mx-auto mt-3 max-w-xl text-lead text-surface-dark-foreground/80">
              Request a free, no-obligation estimate and find out what&apos;s possible for your
              outdoor space.
            </p>
            <Link
              href="/estimate"
              className="mt-8 inline-block rounded-md bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get Your Free Estimate
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
