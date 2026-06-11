// app/api/applications/[id]/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const VALID_STATUSES = ["new", "reviewing", "interview", "hired", "rejected"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = await parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status, notes } = body;

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      await sql`
        UPDATE job_applications
        SET status = ${status}
        WHERE id = ${id};
      `;
    }

    if (notes !== undefined) {
      await sql`
        UPDATE job_applications
        SET notes = ${notes}
        WHERE id = ${id};
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}