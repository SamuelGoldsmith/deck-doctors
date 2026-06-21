"use client";

import { useMemo, useState } from "react";
import { Images } from "lucide-react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { GalleryImage } from "@/components/gallery/GalleryImage";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  GALLERY_TAG_LABELS,
  cn,
  type GalleryGroup,
} from "@/lib/utils";

const MAX_THUMBS = 4;

export function ProjectShowcase({
  group,
  priority,
}: {
  group: GalleryGroup;
  priority?: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { before, after, allPhotos, heading } = useMemo(() => {
    const before = group.images.find((i) => i.role === "before");
    const after = group.images.find((i) => i.role === "after");
    const others = group.images.filter((i) => i.role === "other");

    // Display order used everywhere (slider, thumbs, lightbox): before, after,
    // then any extras — all already position-ordered by the data layer.
    const ordered = [
      ...(before ? [before] : []),
      ...(after ? [after] : []),
      ...others,
    ];

    return {
      before,
      after,
      allPhotos: ordered.map((i) => i.url),
      heading: group.title?.trim() || null,
    };
  }, [group]);

  // Fall back to the group title for alt text, otherwise a generic label.
  const alt = heading ?? "Deck project";
  const hasSlider = Boolean(before && after);
  const heroSrc = allPhotos[0];

  const thumbs = allPhotos.slice(1, 1 + MAX_THUMBS);
  const remaining = allPhotos.length - 1 - thumbs.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div className="space-y-2">
          {heading && (
            <h2 className="font-display text-h3 font-semibold text-primary">{heading}</h2>
          )}
          {group.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Project categories">
              {group.tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {GALLERY_TAG_LABELS[tag]}
                </li>
              ))}
            </ul>
          )}
        </div>

        {allPhotos.length > 1 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Images className="h-4 w-4" />
            View all {allPhotos.length} photos
          </button>
        )}
      </div>

      {hasSlider ? (
        <BeforeAfter before={before!.url} after={after!.url} alt={alt} priority={priority} />
      ) : heroSrc ? (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`View ${alt} photos`}
          className={cn(
            "relative block aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card transition-opacity hover:opacity-95",
            allPhotos.length <= 1 && "cursor-default hover:opacity-100"
          )}
        >
          <GalleryImage
            src={heroSrc}
            alt={alt}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
          />
        </button>
      ) : null}

      {thumbs.length > 0 && (
        <div className="flex gap-3">
          {thumbs.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`View ${alt} photo ${i + 2} of ${allPhotos.length}`}
              className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg shadow-card transition-opacity hover:opacity-90 sm:w-20"
            >
              <GalleryImage src={src} alt={`${alt} photo ${i + 2}`} sizes="80px" />
            </button>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setLightboxIndex(thumbs.length + 1)}
              aria-label={`View all ${allPhotos.length} photos for ${alt}`}
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
          title={alt}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
