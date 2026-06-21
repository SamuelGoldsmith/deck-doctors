// app/api/gallery/list/route.ts — public list of gallery job groups + images.
// Used by the employee manager UI to refresh after edits. The public gallery
// page reads getGalleryGroups() directly during SSR.
import { NextResponse } from "next/server";
import { getGalleryGroups } from "@/lib/gallery";

export async function GET() {
  try {
    const groups = await getGalleryGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Failed to list gallery groups:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
