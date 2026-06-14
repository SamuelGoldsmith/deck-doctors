"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { GalleryImage } from "@/components/gallery/GalleryImage";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

export interface GalleryProject {
  slug: string;
  title: string;
  before: string[];
  after: string[];
}

const MAX_THUMBS = 4;

export function ProjectShowcase({ project, priority }: { project: GalleryProject; priority?: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allPhotos = [...project.before, ...project.after];
  const thumbs = allPhotos.slice(1, 1 + MAX_THUMBS);
  const remaining = allPhotos.length - 1 - thumbs.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {/* <h2 className="font-display text-h3 font-semibold text-primary">{project.title}</h2> */}
        {allPhotos.length > 1 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Images className="h-4 w-4" />
            View all {allPhotos.length} photos
          </button>
        )}
      </div>

      <BeforeAfter before={project.before[0]} after={project.after[0]} alt={project.title} priority={priority} />

      {thumbs.length > 0 && (
        <div className="flex gap-3">
          {thumbs.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`View ${project.title} photo ${i + 2} of ${allPhotos.length}`}
              className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg shadow-card transition-opacity hover:opacity-90 sm:w-20"
            >
              <GalleryImage src={src} alt={`${project.title} photo ${i + 2}`} sizes="80px" />
            </button>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setLightboxIndex(thumbs.length + 1)}
              aria-label={`View all ${allPhotos.length} photos for ${project.title}`}
              className="relative flex aspect-square w-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground shadow-card transition-colors hover:bg-secondary/80 sm:w-20"
            >
              +{remaining}
            </button>
          )}
        </div>
      )}

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={allPhotos}
          startIndex={lightboxIndex}
          title={project.title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
