import Link from "next/link";
import Image from "next/image";
import Social from "./Social";

const LINK_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/gallery", label: "Gallery" },
      { href: "/about", label: "About" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/estimate", label: "Request an Estimate" },
      { href: "/contact", label: "Contact Us" },
      { href: "/apply", label: "Join Our Team" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="surface-dark">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-black-tp.png"
                alt="Deck Doctors"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="font-display text-xl font-semibold">Deck Doctors</span>
            </Link>
            <p className="text-sm text-surface-dark-foreground/70">
              Deck restoration, repair, and new construction — built to last and
              backed by craftsmanship you can see.
            </p>
            <Social />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            {LINK_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {col.title}
                </p>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-surface-dark-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-surface-dark-foreground/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Deck Doctors. HIC: CT: 0701796 MA: 215589</p>
          <Link href="/employee-portal" className="transition-colors hover:text-accent">
            Employee Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
