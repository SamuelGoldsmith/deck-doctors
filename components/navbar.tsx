"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/apply", label: "Apply" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="surface-dark sticky top-0 z-50 shadow-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Deck Doctors home">
          <Image
            src="/logo-black-tp.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            Deck Doctors
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                  active ? "text-accent" : "text-surface-dark-foreground/85"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/estimate"
            className="ml-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Get an Estimate
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md p-2 text-surface-dark-foreground/90 transition-colors hover:bg-white/10 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
                    active ? "text-accent" : "text-surface-dark-foreground/85"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/estimate"
              className="mt-2 rounded-md bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get an Estimate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
