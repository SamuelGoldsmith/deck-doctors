// app/api/gallery/add/route.ts — create a new gallery job group + its images.
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
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
    const images = normalizeImages(body.images);
    if (images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const title = body.title?.trim() ? body.title.trim() : null;
    const tags = sanitizeTags(body.tags);
    const createdBy = session.user?.email ?? null;

    const posRow = await sql`SELECT COALESCE(MAX(position), -1) + 1 AS pos FROM gallery_groups;`;
    const position = Number(posRow[0].pos);

    await sql`
      INSERT INTO gallery_groups (id, title, tags, position, created_by)
      VALUES (${id}, ${title}, ${tags}, ${position}, ${createdBy});
    `;

    const placeholders = images
      .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
      .join(", ");
    const params = images.flatMap((img) => [id, img.pathname, img.url, img.role, img.position]);
    await sql.query(
      `INSERT INTO gallery_images (group_id, pathname, url, role, position) VALUES ${placeholders};`,
      params
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to add gallery group:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
