"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPLOYEE_LINKS = [
  { href: "/employee-portal", label: "Home" },
  { href: "/employee-portal/applications", label: "Applications" },
  { href: "/employee-portal/estimates", label: "Estimates" },
  { href: "/employee-portal/jobs", label: "Jobs" },
  { href: "/employee-portal/employees", label: "Employees" },
  { href: "/employee-portal/customers", label: "Contacts" },
  { href: "/employee-portal/hours", label: "Hours" },
];

export default function EmployeeNavbarClient({ authenticated }: { authenticated: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = authenticated ? EMPLOYEE_LINKS : [];

  return (
    <header className="surface-dark sticky top-0 z-50 shadow-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/employee-portal" className="flex items-center gap-2.5" aria-label="Deck Doctors employee portal">
          <Image
            src="/logo-black-tp.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            Deck Doctors
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
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
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-surface-dark-foreground/70 transition-colors hover:bg-white/10"
          >
            Exit
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md p-2 text-surface-dark-foreground/90 transition-colors hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((link) => {
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
              href="/"
              className="mt-1 rounded-md px-3 py-2.5 text-sm font-medium text-surface-dark-foreground/70 transition-colors hover:bg-white/10"
            >
              Exit
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
