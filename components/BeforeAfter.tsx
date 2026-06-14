"use client";

import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@/components/gallery/GalleryImage";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Drag (or arrow-key, via the underlying range input) to reveal the "after"
 * photo over the "before" photo.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  alt = "Deck restoration",
  className,
  priority,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card", className)}>
      <GalleryImage
        src={after}
        alt={`${alt} — ${afterLabel}`}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <GalleryImage
          src={before}
          alt={`${alt} — ${beforeLabel}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
        />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Drag to compare before and after photos"
        className="peer absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-[var(--color-accent)]"
        style={{ left: `${position}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-card ring-0 transition-shadow peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] peer-focus-visible:ring-offset-2"
        style={{ left: `${position}%` }}
      >
        <MoveHorizontal className="h-5 w-5" />
      </div>

      <span className="absolute left-3 top-3 rounded-md bg-[var(--color-surface-dark)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-surface-dark-foreground)]">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-md bg-[var(--color-accent)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-foreground)]">
        {afterLabel}
      </span>
    </div>
  );
}
