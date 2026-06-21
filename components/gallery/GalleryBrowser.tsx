"use client";

import { useMemo, useState } from "react";
import { ImageOff, ListFilter } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectShowcase } from "@/components/gallery/ProjectShowcase";
import {
  GALLERY_TAGS,
  GALLERY_TAG_LABELS,
  cn,
  type GalleryGroup,
  type GalleryTag,
} from "@/lib/utils";

interface GalleryBrowserProps {
  groups: GalleryGroup[];
}

export function GalleryBrowser({ groups }: GalleryBrowserProps) {
  // Active tags act as an OR filter. Empty set === "All".
  const [active, setActive] = useState<Set<GalleryTag>>(new Set());

  // Only surface filter chips for tags that actually appear in the data, so the
  // bar never advertises a category that yields zero results.
  const availableTags = useMemo(() => {
    const present = new Set<GalleryTag>();
    for (const g of groups) for (const t of g.tags) present.add(t);
    return GALLERY_TAGS.filter((t) => present.has(t));
  }, [groups]);

  const filtered = useMemo(() => {
    if (active.size === 0) return groups;
    return groups.filter((g) => g.tags.some((t) => active.has(t)));
  }, [groups, active]);

  function toggle(tag: GalleryTag) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clear() {
    setActive(new Set());
  }

  const allActive = active.size === 0;

  if (groups.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        message="Our gallery is being refreshed with our latest transformations. Check back soon."
      />
    );
  }

  return (
    <div className="space-y-10">
      {availableTags.length > 0 && (
        <div className="space-y-4">
          <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap items-center gap-2"
          >
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <ListFilter className="h-3.5 w-3.5" />
              Filter
            </span>

            <FilterChip active={allActive} onClick={clear} aria-pressed={allActive}>
              All
            </FilterChip>

            {availableTags.map((tag) => {
              const isActive = active.has(tag);
              return (
                <FilterChip
                  key={tag}
                  active={isActive}
                  onClick={() => toggle(tag)}
                  aria-pressed={isActive}
                >
                  {GALLERY_TAG_LABELS[tag]}
                </FilterChip>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            {!allActive && " in selected categories"}
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching projects"
          message="No projects fit the selected categories. Try clearing your filters."
          action={
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-card transition-opacity hover:opacity-90"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-2">
          {filtered.map((group, i) => (
            <Reveal key={group.id} delay={(i % 2) * 100}>
              <ProjectShowcase group={group} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  className,
  ...props
}: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        active
          ? "border-accent bg-accent text-accent-foreground shadow-card"
          : "border-border bg-background text-foreground hover:border-accent hover:text-accent",
        className
      )}
      {...props}
    />
  );
}

function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <ImageOff className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="font-display text-h3 font-semibold text-primary">{title}</h2>
      <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
