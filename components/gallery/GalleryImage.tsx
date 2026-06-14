"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Fills its (relatively/absolutely positioned) parent with a next/image,
 * showing an animated skeleton until the image finishes loading.
 */
export function GalleryImage({ src, alt, sizes = "100vw", priority, className }: GalleryImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 animate-pulse bg-muted transition-opacity duration-300 motion-reduce:animate-none",
          loaded && "opacity-0"
        )}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </>
  );
}
