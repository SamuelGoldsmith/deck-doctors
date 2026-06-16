// app/api/deck-estimates/delete/route.ts
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
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await sql`DELETE FROM deck_estimates WHERE id = ${Number(id)};`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete deck estimate:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
