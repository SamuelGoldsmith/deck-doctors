// app/api/deck-estimates/select/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "", 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const rows = await sql`
      SELECT * FROM deck_estimates WHERE id = ${id} LIMIT 1;
    `;
    return NextResponse.json(rows[0] ?? null);
  } catch (error) {
    console.error("Failed to fetch deck estimate:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
