"use client";

import { upload } from "@vercel/blob/client";

/**
 * Client-side Vercel Blob upload for gallery photos.
 *
 * We use the client `upload()` flow (not a server route with `put()`) so large
 * phone photos aren't capped by the 4.5 MB serverless request-body limit — the
 * browser streams straight to Blob after the server mints a scoped token at
 * /api/gallery/blob-upload (which checks the manager session).
 *
 * Files are stored under an opaque GUID pathname (gallery/<uuid>.<ext>); ALL
 * display metadata lives in Postgres (see lib/utils.ts GalleryGroupInput),
 * never in the filename.
 */

const MAX_DIMENSION = 2400; // longest edge, px — keeps blobs lean + display fast
const JPEG_QUALITY = 0.85;
const DOWNSCALEABLE = new Set(["image/jpeg", "image/png", "image/webp"]);

export interface UploadedBlob {
  pathname: string;
  url: string;
}

const HEIC_EXTENSION = /\.(heic|heif)$/i;

/** HEIC/HEIF photos (iPhone "High Efficiency"). Detected by MIME or extension —
 *  Windows often reports an empty MIME type for .heic files. */
export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif" || HEIC_EXTENSION.test(file.name);
}

/** Browsers can't canvas-decode HEIC, so convert + upload server-side. */
async function uploadHeicViaServer(file: File): Promise<UploadedBlob> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/gallery/convert-heic", { method: "POST", body: form });
  if (!res.ok) {
    throw new Error("Could not process HEIC image");
  }
  return (await res.json()) as UploadedBlob;
}

function extensionFor(file: File, encodedAsJpeg: boolean): string {
  if (encodedAsJpeg) return "jpg";
  const fromName = file.name.includes(".") ? file.name.split(".").pop()! : "";
  if (fromName) return fromName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const fromType = file.type.split("/")[1] ?? "bin";
  return fromType.toLowerCase();
}

/**
 * Downscale + re-encode large JPEG/PNG/WebP to a capped-size JPEG via canvas.
 * Returns the original file untouched for small files or formats the browser
 * can't decode in a canvas (e.g. HEIC) — those upload as-is.
 */
async function prepareForUpload(file: File): Promise<{ body: Blob; encodedAsJpeg: boolean }> {
  if (!DOWNSCALEABLE.has(file.type)) return { body: file, encodedAsJpeg: false };

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    // Already small enough and already a JPEG → no work needed.
    if (scale === 1 && file.type === "image/jpeg") {
      bitmap.close();
      return { body: file, encodedAsJpeg: false };
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return { body: file, encodedAsJpeg: false };
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) return { body: file, encodedAsJpeg: false };
    return { body: blob, encodedAsJpeg: true };
  } catch {
    // Decode failed (corrupt or unsupported) — let the original upload through.
    return { body: file, encodedAsJpeg: false };
  }
}

/** Prepare + upload a single image to Blob. Resolves to its pathname + public URL. */
export async function uploadGalleryImage(file: File): Promise<UploadedBlob> {
  // HEIC/HEIF can't be decoded in the browser — convert it server-side instead.
  if (isHeicFile(file)) return uploadHeicViaServer(file);

  const { body, encodedAsJpeg } = await prepareForUpload(file);
  const pathname = `gallery/${crypto.randomUUID()}.${extensionFor(file, encodedAsJpeg)}`;
  const result = await upload(pathname, body, {
    access: "public",
    handleUploadUrl: "/api/gallery/blob-upload",
    contentType: encodedAsJpeg ? "image/jpeg" : file.type || undefined,
  });
  return { pathname: result.pathname, url: result.url };
}
