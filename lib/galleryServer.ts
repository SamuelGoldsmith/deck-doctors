import {
  GALLERY_TAGS,
  MAX_GALLERY_IMAGES,
  type GalleryImageInput,
  type GalleryImageRole,
  type GalleryTag,
} from "./utils";

/** Keep only known gallery tags, de-duplicated, order preserved. */
export function sanitizeTags(tags: unknown): GalleryTag[] {
  if (!Array.isArray(tags)) return [];
  const set = new Set<GalleryTag>();
  for (const t of tags) {
    if (typeof t === "string" && (GALLERY_TAGS as string[]).includes(t)) {
      set.add(t as GalleryTag);
    }
  }
  return [...set];
}

/**
 * Validate + canonicalize the image list for a job group:
 *  - drop malformed entries, cap at MAX_GALLERY_IMAGES
 *  - order by the provided `position`, then renumber 0..n
 *  - enforce at most one 'before' and one 'after' (first wins; extras -> 'other')
 */
export function normalizeImages(images: unknown): GalleryImageInput[] {
  if (!Array.isArray(images)) return [];
  const valid = images
    .filter(
      (i): i is GalleryImageInput =>
        !!i && typeof i.pathname === "string" && typeof i.url === "string"
    )
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .slice(0, MAX_GALLERY_IMAGES);

  let sawBefore = false;
  let sawAfter = false;
  return valid.map((img, idx) => {
    let role: GalleryImageRole =
      img.role === "before" || img.role === "after" ? img.role : "other";
    if (role === "before") {
      if (sawBefore) role = "other";
      else sawBefore = true;
    }
    if (role === "after") {
      if (sawAfter) role = "other";
      else sawAfter = true;
    }
    return { pathname: img.pathname, url: img.url, role, position: idx };
  });
}
