// app/api/hours/clock-in/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "employee" || !session.user.eid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { jid, latitude, longitude } = await request.json();
        const eid = session.user.eid;

        const open = await sql`SELECT hid FROM hours WHERE eid = ${eid} AND clock_out_at IS NULL LIMIT 1;`;
        if (open.length > 0) {
            return NextResponse.json({ error: "Already clocked in" }, { status: 409 });
        }

        const result = await sql`
            INSERT INTO hours (eid, jid, date_worked, clock_in_at, clock_in_latitude, clock_in_longitude)
            VALUES (${eid}, ${jid}, CURRENT_DATE, now(), ${latitude}, ${longitude})
            RETURNING *;
        `;
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
