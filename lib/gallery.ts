import { neon } from "@neondatabase/serverless";
import type { GalleryGroup, GalleryImage, GalleryTag } from "./utils";

const sql = neon(process.env.DATABASE_URL!);

/**
 * Fetch every gallery job group with its images, ordered for display
 * (groups by `position` then newest first; images by `position`).
 *
 * This is a public, read-only fetch (the gallery page is public) so it queries
 * Neon directly rather than re-fetching a session-gated API route. Both the
 * public gallery page (SSR) and GET /api/gallery/list use it.
 */
export async function getGalleryGroups(): Promise<GalleryGroup[]> {
  const groupRows = await sql`
    SELECT id, title, tags, position, created_by, created_at, updated_at
    FROM gallery_groups
    ORDER BY position ASC, created_at DESC;
  `;

  if (groupRows.length === 0) return [];

  const imageRows = await sql`
    SELECT id, group_id, pathname, url, role, position
    FROM gallery_images
    ORDER BY position ASC, id ASC;
  `;

  const imagesByGroup = new Map<string, GalleryImage[]>();
  for (const row of imageRows) {
    const img: GalleryImage = {
      id: Number(row.id),
      group_id: String(row.group_id),
      pathname: String(row.pathname),
      url: String(row.url),
      role: row.role,
      position: Number(row.position),
    };
    const list = imagesByGroup.get(img.group_id);
    if (list) list.push(img);
    else imagesByGroup.set(img.group_id, [img]);
  }

  return groupRows.map((g) => ({
    id: String(g.id),
    title: g.title ?? null,
    tags: (g.tags ?? []) as GalleryTag[],
    position: Number(g.position),
    created_by: g.created_by ?? null,
    created_at: g.created_at as string,
    updated_at: g.updated_at as string,
    images: imagesByGroup.get(String(g.id)) ?? [],
  }));
}
