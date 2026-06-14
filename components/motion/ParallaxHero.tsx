import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

interface ParallaxHeroProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  heightClassName?: string;
}

/**
 * Full-bleed hero with a slow scroll-linked parallax background
 * (`.parallax-layer` in globals.css) and a dark gradient overlay for
 * text contrast.
 */
export function ParallaxHero({
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  heightClassName = "h-[70vh] min-h-[480px]",
}: ParallaxHeroProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", heightClassName, className)}>
      <div className="parallax-layer absolute inset-0">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dark)]/85 via-[var(--color-surface-dark)]/35 to-[var(--color-surface-dark)]/10" />
      <Container className="relative z-10 flex h-full flex-col items-start justify-center text-[var(--color-surface-dark-foreground)]">
        {eyebrow && (
          <p className="mb-3 inline-block rounded-full bg-[var(--color-surface-dark)]/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-display text-hero font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-lead text-[var(--color-surface-dark-foreground)]/90">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
      </Container>
    </div>
  );
}
