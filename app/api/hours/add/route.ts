// app/api/employees/add/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Employee } from "@/lib/utils";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { eid, jid, date_worked, clock_in_at, clock_out_at } = await request.json();

        // Manual entry: no GPS, so location_verified stays NULL. Hours are
        // derived from clock_in_at/clock_out_at, never stored.
        const result = await sql`
            INSERT INTO hours (eid, jid, date_worked, clock_in_at, clock_out_at)
            VALUES (${eid}, ${jid}, ${date_worked}, ${clock_in_at}, ${clock_out_at})
            RETURNING *;
        `;
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
