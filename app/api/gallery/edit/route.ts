// app/api/gallery/edit/route.ts — update a gallery group's title/tags and its
// image set (roles, order, additions). Images dropped from the set are deleted
// from Blob too.
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { del } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import type { GalleryGroupInput } from "@/lib/utils";
import { normalizeImages, sanitizeTags } from "@/lib/galleryServer";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as GalleryGroupInput;
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: "Missing group id" }, { status: 400 });
    }

    const images = normalizeImages(body.images);
    if (images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    const title = body.title?.trim() ? body.title.trim() : null;
    const tags = sanitizeTags(body.tags);

    // Blobs present before this edit, so we can delete the ones being removed.
    const existing = await sql`SELECT pathname, url FROM gallery_images WHERE group_id = ${id};`;
    const keptPathnames = new Set(images.map((i) => i.pathname));
    const removedUrls = existing
      .filter((row) => !keptPathnames.has(String(row.pathname)))
      .map((row) => String(row.url));

    await sql`
      UPDATE gallery_groups SET title = ${title}, tags = ${tags} WHERE id = ${id};
    `;

    // Replace the image rows wholesale (positions + roles all change on reorder).
    await sql`DELETE FROM gallery_images WHERE group_id = ${id};`;
    const placeholders = images
      .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
      .join(", ");
    const params = images.flatMap((img) => [id, img.pathname, img.url, img.role, img.position]);
    await sql.query(
      `INSERT INTO gallery_images (group_id, pathname, url, role, position) VALUES ${placeholders};`,
      params
    );

    if (removedUrls.length > 0) {
      await del(removedUrls).catch((e) => console.error("Blob cleanup failed:", e));
    }

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to edit gallery group:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
