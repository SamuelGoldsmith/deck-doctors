"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { cn, type GalleryImageRole } from "@/lib/utils";
import type { DraftImage } from "./types";

const ROLE_BADGE: Record<GalleryImageRole, { label: string; className: string }> = {
  before: { label: "Before", className: "bg-[#fef3c7] text-[#92400e]" },
  after: { label: "After", className: "bg-[#dcfce7] text-[#166534]" },
  other: { label: "Other", className: "bg-secondary text-secondary-foreground" },
};

interface ImageCardProps {
  image: DraftImage;
  index: number;
  total: number;
  /** id prefix so radio groups are unique per form instance. */
  formId: string;
  onSetRole: (key: string, role: GalleryImageRole) => void;
  onMove: (key: string, dir: -1 | 1) => void;
  onRemove: (key: string) => void;
}

/**
 * One draft image: thumbnail + position number, before/after/other role radios,
 * reorder up/down buttons, and a remove button. Local (pending) files render
 * with a plain <img> object-URL; uploaded images use next/image.
 */
export function ImageCard({
  image,
  index,
  total,
  formId,
  onSetRole,
  onMove,
  onRemove,
}: ImageCardProps) {
  const isPending = image.pathname === null;
  const badge = ROLE_BADGE[image.role];

  return (
    <li className="card flex items-center gap-3 p-3 shadow-card">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {isPending ? (
          image.isHeic ? (
            <div className="flex size-full flex-col items-center justify-center bg-secondary text-secondary-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wide">HEIC</span>
              <span className="text-[8px] text-muted-foreground">on upload</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- local object-URL preview pre-upload
            <img src={image.url} alt="" className="size-full object-cover" />
          )
        ) : (
          <Image
            src={image.url}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
        <span className="absolute left-1 top-1 rounded bg-surface-dark/80 px-1.5 text-[10px] font-bold text-surface-dark-foreground">
          {index + 1}
        </span>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", badge.className)}
          >
            {badge.label}
          </span>
          {isPending && (
            <span className="text-[10px] font-medium text-muted-foreground">Not uploaded yet</span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {(["before", "after", "other"] as const).map((role) => (
            <label key={role} className="inline-flex cursor-pointer items-center gap-1.5 font-medium">
              <input
                type="radio"
                name={`${formId}-${image.key}-role`}
                checked={image.role === role}
                onChange={() => onSetRole(image.key, role)}
                className="size-3.5 accent-[var(--color-primary)]"
              />
              <span className="capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={() => onMove(image.key, -1)}
          disabled={index === 0}
          aria-label="Move image up"
          className="rounded-md border border-border p-1.5 text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowUp className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onMove(image.key, 1)}
          disabled={index === total - 1}
          aria-label="Move image down"
          className="rounded-md border border-border p-1.5 text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowDown className="size-3.5" aria-hidden />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(image.key)}
        aria-label="Remove image"
        className="shrink-0 rounded-md border border-border p-1.5 text-destructive transition-colors hover:bg-destructive/10"
      >
        <X className="size-4" aria-hidden />
      </button>
    </li>
  );
}
