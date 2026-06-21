// app/api/gallery/reorder/route.ts — persist a new page order for job groups.
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { order } = await request.json();
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Expected an array of group ids" }, { status: 400 });
    }
    await Promise.all(
      order.map((id: string, i: number) =>
        sql`UPDATE gallery_groups SET position = ${i} WHERE id = ${id};`
      )
    );
    return NextResponse.json({ message: "Order updated" });
  } catch (error) {
    console.error("Failed to reorder gallery groups:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
