"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImageOff, Pencil, Trash2 } from "lucide-react";
import { GALLERY_TAG_LABELS, cn, type GalleryGroup } from "@/lib/utils";

interface GroupRowProps {
  group: GalleryGroup;
  index: number;
  total: number;
  busy: boolean;
  onEdit: (group: GalleryGroup) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

/** A single existing gallery job in the manager list. */
export function GroupRow({ group, index, total, busy, onEdit, onDelete, onMove }: GroupRowProps) {
  const sorted = [...group.images].sort((a, b) => a.position - b.position);
  const cover = sorted.find((i) => i.role === "before") ?? sorted[0] ?? null;
  const before = sorted.find((i) => i.role === "before");
  const after = sorted.find((i) => i.role === "after");

  return (
    <li className="card flex flex-col gap-4 p-4 shadow-card sm:flex-row sm:items-center">
      {/* Reorder */}
      <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
        <button
          type="button"
          onClick={() => onMove(group.id, -1)}
          disabled={busy || index === 0}
          aria-label="Move job up"
          className="rounded-md border border-border p-1.5 transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowUp className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onMove(group.id, 1)}
          disabled={busy || index === total - 1}
          aria-label="Move job down"
          className="rounded-md border border-border p-1.5 transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowDown className="size-4" aria-hidden />
        </button>
      </div>

      {/* Cover thumbnail */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {cover ? (
          <Image src={cover.url} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" aria-hidden />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="truncate font-display text-lg font-semibold text-foreground">
          {group.title || <span className="italic text-muted-foreground">Untitled job</span>}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {group.tags.length > 0 ? (
            group.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground"
              >
                {GALLERY_TAG_LABELS[tag]}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {group.images.length} photo{group.images.length === 1 ? "" : "s"}
          {before ? " · Before set" : ""}
          {after ? " · After set" : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onEdit(group)}
          disabled={busy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold transition-colors",
            "hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(group.id)}
          disabled={busy}
          aria-label="Delete job"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
