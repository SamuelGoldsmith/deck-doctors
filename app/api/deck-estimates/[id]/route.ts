// app/api/deck-estimates/[id]/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

const VALID_STATUSES = ["draft", "ready", "quoted", "converted", "archived"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status, final_quote, jid } = body;

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      await sql`UPDATE deck_estimates SET status = ${status} WHERE id = ${id};`;
    }
    if (final_quote !== undefined) {
      await sql`UPDATE deck_estimates SET final_quote = ${final_quote} WHERE id = ${id};`;
    }
    if (jid !== undefined) {
      await sql`UPDATE deck_estimates SET jid = ${jid} WHERE id = ${id};`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to patch deck estimate:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
