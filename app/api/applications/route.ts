// app/api/applications/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
 
const sql = neon(process.env.DATABASE_URL!);
 
export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM job_applications
      ORDER BY submitted_at DESC;
    `;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
 