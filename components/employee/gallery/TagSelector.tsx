"use client";

import { Check } from "lucide-react";
import { GALLERY_TAGS, GALLERY_TAG_LABELS, cn, type GalleryTag } from "@/lib/utils";

interface TagSelectorProps {
  selected: GalleryTag[];
  onToggle: (tag: GalleryTag) => void;
}

/** Optional multi-select of the three gallery tags, rendered as toggle chips. */
export function TagSelector({ selected, onToggle }: TagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {GALLERY_TAGS.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(tag)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-secondary"
            )}
          >
            {active && <Check className="size-3.5" aria-hidden />}
            {GALLERY_TAG_LABELS[tag]}
          </button>
        );
      })}
    </div>
  );
}
