"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MAX_GALLERY_IMAGES,
  cn,
  type GalleryGroup,
  type GalleryGroupInput,
  type GalleryImageInput,
  type GalleryImageRole,
  type GalleryTag,
} from "@/lib/utils";
import { isHeicFile, uploadGalleryImage } from "@/lib/galleryClient";
import { TagSelector } from "./TagSelector";
import { ImageCard } from "./ImageCard";
import type { DraftImage, UploadPhase } from "./types";

interface GalleryGroupFormProps {
  /** Existing group when editing; null/undefined when creating a new one. */
  group?: GalleryGroup | null;
  /** Persist the assembled input. Returns whether the save succeeded. */
  onSubmit: (input: GalleryGroupInput) => Promise<boolean>;
  /** Close/reset the form (only shown in edit mode). */
  onCancel?: () => void;
}

function draftFromGroup(group: GalleryGroup): DraftImage[] {
  return [...group.images]
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      key: `existing-${img.id}`,
      pathname: img.pathname,
      url: img.url,
      role: img.role,
      file: null,
    }));
}

let draftCounter = 0;
function nextKey() {
  draftCounter += 1;
  return `draft-${Date.now()}-${draftCounter}`;
}

export function GalleryGroupForm({ group, onSubmit, onCancel }: GalleryGroupFormProps) {
  const isEdit = Boolean(group);
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(group?.title ?? "");
  const [tags, setTags] = useState<GalleryTag[]>(group?.tags ?? []);
  const [images, setImages] = useState<DraftImage[]>(group ? draftFromGroup(group) : []);
  const [phase, setPhase] = useState<UploadPhase>({ kind: "idle" });

  const busy = phase.kind === "uploading" || phase.kind === "saving";
  const remaining = MAX_GALLERY_IMAGES - images.length;

  const toggleTag = useCallback((tag: GalleryTag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).filter(
      (f) => f.type.startsWith("image/") || isHeicFile(f)
    );
    setImages((prev) => {
      const room = MAX_GALLERY_IMAGES - prev.length;
      const accepted = incoming.slice(0, Math.max(0, room));
      const drafts: DraftImage[] = accepted.map((file) => {
        const heic = isHeicFile(file);
        return {
          key: nextKey(),
          pathname: null,
          // HEIC can't be previewed in-browser — no object URL; show a placeholder.
          url: heic ? "" : URL.createObjectURL(file),
          role: "other",
          file,
          isHeic: heic,
        };
      });
      return [...prev, ...drafts];
    });
    setPhase({ kind: "idle" });
  }, []);

  // Setting a before/after on one image clears that same role from any other.
  const setRole = useCallback((key: string, role: GalleryImageRole) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.key === key) return { ...img, role };
        if (role !== "other" && img.role === role) return { ...img, role: "other" };
        return img;
      })
    );
  }, []);

  const moveImage = useCallback((key: string, dir: -1 | 1) => {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const removeImage = useCallback((key: string) => {
    setImages((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found?.file && found.url.startsWith("blob:")) URL.revokeObjectURL(found.url);
      return prev.filter((i) => i.key !== key);
    });
  }, []);

  function reset() {
    images.forEach((i) => {
      if (i.file && i.url.startsWith("blob:")) URL.revokeObjectURL(i.url);
    });
    setTitle("");
    setTags([]);
    setImages([]);
    setPhase({ kind: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    const pending = images.filter((i) => i.file && i.pathname === null);

    try {
      // 1) Upload any not-yet-uploaded files, one at a time, tracking progress.
      const uploaded = new Map<string, { pathname: string; url: string }>();
      if (pending.length > 0) {
        setPhase({ kind: "uploading", done: 0, total: pending.length });
        for (let i = 0; i < pending.length; i += 1) {
          const draft = pending[i];
          const result = await uploadGalleryImage(draft.file!);
          uploaded.set(draft.key, result);
          setPhase({ kind: "uploading", done: i + 1, total: pending.length });
        }
      }

      // 2) Assemble images in display order; position = display index.
      setPhase({ kind: "saving" });
      const payloadImages: GalleryImageInput[] = images.map((img, position) => {
        const up = uploaded.get(img.key);
        return {
          pathname: up?.pathname ?? img.pathname!,
          url: up?.url ?? img.url,
          role: img.role,
          position,
        };
      });

      const input: GalleryGroupInput = {
        ...(group ? { id: group.id } : {}),
        title: title.trim() === "" ? null : title.trim(),
        tags,
        images: payloadImages,
      };

      const ok = await onSubmit(input);
      if (!ok) {
        setPhase({ kind: "error", message: "Could not save. Please try again." });
        return;
      }

      if (isEdit) {
        // Parent unmounts the form on a successful edit; nothing else to do.
        setPhase({ kind: "idle" });
      } else {
        reset();
      }
    } catch {
      setPhase({ kind: "error", message: "Something went wrong while uploading. Please try again." });
    }
  }

  const submitLabel = useMemo(() => {
    if (phase.kind === "uploading") return `Uploading ${phase.done}/${phase.total}…`;
    if (phase.kind === "saving") return "Saving…";
    return isEdit ? "Save changes" : "Publish job";
  }, [phase, isEdit]);

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-title`}>Title (optional)</Label>
        <Input
          id={`${formId}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Lakeside Trex Rebuild"
          disabled={busy}
          maxLength={120}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (optional)</Label>
        <TagSelector selected={tags} onToggle={toggleTag} />
      </div>

      {/* Image picker */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-2">
          <Label>Photos</Label>
          <span
            className={cn(
              "text-xs font-medium",
              remaining <= 0 ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {images.length}/{MAX_GALLERY_IMAGES} used
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy || remaining <= 0}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border bg-card/50 px-4 py-8 text-center transition-colors",
            "hover:border-accent hover:bg-secondary/50",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <ImagePlus className="size-6 text-accent" aria-hidden />
          <span className="text-sm font-semibold text-foreground">
            {remaining <= 0 ? "Maximum photos reached" : "Add photos"}
          </span>
          <span className="text-xs text-muted-foreground">
            {remaining <= 0
              ? `Remove a photo to add another (max ${MAX_GALLERY_IMAGES}).`
              : `Up to ${remaining} more · large phone photos are downscaled automatically`}
          </span>
        </button>

        {images.length > 0 && (
          <>
            <p className="pt-1 text-xs text-muted-foreground">
              Order top-to-bottom is the display order. Pick one Before and one After for the
              comparison slider; everything else stays as Other.
            </p>
            <ul className="space-y-2">
              {images.map((image, index) => (
                <ImageCard
                  key={image.key}
                  image={image}
                  index={index}
                  total={images.length}
                  formId={formId}
                  onSetRole={setRole}
                  onMove={moveImage}
                  onRemove={removeImage}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      {phase.kind === "error" && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {phase.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={handleSubmit} disabled={busy || images.length === 0}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {submitLabel}
        </Button>
        {isEdit && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            <X className="size-4" aria-hidden />
            Cancel
          </Button>
        )}
        {!isEdit && (title || tags.length > 0 || images.length > 0) && (
          <Button type="button" variant="ghost" onClick={reset} disabled={busy}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
