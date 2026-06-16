// app/api/deck-estimates/edit/route.ts
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
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
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
      UPDATE deck_estimates SET
        cid = ${body.cid ?? null},
        customer_name = ${body.customer_name},
        phone = ${body.phone || null},
        email = ${body.email || null},
        address = ${body.address},
        city = ${body.city || null},
        state_abr = ${state},
        total_sq_ft = ${totalSqFt},
        suggested_total = ${suggested},
        final_quote = ${finalQuote},
        status = ${body.status},
        data = ${JSON.stringify(data ?? {})}::jsonb,
        latitude = ${lat},
        longitude = ${lng}
      WHERE id = ${body.id}
      RETURNING *;
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Failed to update deck estimate:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
