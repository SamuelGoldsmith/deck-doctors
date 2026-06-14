// app/api/estimates/route.ts
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
    const result = await sql`
      SELECT * FROM estimate_requests
      ORDER BY submitted_at DESC;
    `;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch estimate requests:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
