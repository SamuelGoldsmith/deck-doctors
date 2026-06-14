"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GalleryImage } from "@/components/gallery/GalleryImage";

interface GalleryLightboxProps {
  images: string[];
  startIndex?: number;
  title: string;
  onClose: () => void;
}

/**
 * Native <dialog>-based lightbox: showModal() gives us focus trapping,
 * ::backdrop, and Escape-to-close for free.
 */
export function GalleryLightbox({ images, startIndex = 0, title, onClose }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      aria-label={`${title} photo gallery`}
      className="surface-dark m-auto h-[85vh] w-full max-w-4xl rounded-2xl border-0 p-0 backdrop:bg-black/70"
    >
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">
            {title} — Photo {index + 1} of {images.length}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close gallery"
            className="rounded-md p-1.5 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative flex-1">
          <GalleryImage
            key={images[index]}
            src={images[index]}
            alt={`${title} photo ${index + 1} of ${images.length}`}
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 transition-colors hover:bg-black/60"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 transition-colors hover:bg-black/60"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
