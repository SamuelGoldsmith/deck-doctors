// app/api/deck-estimates/list/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const rows = await sql`
      SELECT * FROM deck_estimates
      ORDER BY created_at DESC;
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch deck estimates:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
