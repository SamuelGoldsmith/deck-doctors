// app/api/deck-estimates/add/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { DeckEstimateInput, finalQuoteValue } from "@/lib/utils";
import { geocodeAddress } from "@/lib/geocode";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as DeckEstimateInput;
    const createdBy = session.user?.email ?? null;
    const data = body.data;
    const totalSqFt = data?.totalSqFt ?? null;
    const suggested = data?.suggestedTotal ?? null;
    const finalQuote = data ? finalQuoteValue(data) : null;
    const state = body.state_abr ? body.state_abr.slice(0, 2) : null;

    let lat: number | null = null;
    let lng: number | null = null;
    if (body.address) {
      const coords = await geocodeAddress(body.address, body.city || "", body.state_abr || "");
      lat = coords?.lat ?? null;
      lng = coords?.lng ?? null;
    }

    const rows = await sql`
      INSERT INTO deck_estimates
        (created_by, cid, jid, customer_name, phone, email, address, city, state_abr,
         total_sq_ft, suggested_total, final_quote, status, data, latitude, longitude)
      VALUES
        (${createdBy}, ${body.cid ?? null}, ${body.jid ?? null}, ${body.customer_name},
         ${body.phone || null}, ${body.email || null}, ${body.address}, ${body.city || null}, ${state},
         ${totalSqFt}, ${suggested}, ${finalQuote}, ${body.status || "draft"},
         ${JSON.stringify(data ?? {})}::jsonb, ${lat}, ${lng})
      RETURNING *;
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Failed to add deck estimate:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
