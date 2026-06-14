import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryImage } from "@/components/gallery/GalleryImage";

const WHY_CHOOSE_US = [
  {
    title: "Expert Craftsmanship",
    description:
      "Our team of skilled individuals are dedicated to delivering top-notch craftsmanship on every project. With extreme focus on detail, we ensure that every deck we work on meets the highest standards of quality.",
    icon: "/hammer.jpg",
  },
  {
    title: "Premium Materials",
    description:
      "We use the best materials and products available to ensure that your deck not only looks fantastic but is also protected against the elements. Our high-quality paints and finishes are designed to withstand the test of time.",
    icon: "/spray.jpg",
  },
  {
    title: "Customized Solutions",
    description:
      "Every deck is unique, and so are the needs of our clients. We offer personalized solutions tailored to your specific requirements, whether it's a complete deck makeover, touch-up, or regular maintenance.",
    icon: "/tape.jpg",
  },
  {
    title: "Customer Satisfaction",
    description:
      "Our customers are at the heart of everything we do. From the initial consultation to the final brushstroke, we prioritize clear communication, transparency, and a seamless experience. Your satisfaction is our ultimate goal.",
    icon: "/roll.jpg",
  },
];

const SERVICES: { name: string; detail?: string }[] = [
  { name: "Decks", detail: "Rehab, Restore, Renew & New Construction" },
  { name: "Front Doors", detail: "Refinish, Paint, or Replace" },
  { name: "Garage Doors", detail: "Clean, Paint, or Replace" },
  { name: "Cement Stoops", detail: "Power Wash, Repair, or Refinish" },
  { name: "Railings", detail: "Refinish or New Install" },
  { name: "Fences", detail: "Paint, Stain, Clean, Repair" },
  { name: "Power Washing", detail: "Home, Patio, Outdoor Furniture, Sheds, Walkways" },
  { name: "Paver Pressure Washing & Sealing" },
  { name: "Driveway Power Washing", detail: "Concrete, Asphalt, & Pavers" },
  { name: "Yard Clutter & Junk Removal" },
  { name: "Exterior Stairs & Steps", detail: "Cleaning, Repair, or Replacement" },
];

export default function About() {
  return (
    <>
      <Section tone="dark">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                About Us
              </p>
              <h1 className="font-display text-hero font-bold">Our Mission</h1>
              <p className="text-lead text-surface-dark-foreground/80">
                Welcome to Deck Doctor, where we bring your outdoor spaces to life with expert
                restoration services! Established with a passion for craftsmanship and a
                commitment to excellence, trust Deck Doctors in transforming decks into stunning,
                vibrant extensions of your home.
              </p>
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="relative mx-auto max-w-sm">
              <div className="elevated rounded-2xl p-2 shadow-card">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <GalleryImage
                    src="/ppaint.jpg"
                    alt="A Deck Doctors team member surveying a deck restoration site"
                    sizes="(max-width: 1024px) 90vw, 480px"
                    priority
                  />
                </div>
              </div>
              <div
                aria-hidden
                className="absolute -bottom-5 -right-5 flex h-16 w-16 -rotate-[8deg] items-center justify-center rounded-full bg-accent shadow-card sm:h-20 sm:w-20"
              >
                <Image
                  src="/stethescope.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-8 w-8 invert sm:h-9 sm:w-9"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                What Sets Us Apart
              </p>
              <h2 className="mt-2 font-display text-h2 font-bold text-primary">Why Choose Us?</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="card flex h-full flex-col gap-4 p-6">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full bg-accent/15">
                    <Image
                      src={item.icon}
                      alt=""
                      fill
                      className="object-contain p-3 mix-blend-multiply"
                    />
                  </div>
                  <h3 className="font-display text-h3 font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="tan">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <GalleryImage
                src="/pback.jpg"
                alt="A Deck Doctors team member working on a deck restoration"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal variant="right">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  What We Do
                </p>
                <h2 className="mt-2 font-display text-h2 font-bold">Our Services</h2>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SERVICES.map((service) => (
                  <li key={service.name} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <span className="font-semibold">{service.name}</span>
                      {service.detail && <> ({service.detail})</>}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm italic text-muted-foreground">...and more!</p>
              <Link
                href="/estimate"
                className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
              >
                Don&apos;t see your project? Ask us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="flex flex-col items-center gap-2 text-center">
          <Reveal>
            <h2 className="font-display text-h2 font-bold">Let&apos;s Bring Your Vision to Life</h2>
            <p className="mx-auto mt-3 max-w-xl text-lead text-surface-dark-foreground/80">
              From a quick refresh to a full rebuild, the Deck Doctors team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/estimate"
                className="rounded-md bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Get a Free Estimate
              </Link>
              <Link
                href="/gallery"
                className="rounded-md border border-surface-dark-foreground/30 bg-white/5 px-8 py-4 text-sm font-semibold text-surface-dark-foreground backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                View Our Work
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
