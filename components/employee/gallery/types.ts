import type { GalleryImageRole } from "@/lib/utils";

/**
 * A working image in the editor. It either references an already-uploaded blob
 * (existing image, or a freshly-uploaded one) via `pathname`/`url`, or it holds
 * a not-yet-uploaded local `file` shown with an object-URL preview.
 *
 * On submit, every draft without a `pathname` is uploaded via
 * `uploadGalleryImage(file)`; the resulting `{pathname,url}` is then assembled
 * into `GalleryImageInput[]` in display order.
 */
export interface DraftImage {
  /** Stable client-side key for React lists / drag handles. */
  key: string;
  /** Blob pathname — present for existing or already-uploaded images. */
  pathname: string | null;
  /** Display URL — blob URL for uploaded, object URL for pending files. */
  url: string;
  role: GalleryImageRole;
  /** The raw file, only present while it still needs uploading. */
  file: File | null;
  /** HEIC/HEIF source: no in-browser preview; converted to JPEG on upload. */
  isHeic?: boolean;
}

export type UploadPhase =
  | { kind: "idle" }
  | { kind: "uploading"; done: number; total: number }
  | { kind: "saving" }
  | { kind: "error"; message: string };
