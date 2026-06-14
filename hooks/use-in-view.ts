"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element has entered the viewport. Used as a fallback for
 * the `.reveal` CSS animations on browsers without `animation-timeline: view()`
 * support (e.g. Firefox).
 */
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
