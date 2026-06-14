"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "left" | "right";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
};

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}

/**
 * Fades/slides children in as they enter the viewport. Primarily driven by
 * the `.reveal*` CSS (animation-timeline: view()) in globals.css; the
 * `in-view` class from useInView is the fallback for browsers without
 * scroll-driven animation support.
 */
export function Reveal({ children, variant = "up", delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(VARIANT_CLASS[variant], inView && "in-view", className)}
      style={delay ? { transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
