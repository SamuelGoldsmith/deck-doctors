import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { SiInstagram, SiFacebook } from "react-icons/si";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call or text (413) 400-0884, or message Deck Doctors. Serving homeowners across Connecticut & Massachusetts for deck restoration, repair, and new builds.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Deck Doctors",
    description: "Call (413) 400-0884 — deck restoration & construction in CT & MA.",
    url: "/contact",
  },
};

const SOCIALS = [
  { href: "https://www.instagram.com/deckdoctorsne/", label: "Instagram", icon: SiInstagram },
  { href: "https://www.facebook.com/profile.php?id=61562144881770", label: "Facebook", icon: SiFacebook },
];

export default function Contact() {
  return (
    <>
      <Section tone="dark">
        <Container className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Contact</p>
          <h1 className="font-display text-hero font-bold">Get In Touch</h1>
          <p className="mx-auto max-w-2xl text-lead text-surface-dark-foreground/80">
            Questions about a project, an appointment, or just want to talk decks? Reach out and
            a real person will get back to you.
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <Reveal variant="left" className="lg:col-span-3">
            <div className="elevated flex h-full flex-col gap-8 rounded-2xl p-8 shadow-card sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Reach Us Directly
                </p>
                <h2 className="mt-2 font-display text-h2 font-bold text-primary">
                  We&apos;d Love to Hear From You
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                <a href="tel:+14134000884" className="group flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Call or Text
                    </p>
                    <p className="font-display text-h3 font-semibold transition-colors group-hover:text-accent">
                      (413) 400-0884
                    </p>
                  </div>
                </a>

                <a href="mailto:Contact@DeckDocNE.com" className="group flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Email
                    </p>
                    <p className="font-display text-h3 font-semibold break-all transition-colors group-hover:text-accent">
                      Contact@DeckDocNE.com
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-auto space-y-3 border-t border-[var(--color-border)] pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Follow Along
                </p>
                <div className="flex gap-3">
                  {SOCIALS.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-lg transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Reveal variant="right" delay={80}>
              <div className="card flex flex-col gap-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="font-display text-h3 font-semibold">Where We Work</h3>
                <p className="text-sm text-muted-foreground">
                  Proudly serving homeowners across Connecticut &amp; Massachusetts.
                </p>
                <p className="text-xs text-muted-foreground">HIC: CT 0701796 &middot; MA 215589</p>
              </div>
            </Reveal>

            <Reveal variant="right" delay={160}>
              <div className="surface-dark flex flex-col gap-3 rounded-2xl p-6 shadow-card">
                <h3 className="font-display text-h3 font-semibold">Ready for an Estimate?</h3>
                <p className="text-sm text-surface-dark-foreground/80">
                  Tell us a bit about your project and we&apos;ll get back to you within one
                  business day.
                </p>
                <Link
                  href="/estimate"
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
                >
                  Request a Free Estimate <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
