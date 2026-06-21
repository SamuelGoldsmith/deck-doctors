// app/api/gallery/delete/route.ts — delete a gallery job group, its image rows
// (ON DELETE CASCADE), and the underlying Blob files.
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { del } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing group id" }, { status: 400 });
    }

    const images = await sql`SELECT url FROM gallery_images WHERE group_id = ${id};`;
    const urls = images.map((row) => String(row.url));

    await sql`DELETE FROM gallery_groups WHERE id = ${id};`; // cascades to images

    if (urls.length > 0) {
      await del(urls).catch((e) => console.error("Blob cleanup failed:", e));
    }

    return NextResponse.json({ message: "Gallery job deleted" });
  } catch (error) {
    console.error("Failed to delete gallery group:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
